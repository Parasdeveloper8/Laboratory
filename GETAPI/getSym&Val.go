package GETAPI

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"encoding/json"
	"log"

	"github.com/gin-gonic/gin"
)

//pipelines ahead

/*
Function to send elements2.json to frontend for creating chemical formulaes.
*/
func GetSymbolValency(c *gin.Context) {
	//Stage I
	file := reusable.OpenJSONFile("D:/laboratory/JSON/elements2.json")
	defer file.Close()

	//Stage II
	bytes := reusable.ReadJSONfileByte(file)

	//channel
	elemVal := make(chan []reusable_structs.ElementsValAnCation)

	go func() {
		//Stage III
		// Parse JSON into slice of elements
		var elemWithValency []reusable_structs.ElementsValAnCation // struct in Structs/Struct4.go
		if err := json.Unmarshal(bytes, &elemWithValency); err != nil {
			log.Fatalf("Failed to parse JSON: %v", err) //parse to json failed
		}
		//sender
		elemVal <- elemWithValency

		close(elemVal)

	}()
	//receiver
	elemValData := <-elemVal

	c.JSON(200, gin.H{"data": elemValData})
}
