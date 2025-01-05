package middlewares

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

//Description :-
/*
This middleware works as a authorization checker which will check authority.
When it is applied on a route ,it will check user session for email existence.
If email exists in session then the route will work as defined .
If email doesn't exist then user will be redirected to login page "/login-page".
*/
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
