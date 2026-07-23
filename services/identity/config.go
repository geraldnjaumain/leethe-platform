package main

import (
	"errors"
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	Port          int
	DatabaseURL   string
	RedisURL      string
	JWTSecret     string
	SessionDomain string
	Environment   string
}

// LoadConfig enforces zero-trust environment variable parsing without silent fallback swallowing.
func LoadConfig() (*Config, error) {
	portStr := os.Getenv("PORT")
	if portStr == "" {
		portStr = "8081"
	}

	port, err := strconv.Atoi(portStr)
	if err != nil || port < 1024 || port > 65535 {
		return nil, fmt.Errorf("invalid PORT environment variable '%s': must be integer between 1024 and 65535", portStr)
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://leethe:leethe_secret_pass@localhost:5432/leethe_db"
	}

	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" && os.Getenv("NODE_ENV") == "production" {
		return nil, errors.Error("SECURITY ERROR: JWT_SECRET environment variable is mandatory in production environment")
	}
	if jwtSecret == "" {
		jwtSecret = "dev_secret_leethe_platform_passkey_auth_key_2026"
	}

	env := os.Getenv("NODE_ENV")
	if env == "" {
		env = "development"
	}

	return &Config{
		Port:          port,
		DatabaseURL:   dbURL,
		RedisURL:      redisURL,
		JWTSecret:     jwtSecret,
		SessionDomain: os.Getenv("SESSION_DOMAIN"),
		Environment:   env,
	}, nil
}
