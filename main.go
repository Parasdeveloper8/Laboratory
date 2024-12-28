package main

import (
	"Laboratory/GETAPI"
	middlewares "Laboratory/Middlewares"
	deleteroutes "Laboratory/Routes/DELETE-routes"
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

	r.GET("/", middlewares.CheckSession(), Routes.HomeHandler)

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

	r.GET("/metal-or-not", GETAPI.MetalOrNotAPI) //API to get elements which are metals or not

	r.POST("post-comments/:post_id", postroutes.HandleComments)

	r.GET("/get-comments/:post_id", GETAPI.GetComments) //API to get comments

	r.POST("/resetlink", postroutes.ResetLink)

	r.GET("/resetpasspage", Routes.RenderPassChangePage)

	r.POST("/resetpassword", postroutes.ResetPassword)

	r.POST("/update-profile", middlewares.CheckEmail(), postroutes.HandleUpdateProfile)

	r.GET("/learn-valency-page", Routes.RenderLearnValencyPage)

	r.GET("change-profile-page", Routes.RenderChangeProfileForm)

	r.DELETE("/delete-post/:post_id", middlewares.CheckEmail(), deleteroutes.HandleDeletePost)

	r.DELETE("/delete-image/:email", middlewares.CheckEmail(), deleteroutes.HandleDeleteImage)

	r.GET("/page-to-pdf", middlewares.CheckEmail(), Routes.RenderPdfPage) //work remaining

	r.POST("/create-pdf", postroutes.HandlePDFCreation) //work remaining

	r.GET("/gravitational-force", Routes.RenderGravitationalPage)

	r.Run(":4900")
}
