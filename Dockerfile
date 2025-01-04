FROM windows

#Working directory in container
WORKDIR /laboratory

#Copying go.mod file
COPY go.mod go.mod

#Install dependencies
RUN go get 

#Copying main.go file
COPY main.go .

#Entry point to run the App
ENTRYPOINT [ "go","main.go" ]