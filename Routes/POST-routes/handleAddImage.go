package postroutes

import (
	reusable "Laboratory/Reusable"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

/*
This function add image to user profile on the basis of email given.
*/
func HandleAddImage(c *gin.Context) {
	// Parse the file from the request
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file"})
		return
	}
	// Read file content
	fileContent, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file content"})
		return
	}
	defer fileContent.Close()
	//Read file content
	fileBytes, err := io.ReadAll(fileContent) //Reading from multipart.File variable and serving []byte variable to use with database
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file content"})
		return
	}

	db := reusable.LoadSQLStructConfigs(c)

	// Get the session
	session := sessions.Default(c)
	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)
	//I am using update query to insert image or replace old image by new image.
	query := "update laboratory.users set profile_image = ? where email = ?"
	result, err := db.Exec(query, fileBytes, sessionEmail)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Failed to insert data into database %v", err)})
		return
	}
	c.Redirect(http.StatusSeeOther, "/profile")
	fmt.Println(result)
}
