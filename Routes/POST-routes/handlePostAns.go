package postroutes

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

/*
This function handles submission of answers.
It puts answers to their related question_id in database.
*/
func HandlePostAns(c *gin.Context) {
	answer := c.Param("answer")
	que_id := c.Param("id")

	// Get the session
	session := sessions.Default(c)
	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)
	//Retrieve the username from the session
	sessionUserName, _ := session.Get("username").(string)

	c.JSON(http.StatusOK, gin.H{"answer": answer, "que_id": que_id, "email": sessionEmail, "user": sessionUserName})
}
