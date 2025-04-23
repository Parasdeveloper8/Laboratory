package deleteHandlers

import (
	reusable "Laboratory/Reusable"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

/*
This function handles own post deletion on the basis of post_id extracted from
path parameters.
*/
func HandleDeletePost(c *gin.Context) {
	post_id := c.Param("post_id")

	// Delete post from database
	db := reusable.LoadSQLStructConfigs(c)
	defer db.Close()
	//delete all data of post
	query := "DELETE FROM laboratory.posts WHERE post_id = ?"
	_, err := db.Exec(query, post_id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		fmt.Println("Failed to delete post from database")
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}
