package reusable

import (
	custom_errors "Laboratory/Errors"
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

var Name, Pass, Mail string

func SqlLogin(email, password string, c *gin.Context) (bool, error) {
	config, err := reusable_structs.Init()
	if err != nil {
		log.Fatalf("Failed to load configurations %v", err)
	}
	db, err := sql.Open("mysql", config.DB_URL)
	if err != nil {
		log.Fatalf("Failed to connect to database %v", err)
	}
	query := "SELECT email, password ,name FROM laboratory.users WHERE email = ?"
	err = db.QueryRow(query, email).Scan(&Mail, &Pass, &Name)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusBadRequest, gin.H{"error": custom_errors.ErrNotAUser})
		return false, err
	} else if err != nil {
		log.Printf("%v : %v", custom_errors.ErrDbQuery, err)
		return false, err
	}
	if !CheckPassword(Pass, password) {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		fmt.Println(custom_errors.ErrInvalidPass)
		return false, nil
	}
	return true, nil
}
