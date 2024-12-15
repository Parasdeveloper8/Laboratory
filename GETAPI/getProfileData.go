package GETAPI

import (
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ProfileDataAPI(c *gin.Context) {
	var ProfileData []reusable_structs.ProfileData
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
	query := "select profile_image,name,email,role from laboratory.users"
	rows, err := db.Query(query)
	if err != nil {
		log.Printf("Failed to get profile data %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var profile reusable_structs.ProfileData
		err := rows.Scan(&profile.Profile_image, &profile.Name, &profile.Email, &profile.Role)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		ProfileData = append(ProfileData, profile)
	}
	//if any error during iteration
	if err := rows.Err(); err != nil {
		log.Printf("Row iteration error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ProfileData})
}
