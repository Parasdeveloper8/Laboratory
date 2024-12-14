package postroutes

import (
	reusable_structs "Laboratory/Structs"
	"database/sql"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

func HandlePost(c *gin.Context) {
	//convert time to string
	itime := time.Now()
	convtime := itime.Unix()
	timeString := fmt.Sprintf("%v", convtime)

	configs, err := reusable_structs.Init()
	if err != nil {
		fmt.Println("Failed to load configurations", err)
	}
	//fmt.Println(configs)
	db, err := sql.Open("mysql", configs.DB_URL)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	defer db.Close()
	// Parse the file from the request
	file, err := c.FormFile("file")
	caption := c.PostForm("caption")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file"})
		return
	}
	//custom image url
	image_url := file.Filename + timeString

	// Read file content
	fileContent, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file content"})
		return
	}
	defer fileContent.Close()
	//Read file content
	fileBytes, err := io.ReadAll(fileContent) //Reading from multipart.File variable and serving []byte variable to use with database
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file content"})
		return
	}
	// Create a new file on the server
	dst, err := os.Create(filepath.Join("Uploads", image_url))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		fmt.Printf("Failed to create file on server %v", err)
		return
	}
	defer dst.Close()

	// Save the file
	_, err = dst.ReadFrom(fileContent)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		fmt.Println("Failed to save file", err)
		return
	}
	//insert file into DB
	query := "insert into laboratory.posts(name,base64string,email,title,image_url) values(?,?,?,?,?)"
	_, err = db.Exec(query, file.Filename, fileBytes, "ppdev@gmail.com", caption, image_url)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file to database"})
		fmt.Println(err)
		return
	}
	//on successful submission
	//fmt.Println("File uploaded successfully")
	//c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully", "filename": file.Filename})
	c.Redirect(http.StatusSeeOther, "/?message=file uploaded successfully")
}
