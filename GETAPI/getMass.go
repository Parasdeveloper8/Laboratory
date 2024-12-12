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

func AtomicMassAPI(c *gin.Context) {

	// Open the elements file
	file, err := os.Open("D:/laboratory/JSON/elements.json") // Path to elements.json
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
	var elements []reusable_structs.Element
	if err := json.Unmarshal(bytes, &elements); err != nil {
		log.Fatalf("Failed to parse JSON: %v", err) //parse to json failed
	}
	c.JSON(200, gin.H{"data": elements})

}
