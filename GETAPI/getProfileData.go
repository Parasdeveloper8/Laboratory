package GETAPI

import (
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

/*
Function to fetch profile data of user on the basis of email.
*/
func ProfileDataAPI(c *gin.Context) {
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
	query := "select profile_image,name,email,role from laboratory.users where email=?"
	rows := db.QueryRow(query, sessionEmail)

	var profile reusable_structs.ProfileData
	//Scanning rows 'values
	err = rows.Scan(&profile.Profile_image, &profile.Name, &profile.Email, &profile.Role)
	if err != nil {
		log.Printf("Failed to scan row: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": profile})
}
