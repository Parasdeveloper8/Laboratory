package GETAPI

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func GetMyPosts(c *gin.Context) {
	var MypostsData []reusable_structs.MyPosts
	config, err := reusable_structs.Init()
	if err != nil {
		fmt.Println("Failed to load configurations", err)
	}

	db, err := sql.Open("mysql", config.DB_URL)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	defer db.Close()
	//query to get images
	// Get the session
	session := sessions.Default(c)

	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)
	query := "select title,base64string,uploaded_at,post_id from laboratory.posts where email=?"
	rows, err := db.Query(query, sessionEmail)
	if err != nil {
		log.Printf("Failed to get profile data %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var posts reusable_structs.MyPosts
		err := rows.Scan(&posts.Title, &posts.Base64string, &posts.Uploaded_at, &posts.Post_id)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		decodedTime, _ := reusable.Uint8ToTime(posts.Uploaded_at)
		formattedTime := decodedTime.Format("2006-01-02 15:04:05")

		posts.Formattedtime = formattedTime
		MypostsData = append(MypostsData, posts)
	}
	//if any error during iteration
	if err := rows.Err(); err != nil {
		log.Printf("Row iteration error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": MypostsData})
}
