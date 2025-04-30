package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderAnsPage(c *gin.Context) {
	c.HTML(http.StatusOK, "ansPage.html", nil)
}
