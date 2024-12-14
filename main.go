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

	r.GET("/blogs", GETAPI.GetPosts) //API to get images

	r.GET("/own-posts-page", Routes.RenderOwnPostPage)

	r.GET("/my-posts", GETAPI.GetMyPosts) //API to get own posts

	r.GET("register-page", Routes.RenderRegisterPage)

	r.GET("login-page", Routes.RenderLoginPage)

	r.Run(":4900")
}
