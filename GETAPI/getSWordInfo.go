package GETAPI

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"encoding/json"
	"log"

	"github.com/gin-gonic/gin"
)

//This function sends information related to given word
//Data is taken from json file

func SansWordInfo(c *gin.Context) {
	//Stage I
	file := reusable.OpenJSONFile("D:/laboratory/JSON/sanskrit1.json")
	defer file.Close()

	//Stage II
	bytes := reusable.ReadJSONfileByte(file)

	//channel
	findinfo := make(chan []reusable_structs.Sanskrit)

	go func() {
		//Stage III
		// Parse JSON into slice of information
		var findInform []reusable_structs.Sanskrit //Sanskrit struct in Structs/Struct4.go
		if err := json.Unmarshal(bytes, &findInform); err != nil {
			log.Fatalf("Failed to parse JSON: %v", err) //parse to json failed
		}
		//sender
		findinfo <- findInform
		close(findinfo)
	}()

	//receiver
	receiverFindMtls := <-findinfo

	c.JSON(200, gin.H{"data": receiverFindMtls})
}
