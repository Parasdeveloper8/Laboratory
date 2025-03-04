package reusable

import (
	custom_errors "Laboratory/Errors"
	"fmt"
	"strconv"
	"strings"
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
func CalculateMode(c_i []string, freq []float64) (float64, error) {
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
		return 0, err
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
	modelClass = strings.Replace(modelClass, "-", "", -1)

	//Trim any trailing spaces and split the string by spaces
	parts := strings.Fields(modelClass)
	classLimit := make([]int, 0, len(parts))

	//Convert each part to an integer
	for _, part := range parts {
		num, err := strconv.Atoi(part)
		if err != nil {
			fmt.Println("Error converting:", err)
			return 0, err
		}
		classLimit = append(classLimit, num)
	}
	//lower limit
	lowerLimit := classLimit[0]
	height := classLimit[1] - classLimit[0]
	f1 := largestNumFI   //f1
	f0 := indexOfNum - 1 //f0
	f2 := indexOfNum + 1 //f2

	var data = &Data{L: float64(lowerLimit), H: float64(height), F1: f1, F0: f0, F2: f2}
	formula := data.L + (data.F1-data.F0/(2*data.F1-data.F0-data.F2))/data.H
	answer := formula
	return answer, nil
}

// calculate median from api data
func CalculateMedian(c_i []string, freq []float64) {
	fmt.Println("Median")
}
