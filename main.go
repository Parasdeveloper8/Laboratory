package main

import (
	"Laboratory/GETAPI"
	postroutes "Laboratory/Routes/POST-routes"
	Routes "Laboratory/Routes/render-pages"

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
	r.POST("/Addpost", postroutes.HandlePost)
	r.Run(":4900")
}
