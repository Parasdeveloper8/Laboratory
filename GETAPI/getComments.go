package GETAPI

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Function to fetch comments from database
func GetComments(c *gin.Context) {
	//Get the post id from the URL
	post_id := c.Param("post_id")

	//Lets create a api to get comments
	var comments_struct_slice []reusable_structs.Comments //struct in struct3.go
	//Get the comments from the database
	db := reusable.LoadSQLStructConfigs(c)
	defer db.Close()

	//query to get comments from the database
	//Fetch comments of specific post on the basis of its post_id
	query := "select comments.comment_text,comments.username ,time from laboratory.comments where post_id = ?"
	rows, err := db.Query(query, post_id)
	if err != nil {
		log.Printf("Failed to get profile data %v", err)
	}
	defer rows.Close()
	/*
		Iterate over returned rows and scan all returned rows 'values on each iteration
		into struct's fields using rows.Next()
	*/
	for rows.Next() {
		var comments reusable_structs.Comments
		err := rows.Scan(&comments.Comment_Text, &comments.UserName, &comments.TimeofComment)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		//Converting Uint8 to time.Time
		decodedTime, _ := reusable.Uint8ToTime(comments.TimeofComment)
		//Formatting decodedTime variable
		formattedTime := decodedTime.Format("2006-01-02 15:04:05")
		//Adding formatted time to FormattedTimeComment field
		comments.FormattedTimeComment = formattedTime
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
