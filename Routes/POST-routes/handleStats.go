package postroutes

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// Extract data in JSON format
func HandleProcessStats(c *gin.Context) {
	configs, err := reusable_structs.Init()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load config"})
		return
	}

	apiKey := configs.SPACE_OCR_KEY

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
			// Step 1: Clean OCR text
			cleaned := strings.ReplaceAll(parsedText, "\r\n", "\n")
			cleaned = strings.ReplaceAll(cleaned, "F requency", "Frequency") // Fix OCR error
			lines := strings.Split(cleaned, "\n")                            //Splits a string into a slice

			// Step 2: Extract ranges and frequencies directly
			var ranges []string
			var frequencies []string
			isFrequency := false

			for _, line := range lines {
				//remove whitespaces
				line = strings.TrimSpace(line)
				if line == "" {
					continue
				}
				if line == "Frequency" {
					isFrequency = true
					continue
				}

				// Sort data into ranges or frequencies
				if isFrequency {
					//if freq, err := strconv.Atoi(line); err == nil {
					//frequencies = append(frequencies, freq)
					//}
					frequencies = append(frequencies, line)
				} else {
					ranges = append(ranges, strings.ReplaceAll(line, " ", ""))
				}
			}

			// Step 3: Create JSON response
			response := gin.H{
				"ranges":    ranges,
				"frequency": frequencies,
			}
			c.JSON(http.StatusOK, response)
			return
		}
	}

	// Error if no text found
	c.JSON(http.StatusInternalServerError, gin.H{"error": "No text found in image or error occurred"})
}
