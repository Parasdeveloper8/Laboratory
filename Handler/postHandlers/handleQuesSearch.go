package postHandlers

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

/*
This function handles search and return results related to given text in query string
*/
func HandleQueSearch(c *gin.Context) {
	var questions []reusable_structs.Questions
	//Get the val from query string
	title := c.Query("val")
	db := reusable.LoadSQLStructConfigs(c)
	defer db.Close()

	//query to get questions from database
	query := `
	  select 
	  questions.text,
	  questions.username,
	  questions.id,
	  questions.time,
	  questions.category,
	  users.profile_image
	  from laboratory.questions
	  join laboratory.users
	  on questions.email = users.email
	  where questions.text like concat('%', ?, '%')
	`
	rows, err := db.Query(query, title)
	if err != nil {
		log.Printf("Failed to get data %v", err)
	}
	defer rows.Close()

	/*
		Iterate over returned rows and scan all returned rows 'values on each iteration
		into struct's fields using rows.Next()
	*/
	for rows.Next() {
		var question reusable_structs.Questions
		err := rows.Scan(&question.Text, &question.Username, &question.Id, &question.Time, &question.Category, &question.Profile_Image)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		//Converting Uint8 to time.Time
		decodedTime, _ := reusable.Uint8ToTime(question.Time)
		//Formatting decodedTime variable
		formattedTime := decodedTime.Format("2006-01-02 15:04:05")
		//Adding formatted time to FormattedTime field
		question.FormattedTime = formattedTime

		questions = append(questions, question)
	}
	//if any error during iteration
	if err := rows.Err(); err != nil {
		log.Printf("Row iteration error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": questions})
}
