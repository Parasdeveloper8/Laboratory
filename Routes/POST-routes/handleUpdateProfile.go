package postroutes

import (
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func HandleUpdateProfile(c *gin.Context) {
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

	session := sessions.Default(c)
	sessionEmail, _ := session.Get("email").(string)

	var FrontendData struct {
		Name string `json:"Name"`
		Role string `json:"Role"`
	}

	if err := c.ShouldBindJSON(&FrontendData); err != nil {
		fmt.Println("Binding Error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	query := "UPDATE laboratory.users SET name = ?, role = ? WHERE email = ?"
	result, err := db.Exec(query, FrontendData.Name, FrontendData.Role, sessionEmail)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Failed to update data in database %v", err)})
		return
	}

	fmt.Println(result)
	var profile = &reusable_structs.ProfileData{Name: FrontendData.Name, Role: FrontendData.Role}
	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully", "data": profile})
}
