package postroutes

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Answer string  `json:"answer"`
	Score  float64 `json:"score"`
}

func HandleProcessStats(c *gin.Context) {
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
	api := "https://api-inference.huggingface.co/models/"

	//Input to AI model
	payload := map[string]any{
		"inputs": map[string]any{
			"image":    imageBase64,
			"question": ,
		},
	}
	//fmt.Println(imageBase64)
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
	var respnse []Response
	// Read response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	err = json.Unmarshal(body, &respnse)
	if err != nil {
		fmt.Println(err)
	}
	//send response in string
	c.JSON(http.StatusOK, gin.H{"response": respnse})
}

//Models like Donut, TrOCR, or GOT-OCR2.0 can extract text and structure it into JSON format.
