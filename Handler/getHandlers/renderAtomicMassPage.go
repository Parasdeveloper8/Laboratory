package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderAtomicMassPage(c *gin.Context) {
	c.HTML(http.StatusOK, "atomicMasspage.html", nil)
}
