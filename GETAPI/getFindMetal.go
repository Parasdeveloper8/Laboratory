package GETAPI

import (
	reusable_structs "Laboratory/Structs"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

/*
Function to send non-metal-loids.json as a response
to frontend for fetching category of elements
*/
func MetalOrNotAPI(c *gin.Context) {
	// Open the elements file
	file, err := os.Open("D:/laboratory/JSON/non-metal-loids.json") // Path to elements.json
	if err != nil {
		fmt.Printf("Could not open file: %v\n", err) //Could not open file

	}
	defer file.Close()

	// Read file contents
	bytes, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Printf("Could not read file: %v\n", err) //Could not read file contents

	}

	// Parse JSON into slice of elements
	var findMetals []reusable_structs.FindMetal //Find Metal struct in Structs/Struct3.go
	if err := json.Unmarshal(bytes, &findMetals); err != nil {
		log.Fatalf("Failed to parse JSON: %v", err) //parse to json failed
	}
	c.JSON(200, gin.H{"data": findMetals})
}
