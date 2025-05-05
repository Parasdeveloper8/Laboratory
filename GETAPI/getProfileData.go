package GETAPI

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

/*
Function to fetch profile data of user on the basis of email.
*/
func ProfileDataAPI(c *gin.Context) {
	db := reusable.LoadSQLStructConfigs(c)
	defer db.Close()
	//query to get images

	// Retrieve the profile id from the path params
	profileId := c.Param("profileId")

	query := "select profile_image,name,email,role,about from laboratory.users where profileId=?"
	rows := db.QueryRow(query, profileId)

	var profile reusable_structs.ProfileData //Structs/Struct2.go
	//Scanning rows 'values
	err := rows.Scan(&profile.Profile_image, &profile.Name, &profile.Email, &profile.Role, &profile.About)
	if err != nil {
		log.Printf("Failed to scan row: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": profile})
}
