package GETAPI

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetNotifications(c *gin.Context) {
	c.JSON(http.StatusOK, nil)
}
