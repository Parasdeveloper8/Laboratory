package reusable_structs

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// element struct
type Element struct {
	Name        string  `json:"name"`
	Atomic_Mass float64 `json:"atomic_mass"`
	Symbol      string  `json:"symbol"`
} //configurations struct
type Configurations struct {
	DB_URL              string `env:"DB_URL"` //Binds to DB_URL in env
	SECRETKEY           string `env:"SECRETKEY"`
	DB_HOST             string `env:"DB_HOST"`
	DB_USER             string `env:"DB_USER"`
	DB_PASSWORD         string `env:"DB_PASSWORD"`
	DB_NAME             string `env:"DB_NAME"`
	DB_CONNECTION_LIMIT int
	EMAIL               string `env:"EMAIL"`
	EMAIL_PASSWORD      string `env:"EMAIL_PASSWORD"`
	API_KEY_HUG         string `env:"API_KEY_HUG"` //API key to model
	SPACE_OCR_KEY       string `env:"SPACE_OCR_KEY"`
}

var GlobalConfigurations *Configurations

func Init() (*Configurations, error) {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}
	db_user := os.Getenv("DB_USER")
	db_url := os.Getenv("DB_URL")
	secretkey := os.Getenv("SECRETKEY")
	db_host := os.Getenv("DB_HOST")
	db_password := os.Getenv("DB_PASSWORD")
	email := os.Getenv("EMAIL")
	email_password := os.Getenv("EMAIL_PASSWORD")
	db_name := os.Getenv("DB_NAME")
	api_key_hug := os.Getenv("API_KEY_HUG")
	space_ocr_key := os.Getenv("SPACE_OCR_KEY")
	GlobalConfigurations = &Configurations{DB_USER: db_user, DB_URL: db_url, DB_HOST: db_host, DB_NAME: db_name, DB_CONNECTION_LIMIT: 10, DB_PASSWORD: db_password, EMAIL: email, EMAIL_PASSWORD: email_password, SECRETKEY: secretkey, API_KEY_HUG: api_key_hug, SPACE_OCR_KEY: space_ocr_key}

	//fmt.Println(GlobalConfigurations)
	return GlobalConfigurations, nil
}
