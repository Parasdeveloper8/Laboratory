package GETAPI

import (
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetImages(c *gin.Context) {
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
	query := "select base64string ,uploaded_at,email,title from laboratory.posts"
	rows, err := db.Query(query)
	if err != nil {
		log.Printf("Failed to get images data %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var blog reusable_structs.BlogsData
		err := rows.Scan(&blog.Base64string, &blog.Uploaded_at, &blog.Email, &blog.Title)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
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
