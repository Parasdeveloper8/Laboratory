package postroutes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandlePost(c *gin.Context) {
	//single file upload
	file, err := c.FormFile("file")
	if err != nil {
		c.String(http.StatusBadRequest, "Failed to upload file: %s", err)
		return
	}
	//save file to server
	err = c.SaveUploadedFile(file, "./Uploads/"+file.Filename)
	if err != nil {
		c.String(http.StatusInternalServerError, "Unable to save file: %s", err)
		return
	}
	c.String(http.StatusOK, "File uploaded successfully: %s", file.Filename)
}
