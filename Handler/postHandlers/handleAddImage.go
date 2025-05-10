package postHandlers

import (
	reusable "Laboratory/Reusable"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// We will use data processing pipeline ahead

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
	file := reusable.ParseReqFile("image", c)

	//Stage II
	fileContent := reusable.ReadFileContent(file, c)
	defer fileContent.Close() //avoiding memory leaks

	//Stage III
	fileBytes := reusable.ReadFileContentByte(fileContent, c)

	db := reusable.LoadSQLStructConfigs(c)

	// Get the session
	session := sessions.Default(c)
	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)
	//Retrieve the profileId from the session
	sessionProfileId, _ := session.Get("profileId").(string)

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
	c.Redirect(http.StatusSeeOther, "/profile/"+sessionProfileId+"/"+sessionProfileId)
	fmt.Println(result)
}
