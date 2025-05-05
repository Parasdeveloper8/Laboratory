package reusable

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

/*
This function does user registration and hash the password
This takes name ,email,password,role and if any error occurs ,it will
return a bool and a error
*/
func SqlBcryptRegister(name, email, password, role string, c *gin.Context) (bool, error) {
	db := LoadSQLStructConfigs(c)
	defer db.Close()

	// Hash the password
	hashedPassword, err := HashPassword(password)
	if err != nil {
		log.Fatalf("Failed to hash password %v", err) //Fatal to terminate program
		return false, err
	}

	//create unique id for profile
	profileId := uuid.New().String() + name

	// Insert data into the database
	query := "insert into laboratory.users (name,email,password,role,profileId) values (?,?,?,?,?)"
	result, err := db.Exec(query, name, email, hashedPassword, role, profileId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Failed to insert data into database or already registered %v", err)})
		return false, err
	}
	fmt.Println(result)
	return true, nil
}
