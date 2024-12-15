package postroutes

import (
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func HandleChangeImage(c *gin.Context) {
	// Parse the file from the request
	file, err := c.FormFile("imageChanged")
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

	config, err := reusable_structs.Init()
	if err != nil {
		log.Fatalf("Failed to load configurations %v", err)
	}
	db, err := sql.Open("mysql", config.DB_URL)
	if err != nil {
		log.Fatalf("Failed to connect to database %v", err)
	}

	// Get the session
	session := sessions.Default(c)
	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)

	query := "update laboratory.users set profile_image = ? where email = ?"
	result, err := db.Exec(query, fileBytes, sessionEmail)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Failed to insert data into database %v", err)})
		return
	}
	c.Redirect(http.StatusSeeOther, "/profile")
	fmt.Println(result)
}
