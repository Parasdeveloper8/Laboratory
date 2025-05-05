package main

import (
	"Laboratory/GETAPI"
	"Laboratory/Handler/deleteHandlers"
	"Laboratory/Handler/getHandlers"
	"Laboratory/Handler/postHandlers"
	middlewares "Laboratory/Middlewares"
	reusable_structs "Laboratory/Structs"
	"Laboratory/cors"
	"flag"
	"net/http"

	"github.com/Parasdeveloper8/gowebguard/v2/webguard"
	"github.com/gin-contrib/expvar"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	//flag
	addr := flag.String("port", " ", "Runs server")
	//Parse flag
	flag.Parse()

	// Set up CORS
	cors.SetupCORS(r)

	//Serve static files
	r.Static("/static", "./static")
	//loads HTML files
	r.LoadHTMLGlob("templates/*")

	//csp struct
	header := webguard.Csp{
		ContentSecurityPolicy: "default-src 'self'; " +
			"script-src 'self' 'unsafe-inline' https://stackpath.bootstrapcdn.com/ https://cdn.jsdelivr.net/ https://kit.fontawesome.com/ 'unsafe-eval';" +
			"style-src 'self' 'unsafe-inline'  https://stackpath.bootstrapcdn.com/ https://cdn.jsdelivr.net/ https://cdnjs.cloudflare.com/ https://kit.fontawesome.com/;" +
			"font-src https://cdnjs.cloudflare.com/ https://kit.fontawesome.com/; " +
			"img-src 'self' data:;" +
			"media-src 'self' data:;" +
			"object-src 'none';",
	}

	//Using webguard to secure application
	r.Use(webguard.WebGuard())
	r.Use(webguard.CSP(&header))

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
	r.GET("/", middlewares.CheckSession(), getHandlers.HomeHandler)

	r.GET("/atomic-mass-page", getHandlers.RenderAtomicMassPage)

	r.GET("/page-to-post", getHandlers.RenderPostPage)

	r.GET("/atomic-mass", GETAPI.AtomicMassAPI) //API to get atomic mass

	r.POST("/Addpost", middlewares.CheckEmail(), postHandlers.HandlePost)

	r.GET("/blogs/:row/:limit", GETAPI.GetPosts) //API to get images

	r.GET("/own-posts-page", middlewares.CheckEmail(), getHandlers.RenderOwnPostPage)

	r.GET("/my-posts/:row/:limit", GETAPI.GetMyPosts) //API to get own posts

	r.GET("register-page", getHandlers.RenderRegisterPage)

	r.GET("login-page", getHandlers.RenderLoginPage)

	r.POST("/register", postHandlers.HandleRegistration)

	r.POST("/login", postHandlers.HandleLogin)

	r.GET("/afterlogin", middlewares.CheckEmail(), getHandlers.RenderAfterLoginPage)

	r.POST("/logout", postHandlers.HandleLogout)

	r.GET("/profile/:profileId", middlewares.CheckEmail(), getHandlers.RenderProfilePage)

	r.GET("/profile-data/:profileId", GETAPI.ProfileDataAPI) //API to get profile data

	r.GET("/add-image-page", getHandlers.RenderAddImagePage)

	r.POST("/add-image", postHandlers.HandleAddImage)

	r.GET("/tools-page", getHandlers.RenderToolspage)

	r.GET("/find-metal-page", getHandlers.RenderMetalOrNotPage)

	r.GET("/metal-or-not", GETAPI.MetalOrNotAPI) //API to get elements which are metals or not

	r.POST("post-comments/:post_id", postHandlers.HandleComments)

	r.GET("/get-comments/:post_id", GETAPI.GetComments) //API to get comments

	r.POST("/resetlink", postHandlers.ResetLink)

	r.GET("/resetpasspage", getHandlers.RenderPassChangePage)

	r.POST("/resetpassword", postHandlers.ResetPassword)

	r.POST("/update-profile", middlewares.CheckEmail(), postHandlers.HandleUpdateProfile)

	r.GET("change-profile-page", getHandlers.RenderChangeProfileForm)

	r.DELETE("/delete-post/:post_id", middlewares.CheckEmail(), deleteHandlers.HandleDeletePost)

	r.DELETE("/delete-image/:email", middlewares.CheckEmail(), deleteHandlers.HandleDeleteImage)

	r.GET("/gravitational-force", getHandlers.RenderGravitationalPage)

	r.GET("/chemical-formulae", getHandlers.RenderChemicalFormulaePage)

	r.GET("/SymbolValency", GETAPI.GetSymbolValency) //API to get symbols and valencies

	r.POST("/search", middlewares.CheckEmail(), postHandlers.HandleSearch)

	r.GET("/search-page", getHandlers.RenderSearchPage)

	r.GET("/Qna", getHandlers.RenderQNAPage)

	r.POST("/post-ques", middlewares.CheckEmail(), postHandlers.HandlePostQues)

	r.GET("/ques-data/:row/:limit", GETAPI.GetQuestions) //API to get questions

	r.POST("/post-ans", middlewares.CheckEmail(), postHandlers.HandlePostAns)

	r.GET("/answers/:queId", GETAPI.GetAnswers) //API to get answers on the basis of question Id

	r.GET("/notifications", GETAPI.GetNotifications) //Work Remaining

	r.GET("/notify-page", getHandlers.RenderNotifyPage) //work Remaining

	r.POST("/likes/:ansId", middlewares.CheckEmail(), postHandlers.HandleLikes)

	r.GET("/likenums", GETAPI.GETLikes) //API to get likes

	r.POST("/postlikes/:postId", middlewares.CheckEmail(), postHandlers.HandlePostLikes)

	r.GET("/postlikenums", GETAPI.GetPostLikes) //API to get likes of post

	r.POST("/searchQues", postHandlers.HandleQueSearch)

	//Route to get metrics information
	r.GET("/debug/vars", expvar.Handler())

	r.GET("/myques", middlewares.CheckEmail(), getHandlers.RenderMyQuesPage)

	r.GET("/myques-data/:row/:limit", middlewares.CheckEmail(), GETAPI.GetOwnQuestions) //API to get own questions

	//Route to show 'route not found' page
	r.NoRoute(func(c *gin.Context) {
		// Send the requested path
		c.HTML(http.StatusNotFound, "NotFound.html", gin.H{"path": c.Request.URL.Path})
	})

	r.DELETE("/delete-que/:id", middlewares.CheckEmail(), deleteHandlers.HandleQuesDeletion)

	r.GET("/mean-mode-median", getHandlers.RenderMeMoMed)

	r.POST("/processStatsData", postHandlers.HandleProcessStats)

	r.GET("/sanskrit", GETAPI.SansWordInfo) //API to get sanskrit word info

	r.GET("/shabd-vivaran", getHandlers.RenderShabdVivaranPage)

	r.GET("/answersPage/:que/:id", getHandlers.RenderAnsPage)

	//Start server on port defined in flag
	r.Run(":" + *addr) //use port 4900 to call API
}
