package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderRegisterPage(c *gin.Context) {
	c.HTML(http.StatusOK, "registerpage.html", nil)
}
