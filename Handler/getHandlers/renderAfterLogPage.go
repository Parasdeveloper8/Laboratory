package getHandlers

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func RenderAfterLoginPage(c *gin.Context) {
	//session
	session := sessions.Default(c)
	//Get username from session
	username, _ := session.Get("username").(string)
	c.HTML(http.StatusOK, "afterlog.html", gin.H{"username": username})
}
