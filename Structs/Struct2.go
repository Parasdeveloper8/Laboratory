package reusable_structs

type BlogsData struct {
	UserName      string  `db:"name"`
	Post_Id       string  `db:"post_id"`
	Name          string  `db:"name"`
	User_Image    []byte  `db:"user_img"`
	Base64string  []byte  `db:"base64string"`
	Uploaded_at   []uint8 `db:"uploaded_at"`
	Email         string  `db:"email"`
	Title         string  `db:"title"`
	FormattedTime string
	Category      string `db:"category"`
}

type ProfileData struct {
	Name          string      `db:"name"`
	Profile_image []byte      `db:"profile_image"`
	Email         string      `db:"email"`
	Role          string      `db:"role"`
	About         interface{} `db:"about"`
}
