package middlewares

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

//Description:-
/*
It is applied on "/" route .
It will work when user will visit website.
This middleware checks if a user is logged in or not
If user is not logged in ,it will redirect to "/" route ,if user is logged in ,then
it will redirect to "/afterlogin".
*/
func CheckSession() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the session
		session := sessions.Default(c)
		if session.Get("email") != nil {
			c.Redirect(http.StatusSeeOther, "/afterlogin")
			c.Abort()
		}
		c.Next()
	}

}
