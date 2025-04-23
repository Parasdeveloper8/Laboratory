package postHandlers

import (
	reusable "Laboratory/Reusable"
	"fmt"
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

	//lets check if like by sessionEmail in database is already present
	query := "select likes.ans_id , likes.email from laboratory.likes where ans_id = ?"
	rows, err := db.Query(query, ans_id)
	if err != nil {
		fmt.Println("Failed to query row", err)
	}

	//let's bind returned rows
	type returnedRows struct {
		Email string `db:"email"`
		AnsId string `db:"ans_id"`
	}
	for rows.Next() {
		var r returnedRows
		err := rows.Scan(&r.AnsId, &r.Email)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		if r.Email == sessionEmail {
			log.Println("You have already liked post")
			c.JSON(http.StatusBadRequest, gin.H{"info": "You have already liked answer"})
			return //Stop function executing further
		}
	}
	//query
	query = "insert into laboratory.likes(email,ans_id) values(?,?)"
	_, err = db.Exec(query, sessionEmail, ans_id)
	if err != nil {
		log.Printf("Error on sending email and ansId %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
	}
	defer db.Close()
	c.JSON(http.StatusOK, gin.H{"info": "Successfully added your like"})
}
