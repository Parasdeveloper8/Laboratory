package reusable_structs

type MyPosts struct {
	Base64string  []byte  `db:"base64string"`
	Title         string  `db:"title"`
	Uploaded_at   []uint8 `db:"uploaded_at"`
	Comment_Text  string  `db:"comment_text"`
	Email         string  `db:"email"`
	Formattedtime string
}

// element struct
type FindMetal struct {
	Name     string `json:"name"`
	Symbol   string `json:"symbol"`
	Category string `json:"category"`
}

// Comments struct
type Comments struct {
	Comment_Text         string  `db:"comment_text"`
	Email                string  `db:"email"`
	Post_id              string  `db:"post_id"`
	TimeofComment        []uint8 `db:"time"`
	FormattedTimeComment string
}
