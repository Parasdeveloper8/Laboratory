package GETAPI

import (
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

/*
This function works as a api which takes answers from database on the basis of
question id given in path parameters.
Then it serves response as answers of that question.
*/
func GetAnswers(c *gin.Context) {
	var answers []reusable_structs.Answers
	//get question id from path parameters
	que_id := c.Param("queId")
	config, err := reusable_structs.Init()
	if err != nil {
		fmt.Println("Failed to load configurations", err)
	}

	db, err := sql.Open("mysql", config.DB_URL)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	defer db.Close()

	//query
	query := "select text,id,username,ans_id,likes from laboratory.answers where id = ?"
	rows, err := db.Query(query, que_id)

	if err != nil {
		log.Printf("Failed to get answers data %v", err)
	}
	defer rows.Close()

	/*
		Iterate over returned rows and scan all returned rows 'values on each iteration
		into struct's fields using rows.Next()
	*/
	for rows.Next() {
		var panswers reusable_structs.Answers //struct in Struct4.go
		err := rows.Scan(&panswers.Answer, &panswers.Que_id, &panswers.Username, &panswers.Ans_id, &panswers.Likes)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		answers = append(answers, panswers)
	}
	//if any error during iteration
	if err := rows.Err(); err != nil {
		log.Printf("Row iteration error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": answers})
}
