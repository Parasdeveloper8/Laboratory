package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderPassChangePage(c *gin.Context) {
	c.HTML(http.StatusOK, "pass-change.html", gin.H{})
}
