# Multi-Stage Build for Go Compute Engine Service
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY services/compute-engine/go.mod ./
RUN go mod download || true

COPY services/compute-engine/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /compute-service .

FROM alpine:3.19
RUN apk --no-cache add ca-certificates docker-cli
WORKDIR /root/
COPY --from=builder /compute-service .

EXPOSE 8083
CMD ["./compute-service"]
