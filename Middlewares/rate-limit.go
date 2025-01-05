package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

//Description:-
/*
This middleware is Rate Limit middleware which stops more than 2 requests in a second.
If user tries to make more than 2 requests in a second ,it will send 429 status code.
It has burst of 4 requests per second ,
which means sometimes not always user can make upto 4 requests in a second .
*/
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
