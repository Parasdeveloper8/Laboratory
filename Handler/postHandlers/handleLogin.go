package postHandlers

import (
	reusable "Laboratory/Reusable"
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

/*
This function uses reusable login method .
*/
func HandleLogin(c *gin.Context) {
	email := c.PostForm("email")
	pass := c.PostForm("password")
	_, err := reusable.SqlLogin(email, pass, c) //Reusable login method
	fmt.Println(err)
	session := sessions.Default(c)

	// Set session values
	session.Set("username", reusable.Name)
	session.Set("email", reusable.Mail)
	session.Set("profileId", reusable.ProfileId)

	err = session.Save()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
		return
	}
	c.Redirect(http.StatusSeeOther, "/afterlogin")
}
