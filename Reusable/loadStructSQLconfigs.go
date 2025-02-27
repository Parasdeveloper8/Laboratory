package reusable

import (
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Reusable function to load configurations
func LoadSQLStructConfigs(c *gin.Context) *sql.DB {
	//First load configurations from reusable_structs
	configs, err := reusable_structs.Init()

	if err != nil {
		fmt.Println("Failed to load configurations", err)
	}
	db, err := sql.Open("mysql", configs.DB_URL)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return nil
	}
	return db
}
