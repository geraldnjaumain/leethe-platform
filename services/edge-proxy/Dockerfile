# Multi-Stage Build for Go Edge Proxy Service
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY services/edge-proxy/go.mod ./
RUN go mod download || true

COPY services/edge-proxy/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /proxy-service .

FROM alpine:3.19
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /proxy-service .

EXPOSE 8084
CMD ["./proxy-service"]
