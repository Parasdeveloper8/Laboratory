package main

import (
	"Laboratory/GETAPI"
	"Laboratory/Routes"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Static("/static", "./static")

	r.LoadHTMLGlob("templates/*")
	r.GET("/", Routes.HomeHandler)
	r.GET("/atomic-mass", GETAPI.AtomicMassAPI) //API to get atomic mass
	r.Run(":4900")
}
