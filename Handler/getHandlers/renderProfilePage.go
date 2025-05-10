package getHandlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderProfilePage(c *gin.Context) {
	//The profile Id who has called api
	userProfileId := c.Param("userProfileId")

	//The profile Id of profile which will be rendered
	userProfileId2 := c.Param("profileId")

	//check both profileId of sender and current user
	if userProfileId != userProfileId2 {
		//set header that user is other
		c.Header("userIs", "other")
		c.HTML(http.StatusOK, "profile.html", gin.H{"who": false})
		return
	}
	c.Header("userIs", "self")
	c.HTML(http.StatusOK, "profile.html", gin.H{"who": true})
}
