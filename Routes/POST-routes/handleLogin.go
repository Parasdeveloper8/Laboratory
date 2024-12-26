package postroutes

import (
	reusable "Laboratory/Reusable"
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func HandleLogin(c *gin.Context) {
	email := c.PostForm("email")
	pass := c.PostForm("password")
	_, err := reusable.SqlLogin(email, pass, c)
	fmt.Println(err)
	session := sessions.Default(c)

	// Set session values
	session.Set("username", reusable.Name)
	session.Set("email", reusable.Mail)
	err = session.Save()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
		return
	}
	c.Redirect(http.StatusSeeOther, "/afterlogin")
}
