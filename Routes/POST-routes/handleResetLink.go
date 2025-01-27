package postroutes

import (
	reusable "Laboratory/Reusable"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// This function sends reset link to user's email to reset password
func ResetLink(c *gin.Context) {
	db := reusable.LoadSQLStructConfigs(c)
	var passData struct {
		Email string `json:"email" binding:"required,email"`
	}
	// Bind JSON data from the request body
	if err := c.ShouldBindJSON(&passData); err != nil {
		log.Printf("Invalid input: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input. Please provide a valid email."})
		return
	}
	defer db.Close()

	// Check if the email exists
	var emailExists string
	query := "SELECT email FROM laboratory.users WHERE email = ?"
	err := db.QueryRow(query, passData.Email).Scan(&emailExists)
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
	body := "This is your password reset link: http://localhost:4900/resetpasspage"
	err = reusable.SendMail(passData.Email, subject, body)
	if err != nil {
		log.Printf("Failed to send email: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
		return
	}
}
