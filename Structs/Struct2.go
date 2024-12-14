package reusable_structs

type BlogsData struct {
	/*Id           int     `db:"id"`
	Name         string  `db:"name"`*/
	Base64string []byte `db:"base64string"`
	/*Uploaded_at  []uint8 `db:"uploaded_at"`*/
	Email string `db:"email"`
	Title string `db:"title"`
	//Image_url    string  `db:"image_url"`
}
