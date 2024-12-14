package postroutes

import (
	reusable "Laboratory/Reusable"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleRegistration(c *gin.Context) {
	Name := c.PostForm("name")
	Email := c.PostForm("email")
	Password := c.PostForm("password")
	Role := c.PostForm("role")
	_, err := reusable.SqlBcryptRegister(Name, Email, Password, Role)
	if err != nil {
		log.Fatal(err)
	}
	c.Redirect(http.StatusSeeOther, "/login-page?mess=successfully registered")
}
