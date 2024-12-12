package err

import "errors"

var (
	ErrNotAUser           = errors.New("no user found")
	ErrInvalidCredentials = errors.New("invalid credentials")
)
