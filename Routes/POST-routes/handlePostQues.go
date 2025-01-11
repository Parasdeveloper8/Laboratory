package postroutes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandlePostQues(c *gin.Context) {
	//get question text from path parameters
	ques := c.Param("text")
	c.JSON(http.StatusOK, gin.H{"message": ques})
}
