package reusable

import (
	"fmt"
	"io"
	"io/ioutil"
)

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
