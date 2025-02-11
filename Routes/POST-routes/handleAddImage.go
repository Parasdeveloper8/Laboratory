package postroutes

import (
	reusable "Laboratory/Reusable"
	"database/sql"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// We will use data processing pipeline ahead

// Parse the file from the request
func parseReqFile(name string, c *gin.Context) *multipart.FileHeader {
	file, err := c.FormFile(name)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file"})
		fmt.Println(err)
		fmt.Println("Stage I error")
		return nil
	}
	return file
}

// Read file content
func readFileContent(file *multipart.FileHeader, c *gin.Context) multipart.File {
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

// Read file content by converting multipart.File into []byte
func readFileContentByte(fileContent io.Reader, c *gin.Context) []byte {
	fileBytes, err := io.ReadAll(fileContent) //Reading from multipart.File variable and serving []byte variable to use with database
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file content"})
		fmt.Println(err)
		fmt.Println("Stage III error")
		return nil
	}
	return fileBytes
}

// Insert Image
func insertImage(c *gin.Context, db *sql.DB, query string, fileBytes []byte, sessionEmail string) sql.Result {
	result, err := db.Exec(query, fileBytes, sessionEmail)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Failed to insert data into database %v", err)})
		fmt.Println(err)
		fmt.Println("Stage IV error")
		return nil
	}
	return result
}

/*
This function add image to user profile on the basis of email given.
*/
func HandleAddImage(c *gin.Context) {
	//Stage I
	file := parseReqFile("image", c)

	//Stage II
	fileContent := readFileContent(file, c)
	defer fileContent.Close() //avoiding memory leaks

	//Stage III
	fileBytes := readFileContentByte(fileContent, c)

	db := reusable.LoadSQLStructConfigs(c)

	// Get the session
	session := sessions.Default(c)
	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)

	//I am using update query to insert image or replace old image by new image.
	query := "update laboratory.users set profile_image = ? where email = ?"

	Resultchan := make(chan sql.Result)
	go func() {
		//Stage IV
		result := insertImage(c, db, query, fileBytes, sessionEmail)
		Resultchan <- result
		close(Resultchan) // Close channel after sending to prevent deadlocks
	}()

	//receiver
	result := <-Resultchan
	c.Redirect(http.StatusSeeOther, "/profile")
	fmt.Println(result)
}
