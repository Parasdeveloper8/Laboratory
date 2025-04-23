package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderMetalOrNotPage(c *gin.Context) {
	c.HTML(http.StatusOK, "metalNon.html", nil)
}
