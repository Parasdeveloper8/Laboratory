package Routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderToolspage(c *gin.Context) {
	c.HTML(http.StatusOK, "tools-page.html", nil)
}
