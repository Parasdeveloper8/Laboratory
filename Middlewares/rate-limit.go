package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// Rate limiter middleware
func RateLimit() gin.HandlerFunc {
	// Create a rate limiter that allows 2 request per second with a burst of 4
	limiter := rate.NewLimiter(2, 4)

	return func(c *gin.Context) {
		// Check if the request is allowed
		if !limiter.Allow() {
			c.AbortWithStatus(http.StatusTooManyRequests) // Send a 429 status
			return
		}
		c.Next() // Call the next handler
	}
}
