package getHandlers

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func RenderAnsPage(c *gin.Context) {
	//session
	session := sessions.Default(c)
	//Get profileId from session
	profileId, _ := session.Get("profileId").(string)

	c.HTML(http.StatusOK, "ansPage.html", gin.H{"id": profileId})
}
