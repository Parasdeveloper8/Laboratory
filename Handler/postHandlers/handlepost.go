package postHandlers

import (
	reusable "Laboratory/Reusable"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
)

// Insert Post
func insertPost(c *gin.Context, db *sql.DB, query string, filename string, fileBytes []byte, caption string, postId string, username string, sessionEmail string, category string) error {
	_, err := db.Exec(query, filename, fileBytes, sessionEmail, caption, postId, username, category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file to database"})
		fmt.Println(err)
		fmt.Println("Stage IV error")
		return err
	}
	return nil
}

/*
This function adds posts into DataBase
*/
func HandlePost(c *gin.Context) {
	db := reusable.LoadSQLStructConfigs(c)

	//Stage I
	file := reusable.ParseReqFile("file", c)

	caption := c.PostForm("caption")
	category := c.PostForm("category")

	//Stage II
	fileContent := reusable.ReadFileContent(file, c)
	defer fileContent.Close()

	//Stage III
	fileBytes := reusable.ReadFileContentByte(fileContent, c)

	//Generating post id to insert into database
	post_id := uuid.New().String()
	// Get the session
	session := sessions.Default(c)
	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)
	sessionUserName, _ := session.Get("username").(string)

	//insert file into DB
	query := "insert into laboratory.posts(name,base64string,email,title,post_id,username,category) values(?,?,?,?,?,?,?)"

	//Stage IV
	go func() {
		err := insertPost(c, db, query, file.Filename, fileBytes, caption, post_id, sessionUserName, sessionEmail, category)
		if err != nil {
			return
		}
	}()

	c.Redirect(http.StatusSeeOther, "/afterlogin")
}
