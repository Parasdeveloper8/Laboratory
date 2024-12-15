package custom_errors

import "errors"

var (
	ErrNotAUser           = errors.New("no user found")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrDbQuery            = errors.New("database query error")
	ErrInvalidPass        = errors.New("Invalid Password")
)
