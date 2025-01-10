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
	_ "github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
)

/*
This function adds posts into DataBase
*/
func HandlePost(c *gin.Context) {
	configs, err := reusable_structs.Init()
	if err != nil {
		fmt.Println("Failed to load configurations", err)
	}
	//fmt.Println(configs)
	db, err := sql.Open("mysql", configs.DB_URL)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	defer db.Close()
	// Parse the file from the request
	file, err := c.FormFile("file")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file"})
		return
	}
	caption := c.PostForm("caption")
	category := c.PostForm("category")

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
	//Generating post id to insert into database
	post_id := uuid.New().String()
	// Get the session
	session := sessions.Default(c)
	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)
	sessionUserName, _ := session.Get("username").(string)

	//insert file into DB
	query := "insert into laboratory.posts(name,base64string,email,title,post_id,username,category) values(?,?,?,?,?,?,?)"
	_, err = db.Exec(query, file.Filename, fileBytes, sessionEmail, caption, post_id, sessionUserName, category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file to database"})
		fmt.Println(err)
		return
	}

	c.Redirect(http.StatusSeeOther, "/afterlogin")
}
