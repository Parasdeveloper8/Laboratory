package GETAPI

import (
	reusable_structs "Laboratory/Structs"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

//Pipelines ahead

// Open file and read content in byte
func OpenJSONFile(path string) *os.File {
	// Open the file
	file, err := os.Open(path) // Path to elements.json
	if err != nil {
		fmt.Printf("Could not open file: %v\n", err) //Could not open file
		fmt.Println("Stage I error")
	}
	fmt.Println("Successfully opened file")
	return file
}

// Read file contents in bytes
func ReadJSONfileByte(r io.Reader) []byte {
	// Read file contents
	bytes, err := ioutil.ReadAll(r)
	if err != nil {
		fmt.Printf("Could not read file: %v\n", err) //Could not read file contents
		fmt.Println("Stage II error")
	}
	fmt.Println("Successfully read file in []bytes")
	return bytes
}

/*
Function to send non-metal-loids.json as a response
to frontend for fetching category of elements
*/
func MetalOrNotAPI(c *gin.Context) {
	//Stage I
	file := OpenJSONFile("D:/laboratory/JSON/non-metal-loids.json")
	defer file.Close()

	//Stage II
	bytes := ReadJSONfileByte(file)

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
	receiverFindMtls := findmtls

	c.JSON(200, gin.H{"data": receiverFindMtls})
}
