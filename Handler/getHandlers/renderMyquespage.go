package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderMyQuesPage(c *gin.Context) {
	c.HTML(http.StatusOK, "myques.html", nil)
}
