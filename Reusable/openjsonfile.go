package reusable

import (
	"fmt"
	"os"
)

// Open json file
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
