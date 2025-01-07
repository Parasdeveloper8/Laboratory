package postroutes

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

/*
After reset link sent,this function will handle further process of password reset.
*/
func ResetPassword(c *gin.Context) {
	configs, err := reusable_structs.Init()
	if err != nil {
		log.Printf("Failed to load configurations: %v", err)
	}
	db, err := sql.Open("mysql", configs.DB_URL)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection error"})
		return
	}
	defer db.Close()
	email := c.PostForm("email")
	newPassword := c.PostForm("new-password")

	// Hash the password
	hashedPassword, err := reusable.HashPassword(newPassword)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to hash password"})
		return
	}
	//update password
	query := "UPDATE laboratory.users SET password = ? WHERE email = ?"
	result, err := db.Exec(query, hashedPassword, email)
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println(result)
	c.Redirect(http.StatusSeeOther, "/login-page?message=password change successfully")
}
