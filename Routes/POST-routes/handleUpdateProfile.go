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

	newName := c.PostForm("new-name")
	newRole := c.PostForm("new-role")

	query := "UPDATE laboratory.users SET name = ?, role = ? WHERE email = ?"
	result, err := db.Exec(query, newName, newRole, sessionEmail)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Failed to update data in database %v", err)})
		return
	}

	fmt.Println(result)
	c.Redirect(http.StatusSeeOther, "/profile?profile=updated profile")
}
