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
	//struct to hold json body data sent from frontend
	var Data struct {
		Text     string `json:"text"`
		Category string `json:"category"`
	}

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

	//bind json body to struct
	if err := c.ShouldBindJSON(&Data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to bind json body"})
		return
	}

	//query to insert question in database
	query := "insert into laboratory.questions(text,email,username,id,category) values(?,?,?,?,?)"
	_, err := db.Exec(query, &Data.Text, sessionEmail, sessionUserName, que_id, &Data.Category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file to database"})
		fmt.Println(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully posted question"})
}
