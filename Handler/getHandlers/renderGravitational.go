package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderGravitationalPage(c *gin.Context) {
	c.HTML(http.StatusOK, "gravitational-page.html", nil)
}
