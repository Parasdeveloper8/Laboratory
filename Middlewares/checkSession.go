package middlewares

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

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
