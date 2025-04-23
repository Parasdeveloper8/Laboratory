package postHandlers

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// This function Logouts the User by destroying session
func HandleLogout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()                                                      //destroy session                                                  // Clear session data
	session.Save()                                                       // Save the cleared session
	c.Redirect(http.StatusSeeOther, "/?message=logout out successfully") // Redirect to home
}
