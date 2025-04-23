package deleteHandlers

import (
	reusable "Laboratory/Reusable"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

/*
This function deletes question on the basis of question's id
which is extracted from path parameters.
*/
func HandleQuesDeletion(c *gin.Context) {
	//extract id
	id := c.Param("id")

	db := reusable.LoadSQLStructConfigs(c)

	defer db.Close()
	//query
	query := "delete from laboratory.questions where id = ?"
	_, err := db.Exec(query, id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		fmt.Println("Failed to delete question from database")
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Question deleted successfully"})
}
