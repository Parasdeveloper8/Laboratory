package deleteroutes

import (
	reusable "Laboratory/Reusable"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

/*
This function deletes image of user on the basis of email
which is extracted from path parameters.
*/
func HandleDeleteImage(c *gin.Context) {
	email := c.Param("email")
	// Delete image from database
	db := reusable.LoadSQLStructConfigs(c)
	defer db.Close()
	//I am using update query to set image's url to null
	query := "update laboratory.users set profile_image = null where email=?"
	_, err := db.Exec(query, email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		fmt.Println("Failed to delete Image from database")
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}
