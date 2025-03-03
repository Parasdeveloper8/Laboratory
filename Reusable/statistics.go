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
}

// Calculate mean from api data
func CalculateMean(c_i []string, freq []float64) float64 {

}

// calculate mode from api data
func CalculateMode(c_i []string, freq []float64) (float64, error) {
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

	return 0, nil
}

// calculate median from api data
func CalculateMedian(c_i []string, freq []float64) float64 {

}
