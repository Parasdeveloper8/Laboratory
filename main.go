package main

import (
	"Laboratory/Routes"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Static("/static", "./static")

	r.LoadHTMLGlob("templates/*")

	r.GET("/", Routes.HomeHandler)

	r.Run(":4300")
}
