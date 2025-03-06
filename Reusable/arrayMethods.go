package reusable

// Checking index of given value
func IndexOf(nums []float64, value float64) int {
	for i, v := range nums {
		if v == value {
			return i
		}
	}
	return -1
}

// Sum all values in array
func SumAllValues(num []float64) float64 {
	var initVal float64 = 0
	for _, i := range num {
		initVal += i
	}
	return initVal
}
