package Routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderAfterLoginPage(c *gin.Context) {
	c.HTML(http.StatusOK, "afterlog.html", nil)
}
