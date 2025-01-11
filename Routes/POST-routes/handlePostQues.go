package postroutes

import (
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

/*
This function sends questions to database with a question id and user's details.
*/
func HandlePostQues(c *gin.Context) {
	//get question text from path parameters
	ques := c.Param("text")

	//get the category from path parameters
	category := c.Param("category")

	// Get the session
	session := sessions.Default(c)

	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)

	//Retrieve the username from the session
	sessionUserName, _ := session.Get("username").(string)

	//generate a unique id as question id
	que_id := uuid.New().String()

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

	//query to insert question in database
	query := "insert into laboratory.questions(text,email,username,id,category) values(?,?,?,?,?)"
	_, err = db.Exec(query, ques, sessionEmail, sessionUserName, que_id, category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file to database"})
		fmt.Println(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully posted question"})
}
