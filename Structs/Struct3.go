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
