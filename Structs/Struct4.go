package reusable_structs

//Struct of elements with their valencies and symbols
type ElementsValAnCation struct {
	Name        string  `json:"name"`
	Atomic_Mass float64 `json:"atomic_mass"`
	Symbol      string  `json:"symbol"`
	Valency     int     `json:"valency"`
}

//Struct of Questions
type Questions struct {
	Text          string  `db:"text"`
	Username      string  `db:"username"`
	Email         string  `db:"email"`
	Id            string  `db:"id"`
	Category      string  `db:"category"`
	Time          []uint8 `db:"time"`
	FormattedTime string
	Profile_Image []byte `db:"profile_image"`
}

//Struct of Answers
type Answers struct {
	Answer   string `db:"text"`
	Username string `db:"username"`
	Que_id   string `db:"id"`
	Ans_id   string `db:"ans_id"`
}

//struct of likes
type Likes struct {
	Ans_id       string `db:"ans_id"`
	Likes_Number int64  `db:"likes_number"`
}
