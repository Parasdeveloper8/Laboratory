package postHandlers

import (
	reusable "Laboratory/Reusable"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

/*
After reset link sent,this function will handle further process of password reset.
*/
func ResetPassword(c *gin.Context) {
	db := reusable.LoadSQLStructConfigs(c)
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
	subject := "Password changed"
	body := fmt.Sprintf(`<html>
	        <body>
	        <h1>Password for your email %s changed</h1>
	        <p>If not by you,mail us<p/>
			<p>With regards<p>
			<p>Laboratory<p/>
			`, email)
	err = reusable.SendMail(email, subject, body)
	if err != nil {
		log.Printf("Failed to send email: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
		return
	}
	c.Redirect(http.StatusSeeOther, "/login-page?message=password change successfully")
}
