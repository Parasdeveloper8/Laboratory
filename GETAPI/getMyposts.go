package GETAPI

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetMyPosts(c *gin.Context) {
	c.String(http.StatusOK, "Hello", nil)
}
