package deleteroutes

import (
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
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
	configs, err := reusable_structs.Init()
	if err != nil {
		log.Printf("Failed to load configurations: %v", err)
	}

	db, err := sql.Open("mysql", configs.DB_URL)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	defer db.Close()
	//I am using update query to set image's url to null
	query := "update laboratory.users set profile_image = null where email=?"
	_, err = db.Exec(query, email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		fmt.Println("Failed to delete Image from database")
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}
