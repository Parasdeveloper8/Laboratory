package GETAPI

import (
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetComments(c *gin.Context) {
	//Get the post id from the URL
	post_id := c.Param("post_id")

	//Lets create a api to get comments
	var comments_struct_slice []reusable_structs.Comments //struct in struct3.go
	//Get the comments from the database
	configs, err := reusable_structs.Init()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to load configurations"})
		return
	}
	db, err := sql.Open("mysql", configs.DB_URL)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	defer db.Close()
	//query to get comments from the database
	query := "select comments.comment_text,comments.email from laboratory.comments where post_id = ?"
	rows, err := db.Query(query, post_id)
	if err != nil {
		log.Printf("Failed to get profile data %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var comments reusable_structs.Comments
		err := rows.Scan(&comments.Comment_Text, &comments.Email)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		comments_struct_slice = append(comments_struct_slice, comments)
	}
	//if any error during iteration
	if err := rows.Err(); err != nil {
		log.Printf("Row iteration error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": comments_struct_slice})
}
