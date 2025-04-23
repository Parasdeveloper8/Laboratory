package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderPostPage(c *gin.Context) {
	c.HTML(http.StatusOK, "postPage.html", nil)
}
