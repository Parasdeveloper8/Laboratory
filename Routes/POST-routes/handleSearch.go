package postroutes

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

/*
This function handles search and return results related to given text in path parameters
*/
func HandleSearch(c *gin.Context) {
	title := c.Param("title")
	fmt.Println(title)
}
