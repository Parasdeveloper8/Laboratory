package postroutes

import (
	reusable "Laboratory/Reusable"

	"github.com/gin-gonic/gin"
)

func HandleProcessStats(c *gin.Context) {
	db := reusable.LoadSQLStructConfigs(c)
	//Stage I
	file := reusable.ParseReqFile("file", c)

	//Stage II
	fileContent := reusable.ReadFileContent(file, c)
	defer fileContent.Close()

	//Stage III
	fileBytes := reusable.ReadFileContentByte(fileContent, c)

}
