package statistics

import (
	custom_errors "Laboratory/Errors"
	reusable "Laboratory/Reusable"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// Calculate mean from api data
func CalculateMean(c_i []string, freq []float64, c *gin.Context) {
	//data for mean calculation
	type Data struct {
		Fixi float64
		Fi   float64
	}

	lenF_I := len(freq) //length of freq slice (freq)
	lenC_I := len(c_i)  //length of c_i slice (class interval)
	//fmt.Println(c_i, freq)//debugging line
	//If length of both c_i and freq slices are different
	if lenC_I != lenF_I {
		err := custom_errors.ErrCIFIunequal //Custom error from Errors/errors.go
		fmt.Println(err)
		return
	}
	//fmt.Printf("Frequency: %v\n", freq) //debugging line
	//sigma fi
	sigmafi := reusable.SumAllValues(freq)
	//fmt.Println("sigma fi", sigmafi) //debugging line
	var splitSlice = make([]string, 0, lenF_I*2)
	// separate slice by - and convert them into new array
	for _, s := range c_i {
		parts := strings.Split(s, "-")
		splitSlice = append(splitSlice, parts...)
	}
	//Idea is that slice will contain a pair of 2 values in it
	//one will value will be lower limit and second value will be upper limit
	//ex := int{1,2,3,4} -> int{{1,2},{3,4}}
	newCIArr := [][]float64{}
	//create pairs
	for i := 0; i < len(splitSlice); i += 2 {
		if i+1 < len(splitSlice) {
			// Convert strings to float64
			num1, err1 := strconv.ParseFloat(splitSlice[i], 64)
			num2, err2 := strconv.ParseFloat(splitSlice[i+1], 64)
			if err1 != nil || err2 != nil {
				fmt.Println("Conversion error:", err1, err2)
				continue
			}
			newCIArr = append(newCIArr, []float64{num1, num2})
		}
	}
	//fmt.Println("newCIArr", newCIArr) //debugging line
	var x_i []float64
	//working with array of array
	for _, wci := range newCIArr {
		sum := reusable.SumAllValues(wci)
		xi := sum / 2         //xi = (upper limit + lower limit)/2
		x_i = append(x_i, xi) //append each xi in x_i array
	}
	//fmt.Printf("XI:%v\n", x_i) //debugging line
	if len(x_i) != lenF_I {
		fmt.Println("Length of x_i and f_i are different")
	}

	//loop through x_i and freq and multiply each value by each other
	//ex :- x_i = []float64{1,2,3} and freq= []float64{2,4,6}
	//multiply :- x_i[0] * freq[0]
	var fi_xi []float64 //multiplied values slice
	for i := 0; i < len(x_i); i++ {
		eachFixi := freq[i] * x_i[i]
		fi_xi = append(fi_xi, eachFixi)
	}

	sigmaFi_Xi := reusable.SumAllValues(fi_xi)
	var data = &Data{Fixi: sigmaFi_Xi, Fi: sigmafi}
	formula := data.Fixi / data.Fi
	c.JSON(http.StatusOK, gin.H{"mean": formula})
}
