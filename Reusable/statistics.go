package reusable

import (
	custom_errors "Laboratory/Errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// Checking index of given value
func IndexOf(nums []float64, value float64) float64 {
	for i, v := range nums {
		if v == value {
			return float64(i)
		}
	}
	return -1
}

// Calculate mean from api data
func CalculateMean(c_i []string, freq []float64) {
	fmt.Println("Mean")
}

// calculate mode from api data
func CalculateMode(c_i []string, freq []float64, c *gin.Context) {
	//struct for statistics data(mean)
	type Data struct {
		H  float64 //Height
		L  float64 //lower limit of model class
		F1 float64
		F2 float64
		F0 float64
	}

	lenF_I := len(freq)
	lenC_I := len(c_i)

	if lenC_I != lenF_I {
		err := custom_errors.ErrCIFIunequal
		fmt.Println(err)
		return
	}
	var largestNumFI float64 = freq[0] //
	//check largest number in frequency table
	for _, num := range freq {
		if num > largestNumFI {
			largestNumFI = num
		}
	}
	//index of largestNumFI
	indexOfNum := IndexOf(freq, largestNumFI)
	//index of model class is also equal to index of frequency
	indexOfModelClass := indexOfNum

	modelClass := c_i[int(indexOfModelClass)]
	parts := strings.Split(modelClass, "-")
	if len(parts) != 2 {
		fmt.Printf("invalid class interval format: %v", modelClass)
		return
	}

	classLimit := make([]int, 0, len(parts))
	//Convert each part to an integer
	for _, part := range parts {
		num, err := strconv.Atoi(part)
		fmt.Println(parts)
		if err != nil {
			fmt.Println("Error converting:", err)
			return
		}
		classLimit = append(classLimit, num)
	}
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

	if len(classLimit) < 2 {
		fmt.Println("mode:class limit is less than 2")
		return
	}
	height := upperLimit - lowerLimit
	f1 := largestNumFI //f1
	var f0, f2 float64
	if indexOfNum > 0 {
		f0 = freq[int(indexOfNum)-1] //f0
	}
	if int(indexOfNum) < len(freq)-1 {
		f2 = freq[int(indexOfNum)+1] //f2
	}
	var data = &Data{L: float64(lowerLimit), H: float64(height), F1: f1, F0: f0, F2: f2}
	fmt.Println(f1, f2, f0, height, lowerLimit)
	formula := data.L + ((data.F1-data.F0)/((2*data.F1)-data.F0-data.F2))*data.H
	answer := formula
	c.JSON(http.StatusOK, gin.H{"Mode:": answer})
}

// calculate median from api data
func CalculateMedian(c_i []string, freq []float64) {
	fmt.Println("Median")
}
