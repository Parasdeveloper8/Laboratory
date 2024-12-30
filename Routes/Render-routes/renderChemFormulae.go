package Routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RenderChemicalFormulaePage(c *gin.Context) {
	c.HTML(http.StatusOK, "chemical-formulae.html", nil)
}
