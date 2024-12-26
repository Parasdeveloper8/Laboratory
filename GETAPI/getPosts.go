package GETAPI

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetPosts(c *gin.Context) {
	var blogsData []reusable_structs.BlogsData
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
	query := `SELECT 
	users.name,
    posts.base64string,
    posts.email,
    posts.title,
	posts.post_id,
    users.profile_image AS user_img,
	uploaded_at
FROM 
    laboratory.posts
JOIN 
    laboratory.users 
ON 
    posts.email = users.email;`
	rows, err := db.Query(query)
	if err != nil {
		log.Printf("Failed to get images data %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var blog reusable_structs.BlogsData
		err := rows.Scan(&blog.UserName, &blog.Base64string, &blog.Email, &blog.Title, &blog.Post_Id, &blog.User_Image, &blog.Uploaded_at)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		decodedTime, _ := reusable.Uint8ToTime(blog.Uploaded_at)
		formattedTime := decodedTime.Format("2006-01-02 15:04:05")

		blog.FormattedTime = formattedTime

		blogsData = append(blogsData, blog)
	}
	//if any error during iteration
	if err := rows.Err(); err != nil {
		log.Printf("Row iteration error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": blogsData})
}
