package postHandlers

import (
	reusable "Laboratory/Reusable"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// This function adds email in database to given post id
// Then we will count email to get number of likes
// This takes post id from path parameters
func HandlePostLikes(c *gin.Context) {
	// Get the session
	session := sessions.Default(c)
	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)

	db := reusable.LoadSQLStructConfigs(c)

	//get post id from path parameters
	post_id := c.Param("postId")

	//lets check if like by sessionEmail in database is already present
	query := "select postlikes.post_id , postlikes.email from laboratory.postlikes where post_id = ?"
	rows, err := db.Query(query, post_id)
	if err != nil {
		fmt.Println("Failed to query row", err)
	}

	//let's bind returned rows
	type returnedRows struct {
		Email  string `db:"email"`
		PostId string `db:"post_id"`
	}
	for rows.Next() {
		var r returnedRows
		err := rows.Scan(&r.PostId, &r.Email)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		if r.Email == sessionEmail {
			log.Println("You have already liked post")
			c.JSON(http.StatusBadRequest, gin.H{"info": "You have already liked post"})
			return //Stop function executing further
		}
	}

	//query
	query = "insert into laboratory.postlikes(email,post_id) values(?,?)"
	_, err = db.Exec(query, sessionEmail, post_id)
	if err != nil {
		log.Printf("Error on sending email and postId %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
	}
	defer db.Close()
	c.JSON(http.StatusOK, gin.H{"info": "Successfully added your like"})
}
