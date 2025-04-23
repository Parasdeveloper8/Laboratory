package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderChangeImagePage(c *gin.Context) {
	c.HTML(http.StatusOK, "changeImage.html", nil)
}
