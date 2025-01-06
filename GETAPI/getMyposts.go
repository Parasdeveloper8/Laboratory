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

/*
Function to fetch own posts from database on the basis of user's email
To reduce latency in response and load on server ,it has two variables rowF and limits.
rowF and limits are fetched from path parameters row and limit respectively.
*/
func GetMyPosts(c *gin.Context) {
	rowF := c.Param("row")
	limits := c.Param("limit")
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
	//query posts from database and send on frontend on the basis of rows and limits.
	query := "select title,base64string,uploaded_at,post_id from laboratory.posts where email=? limit ?,?"
	rows, err := db.Query(query, sessionEmail, rowF, limits)
	if err != nil {
		log.Printf("Failed to get profile data %v", err)
	}
	defer rows.Close()

	/*
		Iterate over returned rows and scan all returned rows 'values on each iteration
		into struct's fields using rows.Next()
	*/
	for rows.Next() {
		var posts reusable_structs.MyPosts
		err := rows.Scan(&posts.Title, &posts.Base64string, &posts.Uploaded_at, &posts.Post_id)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		//Converting Uint8 to time.Time
		decodedTime, _ := reusable.Uint8ToTime(posts.Uploaded_at)
		//Formatting decodedTime variable
		formattedTime := decodedTime.Format("2006-01-02 15:04:05")
		//Adding formatted time to Formattedtime field
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
