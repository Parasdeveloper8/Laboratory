package postHandlers

import (
	reusable "Laboratory/Reusable"
	"fmt"
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

	db := reusable.LoadSQLStructConfigs(c)
	defer db.Close()

	//query to insert question in database
	query := "insert into laboratory.questions(text,email,username,id,category) values(?,?,?,?,?)"
	_, err := db.Exec(query, ques, sessionEmail, sessionUserName, que_id, category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file to database"})
		fmt.Println(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully posted question"})
}
