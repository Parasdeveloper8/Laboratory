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
	ProfileId     string `db:"profileId"`
}

//Struct of Answers
type Answers struct {
	Answer        string `db:"text"`
	Username      string `db:"username"`
	Que_id        string `db:"id"`
	Ans_id        string `db:"ans_id"`
	ProfileId     string `db:"profileId"`
	Profile_Image []byte `db:"profile_image"`
}

//struct of likes
type Likes struct {
	Ans_id       string `db:"ans_id"`
	Likes_Number int64  `db:"likes_number"`
}

//struct of post likes
type PostLikes struct {
	PostId       string `db:"post_id"`
	Likes_Number int64  `db:"likes_number"`
}

//struct for Sanskrit json data
type Sanskrit struct {
	Shabd    string `json:"shabd"`
	Arth     string `json:"arth"`
	Vachan   string `json:"vachan"`
	Vibhakti string `json:"vibhakti"`
	Ling     string `json:"ling"`
	Karak    string `json:"karak"`
}
