package GETAPI

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// this function works as API to get likes of post from database
// It counts number of distinct emails of each post id
func GetPostLikes(c *gin.Context) {
	db := reusable.LoadSQLStructConfigs(c)

	//struct in Structs/Struct4.go
	var likes []reusable_structs.PostLikes

	defer db.Close()

	//query
	query := "select post_id ,count(distinct email) as likes_number from laboratory.postlikes group by post_id"
	rows, err := db.Query(query)
	if err != nil {
		log.Printf("Failed to get Likes %v", err)
	}
	defer rows.Close()
	/*
		Iterate over returned rows and scan all returned rows 'values on each iteration
		into struct's fields using rows.Next()
	*/
	for rows.Next() {
		var rlikes reusable_structs.PostLikes
		err := rows.Scan(&rlikes.PostId, &rlikes.Likes_Number)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		//append struct in slice to hold multiple values
		likes = append(likes, rlikes)
	}

	//if any error during iteration
	if err := rows.Err(); err != nil {
		log.Printf("Row iteration error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": likes})
}
