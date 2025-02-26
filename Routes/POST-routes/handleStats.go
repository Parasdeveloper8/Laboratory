package postroutes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleProcessStats(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"mess": "Success"})
}
