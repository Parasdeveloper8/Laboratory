package Routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderChangeProfileForm(c *gin.Context) {
	c.HTML(http.StatusOK, "changeProfileForm.html", nil)
}
