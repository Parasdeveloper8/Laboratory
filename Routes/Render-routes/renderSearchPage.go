package Routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderSearchPage(c *gin.Context) {
	c.HTML(http.StatusOK, "searchPage.html", nil)
}
