package GETAPI

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

/*
Function to fetch profile data of user on the basis of email.
*/
func ProfileDataAPI(c *gin.Context) {
	db := reusable.LoadSQLStructConfigs(c)
	defer db.Close()
	//query to get images
	// Get the session
	session := sessions.Default(c)

	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)
	query := "select profile_image,name,email,role,about from laboratory.users where email=?"
	rows := db.QueryRow(query, sessionEmail)

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
