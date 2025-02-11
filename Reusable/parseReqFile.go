package reusable

import (
	"fmt"
	"mime/multipart"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Parse the file from the request
func ParseReqFile(name string, c *gin.Context) *multipart.FileHeader {
	file, err := c.FormFile(name)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file"})
		fmt.Println(err)
		fmt.Println("Stage I error")
		return nil
	}
	return file
}
