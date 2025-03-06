package postroutes

import (
	reusable "Laboratory/Reusable"
	statistics "Laboratory/Statistics"
	reusable_structs "Laboratory/Structs"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// Extract data in JSON format
func HandleProcessStats(c *gin.Context) {
	var class_interval []string
	var frequencies []float64
	var cumulativeFreq []float64
	//make response variable global
	//var Response map[string]interface{}

	configs, err := reusable_structs.Init()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load config"})
		return
	}

	//Get choice of user what he wants to find eg.Mean,Mode or Median
	choice := c.PostForm("stats")

	apiKey := configs.SPACE_OCR_KEY //API key

	// Get uploaded file
	file := reusable.ParseReqFile("file", c)
	openedFile, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot open uploaded file"})
		return
	}
	defer openedFile.Close()

	// Read file into memory
	var fileBuffer bytes.Buffer
	if _, err := io.Copy(&fileBuffer, openedFile); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading file"})
		return
	}

	// Prepare multipart form for OCR API
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, _ := writer.CreateFormFile("file", file.Filename)
	part.Write(fileBuffer.Bytes())
	writer.WriteField("apikey", apiKey)
	writer.WriteField("language", "eng")
	writer.Close()

	// Send POST request to OCR API
	req, _ := http.NewRequest("POST", "https://api.ocr.space/parse/image", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send request to OCR API"})
		return
	}
	defer resp.Body.Close()

	// Parse API response
	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	// Extract text from response
	if parsedResults, ok := result["ParsedResults"].([]interface{}); ok && len(parsedResults) > 0 {
		if parsedText, ok := parsedResults[0].(map[string]interface{})["ParsedText"].(string); ok {
			// Clean OCR text
			cleaned := strings.ReplaceAll(parsedText, "\r\n", "\n")
			cleaned = strings.ReplaceAll(cleaned, "F requency", "Frequency") // Fix OCR error
			lines := strings.Split(cleaned, "\n")                            //Splits a string into a slice
			isFrequency := false

			for _, line := range lines {
				//remove whitespaces
				line = strings.TrimSpace(line)
				if line == "" || line == "Class" || line == "Class Interval" {
					continue //skip table names
				}
				if line == "Frequency" {
					isFrequency = true
					continue
				}
				if line == "Cf" || line == "CF" || line == "C.F" {
					if cf, err := strconv.Atoi(line); err == nil {
						cumulativeFreq = append(cumulativeFreq, float64(cf))
					}
				}
				// Sort data into ranges or frequencies
				if isFrequency {
					if freq, err := strconv.Atoi(line); err == nil {
						frequencies = append(frequencies, float64(freq))
					}

				} else {
					class_interval = append(class_interval, strings.ReplaceAll(line, " ", ""))
				}
			}
		}
	}
	if choice == "mean" {
		fmt.Println("Calculating Mean") //debugging line
		statistics.CalculateMean(class_interval, frequencies)
		//fmt.Println(mean)

	} else if choice == "mode" {
		fmt.Println("Calculating Mode") //debugging line
		statistics.CalculateMode(class_interval, frequencies, c)
	} else if choice == "median" {
		fmt.Println("Calculating Median") //debugging line
		statistics.CalculateMedian(class_interval, frequencies, cumulativeFreq, c)
		//fmt.Println(median)
	}
	// Error if no text found
	//c.JSON(http.StatusInternalServerError, gin.H{"error": "No text found in image or error occurred"})

}
