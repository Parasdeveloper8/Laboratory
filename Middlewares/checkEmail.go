package middlewares

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func CheckEmail() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the session
		session := sessions.Default(c)

		// Retrieve the email from the session
		sessionEmail, ok := session.Get("email").(string)
		if !ok || sessionEmail == "" {
			// If email is not set or invalid, redirect to login page
			c.Redirect(http.StatusFound, "/login-page")
			c.Abort()
			return
		}
		c.Next()
	}
}
