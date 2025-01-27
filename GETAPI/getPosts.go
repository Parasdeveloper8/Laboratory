package GETAPI

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

/*
Function to get posts from database.
To reduce latency in response and load on server ,it has two variables rowF and limits.
rowF and limits are fetched from path parameters row and limit respectively.
*/
func GetPosts(c *gin.Context) {
	rowF := c.Param("row")
	limits := c.Param("limit")
	var blogsData []reusable_structs.BlogsData //converting struct into slice because we will return multiple posts not a single post details
	db := reusable.LoadSQLStructConfigs(c)
	defer db.Close()
	//query to get images
	//query posts from database and send on frontend on the basis of rows and limits.
	query := `SELECT 
	users.name,
    posts.base64string,
    posts.email,
    posts.title,
	posts.post_id,
    users.profile_image AS user_img,
	posts.uploaded_at,
	posts.category
FROM 
    laboratory.posts
JOIN 
    laboratory.users 
ON 
    posts.email = users.email ORDER BY posts.uploaded_at DESC LIMIT ?,? 
`
	rows, err := db.Query(query, rowF, limits)
	if err != nil {
		log.Printf("Failed to get images data %v", err)
	}
	defer rows.Close()

	/*
		Iterate over returned rows and scan all returned rows 'values on each iteration
		into struct's fields using rows.Next()
	*/
	for rows.Next() {
		var blog reusable_structs.BlogsData
		err := rows.Scan(&blog.UserName, &blog.Base64string, &blog.Email, &blog.Title, &blog.Post_Id, &blog.User_Image, &blog.Uploaded_at, &blog.Category)
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
