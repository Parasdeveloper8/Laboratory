package reusable

import (
	custom_errors "Laboratory/Errors"
	"fmt"
	"strconv"
)

// Checking index of given value
func IndexOf(nums []float64, value float64) (int, error) {
	for i, v := range nums {
		if v == value {
			return i, nil
		}
	}
	err := custom_errors.ErrCheckIndex
	return -1, err
}

// Sum all values in array
func SumAllValues(num []float64) float64 {
	var initVal float64 = 0
	for _, i := range num {
		initVal += i
	}
	return initVal
}

// Convert each part to an integer
// Slice1 = slice whose each part will be converted into int
// Slice2 = slice in which int values will be stored after conversion
// Returns a slice loaded with values .
// Use that returned slice
func EachToInt(slice1 []string, slice2 []int) []int {
	for _, part := range slice1 {
		num, err := strconv.Atoi(part)
		//fmt.Println(parts) debugging line
		if err != nil {
			fmt.Println("Error converting:", err)
			return nil
		}
		slice2 = append(slice2, num)
	}
	return slice2
}
