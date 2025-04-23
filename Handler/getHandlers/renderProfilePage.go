package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderProfilePage(c *gin.Context) {
	c.HTML(http.StatusOK, "profile.html", nil)
}
