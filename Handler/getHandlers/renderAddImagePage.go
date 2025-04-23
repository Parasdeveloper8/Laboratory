package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderAddImagePage(c *gin.Context) {
	c.HTML(http.StatusOK, "addImage.html", nil)
}
