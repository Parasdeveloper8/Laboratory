package reusable_structs

type MyPosts struct {
	Base64string []byte `db:"base64string"`
	Title        string `db:"title"`
}

// element struct
type FindMetal struct {
	Name     string `json:"name"`
	Symbol   string `json:"symbol"`
	Category string `json:"category"`
}

// Comments struct
type Comments struct {
	Comment_Text string `db:"comment_text"`
	Email        string `db:"email"`
	Post_id      string `db:"post_id"`
}
