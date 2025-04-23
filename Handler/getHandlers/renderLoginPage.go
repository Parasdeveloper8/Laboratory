package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderLoginPage(c *gin.Context) {
	c.HTML(http.StatusOK, "loginpage.html", nil)
}
