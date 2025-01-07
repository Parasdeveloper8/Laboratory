package reusable

import "golang.org/x/crypto/bcrypt"

// cost is a measure of how many times to run the hash
// Hashing Password with default cost 10
func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}
