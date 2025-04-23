package getHandlers

import (
	reusable "Laboratory/Reusable"
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func RenderChangeProfileForm(c *gin.Context) {
	//We will repopulate form with previous values
	//we will fetch data from database
	db := reusable.LoadSQLStructConfigs(c)
	defer db.Close()

	// Get the session
	session := sessions.Default(c)
	// Retrieve the email from the session
	sessionEmail, _ := session.Get("email").(string)

	query := "select name,role from laboratory.users where email = ?"
	row := db.QueryRow(query, sessionEmail)
	//struct to hold values
	type RprofileData struct {
		Name string `db:"name"`
		Role string `db:"role"`
	}
	var prData RprofileData
	if err := row.Scan(&prData.Name, &prData.Role); err != nil {
		fmt.Println("Failed to scan data in struct:\n", err)
		fmt.Printf("Returned data :\n %v", row)
	}
	c.HTML(http.StatusOK, "changeProfileForm.html", gin.H{"data": prData})
}
