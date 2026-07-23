package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

type AuthRequest struct {
	Role   string `json:"role"`
	Action string `json:"action"`
}

type AuthResponse struct {
	Allowed bool   `json:"allowed"`
	Role    string `json:"role"`
	Action  string `json:"action"`
}

func handleEvaluate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		req = AuthRequest{Role: "developer", Action: "repo:write"}
	}

	allowed := EvaluatePermission(req.Role, req.Action)

	resp := AuthResponse{
		Allowed: allowed,
		Role:    req.Role,
		Action:  req.Action,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func router(w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/health":
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, "Identity Service Healthy (Go 1.22)")
	case "/api/auth/evaluate":
		handleEvaluate(w, r)
	default:
		http.NotFound(w, r)
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	// Run DB schema migrations on startup
	if _, err := RunMigrations(); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	log.Printf("[identity-service] Native Go Identity & FGAC Policy Evaluator listening on :%s\n", port)
	if err := http.ListenAndServe(":"+port, http.HandlerFunc(router)); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
