FROM golang:1.23.2

#Working directory in container
WORKDIR /laboratory

#Copying everything
COPY . .

#Install dependencies
RUN go get 

#Entry point to run the App
ENTRYPOINT [ "go","main.go" ]
