package GETAPI

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"encoding/json"
	"log"

	"github.com/gin-gonic/gin"
)

//Pipelines ahead

/*
Function to send non-metal-loids.json as a response
to frontend for fetching category of elements
*/
func MetalOrNotAPI(c *gin.Context) {
	//Stage I
	file := reusable.OpenJSONFile("D:/laboratory/JSON/non-metal-loids.json")
	defer file.Close()

	//Stage II
	bytes := reusable.ReadJSONfileByte(file)

	//channel
	findmtls := make(chan []reusable_structs.FindMetal)

	go func() {
		//Stage III
		// Parse JSON into slice of elements
		var findMetals []reusable_structs.FindMetal //Find Metal struct in Structs/Struct3.go
		if err := json.Unmarshal(bytes, &findMetals); err != nil {
			log.Fatalf("Failed to parse JSON: %v", err) //parse to json failed
		}
		//sender
		findmtls <- findMetals
		close(findmtls)
	}()

	//receiver
	receiverFindMtls := <-findmtls

	c.JSON(200, gin.H{"data": receiverFindMtls})
}
