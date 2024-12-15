package reusable

import (
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// name attribute value should be filled
func SqlBcryptRegister(name, email, password, role string, c *gin.Context) (bool, error) {
	configs, err := reusable_structs.Init()
	if err != nil {
		fmt.Println("Failed to load configurations", err)
		return false, err
	}
	db, err := sql.Open("mysql", configs.DB_URL)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		return false, err
	}
	defer db.Close()

	// Hash the password
	hashedPassword, err := HashPassword(password)
	if err != nil {
		log.Fatalf("Failed to hash password %v", err) //Fatal to terminate program
		return false, err
	}
	// Insert data into the database
	query := "insert into laboratory.users (name,email,password,role) values (?,?,?,?)"
	result, err := db.Exec(query, name, email, hashedPassword, role)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Failed to insert data into database or already registered %v", err)})
		return false, err
	}
	fmt.Println(result)
	return true, nil
}
