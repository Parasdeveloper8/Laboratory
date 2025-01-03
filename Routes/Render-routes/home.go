package Routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func HomeHandler(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{"username": "Hello Guest"})
}
