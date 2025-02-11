package reusable

import (
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Read file content by converting multipart.File into []byte
func ReadFileContentByte(fileContent io.Reader, c *gin.Context) []byte {
	fileBytes, err := io.ReadAll(fileContent) //Reading from multipart.File variable and serving []byte variable to use with database
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file content"})
		fmt.Println(err)
		fmt.Println("Stage III error")
		return nil
	}
	return fileBytes
}
