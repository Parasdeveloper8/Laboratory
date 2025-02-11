package reusable

import (
	"fmt"
	"mime/multipart"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Read file content
func ReadFileContent(file *multipart.FileHeader, c *gin.Context) multipart.File {
	// Read file content
	fileContent, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file content"})
		fmt.Println(err)
		fmt.Println("Stage II error")
		return nil
	}
	return fileContent
}
