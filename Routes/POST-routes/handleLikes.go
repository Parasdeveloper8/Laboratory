package postroutes

import (
	reusable "Laboratory/Reusable"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// This function adds email in database to given answer id
// Then we will count email to get number of likes
// This takes answer id from path parameters
func HandleLikes(c *gin.Context) {
	// Get the session
	session := sessions.Default(c)
	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)

	db := reusable.LoadSQLStructConfigs(c)

	//get answer id from path parameters
	ans_id := c.Param("ansId")

	//query
	query := "insert into laboratory.likes(email,ans_id) values(?,?)"
	_, err := db.Exec(query, sessionEmail, ans_id)
	if err != nil {
		log.Printf("Error on sending email and ansId %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
	}
	defer db.Close()
	c.JSON(http.StatusOK, gin.H{"info": "Successfully added your like"})
}
