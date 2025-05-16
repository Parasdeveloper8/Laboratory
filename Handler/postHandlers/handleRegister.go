package postHandlers

import (
	reusable "Laboratory/Reusable"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// This function uses reusable registration method to register user
func HandleRegistration(c *gin.Context) {
	Name := c.PostForm("name")
	Email := c.PostForm("email")
	Password := c.PostForm("password")
	Role := c.PostForm("role")
	_, err := reusable.SqlBcryptRegister(Name, Email, Password, Role, c) //method in Reusable folder
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		fmt.Println(err)
	}
	subject := "Welcome to laboratory " + Name + "\n"
	body := fmt.Sprintf(`
	<html>
	             <body>
				   <h1>Welcome to laboratory %s</h1>
                   <p style='color:black;'>You have successfully registered in laboratory.We are thanking you for becoming part of us</p>
				   <p style='color:black;'>Now use laboratory to solve problems,see interesting posts,etc.<p>
				   <p style='color:black;'>Share laboratory with your friends,etc.</p>
				   <p style='color:black;'>With regards</p>
				   <a href='https://devparas.com' target='_blank'>Paras Prajapat</a>
				 </body>
	            </html>`, Name)
	err = reusable.SendMail(Email, subject, body)
	if err != nil {
		log.Printf("Failed to send email: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
		return
	}
	c.Redirect(http.StatusSeeOther, "/login-page?mess=successfully registered")
}
