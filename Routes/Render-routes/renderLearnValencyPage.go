package Routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderLearnValencyPage(c *gin.Context) {
	c.HTML(http.StatusOK, "learn-valency.html", nil)
}
