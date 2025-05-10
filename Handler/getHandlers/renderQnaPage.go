package getHandlers

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func RenderQNAPage(c *gin.Context) {
	//session
	session := sessions.Default(c)
	//Get profileId from session
	profileId, _ := session.Get("profileId").(string)
	c.HTML(http.StatusOK, "qna-page.html", gin.H{"id": profileId})
}
