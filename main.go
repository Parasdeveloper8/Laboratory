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
	r.GET("/atomic-mass-page", Routes.RenderAtomicMassPage)
	r.GET("/page-to-post", Routes.RenderPostPage)
	r.GET("/atomic-mass", GETAPI.AtomicMassAPI) //API to get atomic mass
	r.POST("/Addpost")
	r.Run(":4900")
}
