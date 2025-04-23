package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderShabdVivaranPage(c *gin.Context) {
	c.HTML(http.StatusOK, "shabdVivaran.html", nil)
}
