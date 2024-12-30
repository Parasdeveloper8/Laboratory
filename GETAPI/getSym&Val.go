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

func GetSymbolValency(c *gin.Context) {
	// Open the elements2 file
	file, err := os.Open("D:/laboratory/JSON/elements2.json") // Path to elements.json
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
	var elemWithValency []reusable_structs.ElementsValAnCation // struct in Structs/Struct4.go
	if err := json.Unmarshal(bytes, &elemWithValency); err != nil {
		log.Fatalf("Failed to parse JSON: %v", err) //parse to json failed
	}
	c.JSON(200, gin.H{"data": elemWithValency})
}
