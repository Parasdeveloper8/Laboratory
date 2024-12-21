package postroutes

import (
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func HandleComments(c *gin.Context) {
	//Get the post id from the URL
	post_id := c.Param("post_id")

	var requestBody struct {
		Comment string `json:"comment"` // Bind the 'comment' field
	}

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if requestBody.Comment == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Comment is required"})
		return
	}

	// Get the session
	session := sessions.Default(c)
	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)
	//Lets insert the comment into the database

	//First load configurations from reusable_structs
	configs, err := reusable_structs.Init()
	if err != nil {
		fmt.Println("Failed to load configurations", err)
	}
	db, err := sql.Open("mysql", configs.DB_URL)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	defer db.Close()

	query := "insert into laboratory.comments(comment_text,post_id,email) values(?,?,?)"
	_, err = db.Exec(query, requestBody.Comment, post_id, sessionEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Comment added successfully"})
	fmt.Println("Comment added successfully")
}
