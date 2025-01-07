package reusable

import (
	reusable_structs "Laboratory/Structs"
	"log"

	"gopkg.in/gomail.v2"
)

// Mail Sender function which takes 3 arguments receiver,subject,body
// This function returns error if any error occurs
func SendMail(to, subject, body string) error {
	configs, err := reusable_structs.Init()
	if err != nil {
		log.Printf("Failed to load configurations: %v", err)
	}
	from := configs.EMAIL
	password := configs.EMAIL_PASSWORD
	smtpHost := "smtp.gmail.com"
	smtpPort := 587

	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/plain", body)

	d := gomail.NewDialer(smtpHost, smtpPort, from, password)

	return d.DialAndSend(m)
}
