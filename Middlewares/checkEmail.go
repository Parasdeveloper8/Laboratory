package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

	store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7, // 1 week
		HttpOnly: true,
		Secure:   false, // Use `true` in production
		SameSite: http.SameSiteLaxMode,
	}
func CheckEmail() gin.HandlerFunc {
	config,err := reusable_structs.Init()
	if err != nil {
		fmt.Println("Failed to load configurations", err)
	}
	secretKey := config.SECRETKEY
	var store *sessions.CookieStore = sessions.NewCookieStore(secretKey)
	return func(c *gin.Context) {
		session, _ := store.Get(c.Request, "login-session")
		sessionEmail, ok := session.Values["email"].(string)
		if !ok || sessionEmail == "" {
			c.Redirect(http.StatusFound, "/logpage") // Redirect to login page
			c.Abort()
			return
		}
		c.Next()
	}
}
