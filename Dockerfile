FROM golang:1.24.1

# Working directory in container
WORKDIR /laboratory

# Copy everything into the container
COPY . .

# Install dependencies
RUN go mod tidy  # It's better to use go mod tidy to fetch dependencies

# Entry point to run the app
ENTRYPOINT ["go", "run", "main.go","--port","4900"]

