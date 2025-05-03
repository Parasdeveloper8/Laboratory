package postHandlers

import (
	reusable "Laboratory/Reusable"
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

/*
This function handles profile updation
*/
func HandleUpdateProfile(c *gin.Context) {
	db := reusable.LoadSQLStructConfigs(c)
	defer db.Close()

	session := sessions.Default(c)
	sessionEmail, _ := session.Get("email").(string)

	newName := c.PostForm("new-name")
	newRole := c.PostForm("new-role")
	newAbout := c.PostForm("new-about")

	//update profile data on the basis of email given
	query := "UPDATE laboratory.users SET name = ?, role = ?,about = ? WHERE email = ?"
	result, err := db.Exec(query, newName, newRole, newAbout, sessionEmail)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Failed to update data in database %v", err)})
		return
	}

	fmt.Println(result)
	c.Redirect(http.StatusSeeOther, "/profile?profile=updated profile")
}
