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

/*
This function handles submission of answers.
It puts answers to their related question_id in database.
*/
func HandlePostAns(c *gin.Context) {
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

	//extract answer and que_id from path parameters.
	answer := c.Param("answer")
	que_id := c.Param("id")

	// Get the session
	session := sessions.Default(c)
	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)
	//Retrieve the username from the session
	sessionUserName, _ := session.Get("username").(string)

	//query to insert answer in database
	query := "insert into laboratory.answers(text,email,id,username) values(?,?,?,?)"
	_, err = db.Exec(query, answer, sessionEmail, que_id, sessionUserName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save answer in database"})
		fmt.Println(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"response": "success"})
}
