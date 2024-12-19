package main

import (
	"Laboratory/GETAPI"
	middlewares "Laboratory/Middlewares"
	postroutes "Laboratory/Routes/POST-routes"
	Routes "Laboratory/Routes/Render-routes"
	reusable_structs "Laboratory/Structs"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Static("/static", "./static")

	r.LoadHTMLGlob("templates/*")

	config, _ := reusable_structs.Init()
	Store := cookie.NewStore([]byte(config.SECRETKEY))
	//middleware to use sessions
	r.Use(sessions.Sessions("login-session", Store))

	r.GET("/", Routes.HomeHandler)

	r.GET("/atomic-mass-page", Routes.RenderAtomicMassPage)

	r.GET("/page-to-post", Routes.RenderPostPage)

	r.GET("/atomic-mass", GETAPI.AtomicMassAPI) //API to get atomic mass

	r.POST("/Addpost", middlewares.CheckEmail(), postroutes.HandlePost)

	r.GET("/blogs", GETAPI.GetPosts) //API to get images

	r.GET("/own-posts-page", middlewares.CheckEmail(), Routes.RenderOwnPostPage)

	r.GET("/my-posts", GETAPI.GetMyPosts) //API to get own posts

	r.GET("register-page", Routes.RenderRegisterPage)

	r.GET("login-page", Routes.RenderLoginPage)

	r.POST("/register", postroutes.HandleRegistration)

	r.POST("/login", postroutes.HandleLogin)

	r.GET("/afterlogin", middlewares.CheckEmail(), Routes.RenderAfterLoginPage)

	r.POST("/logout", postroutes.HandleLogout)

	r.GET("/profile", middlewares.CheckEmail(), Routes.RenderProfilePage)

	r.GET("/profile-data", GETAPI.ProfileDataAPI) //API to get profile data

	r.GET("/add-image-page", Routes.RenderAddImagePage)

	r.POST("/add-image", postroutes.HandleAddImage)

	r.GET("/tools-page", Routes.RenderToolspage)

	r.GET("/find-metal-page", Routes.RenderMetalOrNotPage)

	r.Run(":4900")
}
