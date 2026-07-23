# Multi-Stage Build for Go VCS Engine Service
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY services/vcs-engine/go.mod ./
RUN go mod download || true

COPY services/vcs-engine/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /vcs-service .

FROM alpine:3.19
RUN apk --no-cache add ca-certificates git openssh
WORKDIR /root/
COPY --from=builder /vcs-service .

EXPOSE 8082 22
CMD ["./vcs-service"]
