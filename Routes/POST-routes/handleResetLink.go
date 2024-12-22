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

func ResetLink(c *gin.Context) {
	configs, err := reusable_structs.Init()
	if err != nil {
		log.Printf("Failesd to load configurations: %v", err)
	}

	var passData struct {
		Email string `json:"email" binding:"required,email"`
	}
	// Bind JSON data from the request body
	if err := c.ShouldBindJSON(&passData); err != nil {
		log.Printf("Invalid input: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input. Please provide a valid email."})
		return
	}

	db, err := sql.Open("mysql", configs.DB_URL)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection error"})
		return
	}
	defer db.Close()

	// Check if the email exists
	var emailExists string
	query := "SELECT email FROM laboratory.users WHERE email = ?"
	err = db.QueryRow(query, passData.Email).Scan(&emailExists)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Email not found"})
		return
	} else if err != nil {
		log.Printf("Database query error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query error"})
		return
	}
	// Success response
	c.JSON(http.StatusOK, gin.H{"message": "Password reset link generated successfully"})
	subject := "Password Reset Link"
	body := fmt.Sprintf("This is your password reset link: http://localhost:4900/resetpasspage")
	err = reusable.SendMail(passData.Email, subject, body)
	if err != nil {
		log.Printf("Failed to send email: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
		return
	}
}
