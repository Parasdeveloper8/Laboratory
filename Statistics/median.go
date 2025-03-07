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
		fmt.Println(lenC_f, lenC_I, lenF_I)
		fmt.Printf("CF :%v", cf) //debugging line
		return
	}
	//sum of all values in frequency table (N)
	totalSumOfFreq := reusable.SumAllValues(freq)
	var medianCf float64 //median cf

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
	indexOfMedianCf, err := reusable.IndexOf(freq, medianCf)
	if err != nil {
		fmt.Println(err)
	}
	//index of median cf is also equal to index of median class and frequency
	indexOfMedianClass = indexOfMedianCf
	indexOfMedianf = indexOfMedianCf
	fmt.Println(c_i[indexOfMedianClass])
	//median class
	medianClass := c_i[indexOfMedianClass]
	parts := strings.Split(medianClass, "-")
	if len(parts) != 2 {
		fmt.Printf("invalid class interval format: %v", medianClass)
		return
	}

	classLimit := make([]int, 0, len(parts))

	//convert each part to integer of parts[]
	newClassLimit := reusable.EachToInt(parts, classLimit)

	//lower limit
	lowerLimit, err := strconv.Atoi(parts[0])
	if err != nil {
		fmt.Println("mode:Failed to convert into integer")
		return
	}
	//upper limit
	upperLimit, err := strconv.Atoi(parts[1])
	if err != nil {
		fmt.Println("mode:Failed to convert into integer")
		return
	}

	if len(newClassLimit) < 2 {
		fmt.Println("mode:class limit is less than 2")
		return
	}

	height := upperLimit - lowerLimit
	frequency := freq[indexOfMedianf]

	//cf (preceding)
	var preCF float64
	//Boundary check
	if indexOfMedianCf == 0 {
		fmt.Println("median:Index of median CF is 0 and index can't be subtracted by -1")
		return
	}
	preCF = cf[indexOfMedianCf-1]
	data := &Data{
		L: float64(lowerLimit), Cf: preCF, N: totalSumOfFreq, f: frequency, H: float64(height),
	}

	formula := data.L + (((data.N/2)-data.Cf)/data.f)*data.H
	c.JSON(http.StatusOK, gin.H{"median": formula})
}
