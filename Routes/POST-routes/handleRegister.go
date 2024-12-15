package postroutes

import (
	reusable "Laboratory/Reusable"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleRegistration(c *gin.Context) {
	Name := c.PostForm("name")
	Email := c.PostForm("email")
	Password := c.PostForm("password")
	Role := c.PostForm("role")
	_, err := reusable.SqlBcryptRegister(Name, Email, Password, Role, c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		fmt.Println(err)
	}
	c.Redirect(http.StatusSeeOther, "/login-page?mess=successfully registered")
}
