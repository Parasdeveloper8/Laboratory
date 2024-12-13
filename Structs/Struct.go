package reusable_structs

import (
	"log"

	"github.com/kelseyhightower/envconfig"
)

// element struct
type Element struct {
	Name        string  `json:"name"`
	Atomic_Mass float64 `json:"atomic_mass"`
	Symbol      string  `json:"symbol"`
} //configurations struct
type Configurations struct {
	DB_URL              string `envconfig:"DB_URL"` //Binds to DB_URL in env
	SECRETKEY           string `envconfig:"SECRETKEY"`
	DB_HOST             string `envconfig:"DB_HOST"`
	DB_USER             string `envconfig:"DB_USER"`
	DB_PASSWORD         string `envconfig:"DB_PASSWORD"`
	DB_NAME             string `envconfig:"DB_NAME"`
	DB_CONNECTION_LIMIT int    `envconfig:"DB_CONNECTION_LIMIT"`
	EMAIL               string `envconfig:"EMAIL"`
	EMAIL_PASSWORD      string `envconfig:"EMAIL_PASSWORD"`
}

var GlobalConfigurations *Configurations

func Init() (*Configurations, error) {
	var cfg Configurations
	// Load environment variables into the struct
	err := envconfig.Process("", &cfg)
	if err != nil {
		log.Fatal(err.Error())
	}
	GlobalConfigurations = &cfg
	return &cfg, nil
}
