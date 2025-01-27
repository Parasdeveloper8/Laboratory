package postroutes

import (
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// This function adds likes in database to given answer id
// This takes answer id and likes from path parameters
func HandleLikes(c *gin.Context) {
	//get answer id from path parameters
	ans_id := c.Param("ansId")
	//get likes from path parameters
	likes := c.Param("likes")

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
	query := "update laboratory.answers set likes = ? where ans_id = ?"
	_, err = db.Exec(query, likes, ans_id)
	if err != nil {
		log.Printf("Error on sending likes %v", err)
	}
	//send Json response for now
	c.JSON(http.StatusOK, gin.H{"success": likes, "ess": ans_id})
}
