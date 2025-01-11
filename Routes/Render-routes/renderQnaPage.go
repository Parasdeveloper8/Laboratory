package Routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderQNAPage(c *gin.Context) {
	c.HTML(http.StatusOK, "qna-page.html", nil)
}
