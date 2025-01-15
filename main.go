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

	//Serve static files
	r.Static("/static", "./static")

	//loads HTML files
	r.LoadHTMLGlob("templates/*")

	//Initialize reusable structs to use
	config, _ := reusable_structs.Init()
	//Define a cookie Store
	Store := cookie.NewStore([]byte(config.SECRETKEY))

	//Rate limit middleware from Middlewares folder ,it is applied on all routes
	r.Use(middlewares.RateLimit())

	//Session middleware from Middlewares folder
	r.Use(sessions.Sessions("login-session", Store))

	//Routes Start from here------------------------------->

	//Check Session middleware from Middlewares folder
	r.GET("/", middlewares.CheckSession(), Routes.HomeHandler)

	r.GET("/atomic-mass-page", Routes.RenderAtomicMassPage)

	r.GET("/page-to-post", Routes.RenderPostPage)

	r.GET("/atomic-mass", GETAPI.AtomicMassAPI) //API to get atomic mass

	r.POST("/Addpost", middlewares.CheckEmail(), postroutes.HandlePost)

	r.GET("/blogs/:row/:limit", GETAPI.GetPosts) //API to get images

	r.GET("/own-posts-page", middlewares.CheckEmail(), Routes.RenderOwnPostPage)

	r.GET("/my-posts/:row/:limit", GETAPI.GetMyPosts) //API to get own posts

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

	r.GET("change-profile-page", Routes.RenderChangeProfileForm)

	r.DELETE("/delete-post/:post_id", middlewares.CheckEmail(), deleteroutes.HandleDeletePost)

	r.DELETE("/delete-image/:email", middlewares.CheckEmail(), deleteroutes.HandleDeleteImage)

	r.GET("/gravitational-force", Routes.RenderGravitationalPage)

	r.GET("/chemical-formulae", Routes.RenderChemicalFormulaePage)

	r.GET("/SymbolValency", GETAPI.GetSymbolValency) //API to get symbols and valencies

	r.POST("/search", middlewares.CheckEmail(), postroutes.HandleSearch)

	r.GET("/search-page", Routes.RenderSearchPage)

	r.GET("/Qna", Routes.RenderQNAPage)

	r.POST("/post-ques/:text/:category", middlewares.CheckEmail(), postroutes.HandlePostQues)

	r.GET("/ques-data/:row/:limit", GETAPI.GetQuestions) //API to get questions

	r.POST("/post-ans/:id/:answer", middlewares.CheckEmail(), postroutes.HandlePostAns)

	r.GET("/answers/:queId", GETAPI.GetAnswers) //API to get answers on the basis of question Id

	//Start server on port 4900
	r.Run(":4900")
}
