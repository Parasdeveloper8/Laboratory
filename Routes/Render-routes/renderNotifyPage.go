package Routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderNotifyPage(c *gin.Context) {
	c.HTML(http.StatusOK, "", nil)
}
