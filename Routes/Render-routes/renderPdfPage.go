package Routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderPdfPage(c *gin.Context) {
	c.HTML(http.StatusOK, "pdf-page.html", nil)
}
