package postroutes

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

/*
This function handles search and return results related to given text in query string
*/
func HandleSearch(c *gin.Context) {
	var blogsData []reusable_structs.BlogsData //converting struct into slice because we will return multiple posts not a single post details
	//Get the val from query string
	title := c.Query("val")

	db := reusable.LoadSQLStructConfigs(c)
	defer db.Close()
	//Query to fetch posts related to query strings
	query := `SELECT 
    users.name,
    posts.base64string,
    posts.email,
    posts.title,
    posts.post_id,
    users.profile_image AS user_img,
    posts.uploaded_at
FROM 
    laboratory.posts
JOIN 
    laboratory.users 
ON 
    posts.email = users.email
WHERE 
    posts.title LIKE CONCAT('%', ?, '%')`

	rows, err := db.Query(query, title)
	if err != nil {
		log.Printf("Failed to get data %v", err)
	}
	defer rows.Close()

	/*
		Iterate over returned rows and scan all returned rows 'values on each iteration
		into struct's fields using rows.Next()
	*/
	for rows.Next() {
		var blog reusable_structs.BlogsData
		err := rows.Scan(&blog.UserName, &blog.Base64string, &blog.Email, &blog.Title, &blog.Post_Id, &blog.User_Image, &blog.Uploaded_at)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		//Converting Uint8 to time.Time
		decodedTime, _ := reusable.Uint8ToTime(blog.Uploaded_at)
		//Formatting decodedTime variable
		formattedTime := decodedTime.Format("2006-01-02 15:04:05")
		//Adding formatted time to FormattedTime field
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
