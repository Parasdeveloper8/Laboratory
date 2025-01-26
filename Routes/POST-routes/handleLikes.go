package postroutes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// This function adds likes in database to given answer id
// This takes answer id and likes from path parameters
func HandleLikes(c *gin.Context) {
	//get answer id from path parameters
	ans_id := c.Param("ansId")
	//get likes from path parameters
	likes := c.Param("likes")

	//send Json response for now
	c.JSON(http.StatusOK, gin.H{"success": likes, "ess": ans_id})
}
