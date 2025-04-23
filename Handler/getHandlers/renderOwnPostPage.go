package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderOwnPostPage(c *gin.Context) {
	c.HTML(http.StatusOK, "ownPostPage.html", nil)
}
