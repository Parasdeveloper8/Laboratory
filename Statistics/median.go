package statistics

import (
	custom_errors "Laboratory/Errors"
	reusable "Laboratory/Reusable"
	"fmt"

	"github.com/gin-gonic/gin"
)

// calculate median from api data
func CalculateMedian(c_i []string, freq []float64, cf []float64, c *gin.Context) {
	type Data struct {
		L  float64 //lower limit of median class
		Cf float64 //cumulative frequency of preceding class
		N  float64 //Total of sum of frequencies
		f  float64 //frequency of median class
		H  float64 //Height
	}

	lenF_I := len(freq) //length of freq slice (freq)
	lenC_I := len(c_i)  //length of c_i slice (class interval)
	lenC_f := len(cf)   //length of cf slice (cumulative frequency)

	//If length of both c_i and freq slices are different
	if lenC_I != lenF_I && lenC_I != lenC_f {
		err := custom_errors.ErrCIFIunequal //Custom error from Errors/errors.go
		fmt.Println(err)
		return
	}
	//sum of all values in frequency table
	totalSumOfFreq := reusable.SumAllValues(freq)
	var medianCf float64 //median cf

	var indexOfMedianCf int
	var indexOfMedianf int
	var indexOfMedianClass int
	//Check if any value in cf is greater than half of totalSumOfFreq
	//Also find index of medianClassNumber
	for _, i := range freq {
		N := totalSumOfFreq / 2
		if i > N {
			medianCf = float64(i)
			break
		}
	}
	indexOfMedianCf = reusable.IndexOf(freq, medianCf)
	//index of median cf is also equal to index of median class and frequency
}
