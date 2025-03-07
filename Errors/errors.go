package custom_errors

import "errors"

var (
	ErrNotAUser           = errors.New("no user found")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrDbQuery            = errors.New("database query error")
	ErrInvalidPass        = errors.New("invalid password")
	ErrCIFIunequal        = errors.New("fields in c.i and f.i should be equal")
	ErrCheckIndex         = errors.New("failed to check index of given value and returning -1")
)
