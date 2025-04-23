package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Render mean mode median tool page
func RenderMeMoMed(c *gin.Context) {
	c.HTML(http.StatusOK, "meMoMedPage.html", nil)
}
