package postroutes

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image"
	_ "image/gif"  // For GIF
	_ "image/jpeg" // For JPEG
	_ "image/png"  // For PNG
	"net/http"

	"github.com/gin-gonic/gin"
)

// Extract data in tabular form
func HandleProcessStats(c *gin.Context) {
	//question := c.PostForm("stats")

	file := reusable.ParseReqFile("file", c)

	fileContent := reusable.ReadFileContent(file, c)
	defer fileContent.Close()

	fileBytes := reusable.ReadFileContentByte(fileContent, c)

	// Convert image to Base64
	imageBase64 := base64.StdEncoding.EncodeToString(fileBytes)

	configs, err := reusable_structs.Init()
	if err != nil {
		fmt.Println("Failed to load configurations", err)
	}

	//API key
	apikey := configs.API_KEY_HUG

	//API of model
	api := "https://api-inference.huggingface.co/models/microsoft/table-transformer-structure-recognition-v1.1-all"

	//Decoded image
	decodeImg, _, err := image.Decode(bytes.NewReader(fileBytes))
	if err != nil {
		fmt.Printf("Failed to decode image %v", err)
	}
	//height of decoded image
	height := decodeImg.Bounds().Dy()
	width := decodeImg.Bounds().Dx()

	//Input to AI model
	payload := map[string]any{
		"inputs": map[string]any{
			"image": imageBase64,
			"size": map[string]int{
				"shortest_edge": height,
				"longest_edge":  width,
			},
		},
	}
	//fmt.Printf("Payload %v\n", payload)
	//payload map[string]string to []byte
	payloadBytes, _ := json.Marshal(payload)
	//Creates http request
	req, _ := http.NewRequest("POST", api, bytes.NewBuffer(payloadBytes))

	// Set headers
	req.Header.Set("Authorization", "Bearer "+apikey)
	req.Header.Set("Content-Type", "application/json")

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer resp.Body.Close()

	//request status code
	statusCode := resp.StatusCode
	type FailReq struct {
		Status     string
		StatusCode int
		Body       interface{}
	}
	if statusCode != 200 {
		var res = &FailReq{Status: resp.Status, StatusCode: resp.StatusCode, Body: resp.Body}
		fmt.Println(res)
	}

	var data map[string]interface{}
	//Decode json and store in &data
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		fmt.Printf("Failed to decode :%v ", err)
	}
	fmt.Println(data)
	//Extract text from response
	if len(data) > 0 {
		if generatedText, ok := data["generated_text"].(string); ok {
			fmt.Println("Text:", generatedText)

			var extractData map[string]interface{}
			//unmarshal generated text and store data
			err := json.Unmarshal([]byte(generatedText), &extractData)
			if err != nil {
				fmt.Println("Failed to unmarshal json :", err)
			}
			//send response in string
			c.JSON(http.StatusOK, gin.H{"response": extractData})
		}
	} else {
		fmt.Println("response from api is empty")
	}
}
