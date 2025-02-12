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
Function to send elements.json to frontend for fetching atomic mass of elements
*/
func AtomicMassAPI(c *gin.Context) {
	//Stage I
	file := reusable.OpenJSONFile("D:/laboratory/JSON/elements.json")
	defer file.Close()

	//Stage II
	bytes := reusable.ReadJSONfileByte(file)

	//channel
	elmnt := make(chan []reusable_structs.Element)
	go func() {
		//Stage III
		// Parse JSON into slice of elements
		var elements []reusable_structs.Element //Element struct in Structs/Struct.go
		if err := json.Unmarshal(bytes, &elements); err != nil {
			log.Fatalf("Failed to parse JSON: %v", err) //parse to json failed
		}
		//sender
		elmnt <- elements
		close(elmnt)
	}()
	//receiver
	elementfData := <-elmnt

	c.JSON(200, gin.H{"data": elementfData})

}
