package reusable_structs

type MyPosts struct {
	Base64string []byte `db:"base64string"`
	Title        string `db:"title"`
}
