package GETAPI

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetImages(c *gin.Context) {
	c.String(http.StatusOK, "HEllo ", nil)
}
