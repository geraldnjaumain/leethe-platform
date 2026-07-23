# Multi-Stage Build for Go Identity Service
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY services/identity/go.mod ./
RUN go mod download || true

COPY services/identity/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /identity-service .

FROM alpine:3.19
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /identity-service .

EXPOSE 8081
CMD ["./identity-service"]
