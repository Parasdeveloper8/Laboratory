package GETAPI

import (
	reusable "Laboratory/Reusable"
	reusable_structs "Laboratory/Structs"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

/*
This function extracts questions data from database along with other data.
This works as API.
To reduce latency in response and load on server ,it has two variables rowF and limits.
rowF and limits are fetched from path parameters row and limit respectively.
*/
func GetQuestions(c *gin.Context) {
	rowF := c.Param("row")
	limits := c.Param("limit")
	var questions []reusable_structs.Questions
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
	  users.profile_image,
	  users.profileId
	  from laboratory.questions
	  join laboratory.users
	  on questions.email = users.email
	  order by questions.time desc limit ?,?
	`
	rows, err := db.Query(query, rowF, limits)
	if err != nil {
		log.Printf("Failed to get images data %v", err)
	}
	defer rows.Close()
	/*
		Iterate over returned rows and scan all returned rows 'values on each iteration
			into struct's fields using rows.Next()
	*/
	for rows.Next() {
		var ques reusable_structs.Questions //struct from Structs/Struct4.go
		err := rows.Scan(&ques.Text, &ques.Username, &ques.Id, &ques.Time, &ques.Category, &ques.Profile_Image, &ques.ProfileId)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		//Converting Uint8 to time.Time
		decodedTime, _ := reusable.Uint8ToTime(ques.Time)
		//Formatting decodedTime variable
		formattedTime := decodedTime.Format("2006-01-02 15:04:05")
		//Adding formatted time to FormattedTime field
		ques.FormattedTime = formattedTime

		questions = append(questions, ques)
	}
	//if any error during iteration
	if err := rows.Err(); err != nil {
		log.Printf("Row iteration error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": questions})
}
