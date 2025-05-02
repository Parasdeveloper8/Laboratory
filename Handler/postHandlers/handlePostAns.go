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
This function handles submission of answers.
It puts answers to their related question_id in database.
*/
func HandlePostAns(c *gin.Context) {
	db := reusable.LoadSQLStructConfigs(c)
	defer db.Close()

	//struct to hold json body data sent from frontend
	var Data struct {
		Id     string `json:"id"`
		Answer string `json:"answer"`
	}

	// Get the session
	session := sessions.Default(c)
	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)
	//Retrieve the username from the session
	sessionUserName, _ := session.Get("username").(string)

	//generate answerId
	ans_id := uuid.New().String()

	//bind json body to struct
	if err := c.ShouldBindJSON(&Data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to bind json body"})
		return
	}

	//query to insert answer in database
	query := "insert into laboratory.answers(text,email,id,username,ans_id ) values(?,?,?,?,?)"
	_, err := db.Exec(query, &Data.Answer, sessionEmail, &Data.Id, sessionUserName, ans_id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save answer in database"})
		fmt.Println(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"response": "success"})
}
