package postroutes

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func HandleLogout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()                                                      // Clear session data
	session.Save()                                                       // Save the cleared session
	c.Redirect(http.StatusSeeOther, "/?message=logout out successfully") // Redirect to home
}
