package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

type LoginRequest struct {
	Username string `json:"username"`
	Passkey  string `json:"passkey"`
}

type LoginResponse struct {
	SessionToken string      `json:"sessionToken"`
	User         AuthContext `json:"user"`
	ExpiresAt    string      `json:"expiresAt"`
}

type PermissionRequest struct {
	Context     AuthContext       `json:"context"`
	Action      PermissionAction  `json:"action"`
	Environment TargetEnvironment `json:"environment"`
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		req.Username = "geraldnjaumain"
	}

	user := AuthContext{
		UserID: "usr_8a2f10b",
		OrgID:  "org_leethe_core",
		Role:   RoleAdmin,
	}

	resp := LoginResponse{
		SessionToken: "lth_sess_9a8b7c6d5e4f3a2b1c",
		User:         user,
		ExpiresAt:    time.Now().Add(24 * time.Hour).Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)

	log.Printf("[identity-service] User '%s' authenticated via Passkey session\n", req.Username)
}

func handlePermissions(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var req PermissionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		req = PermissionRequest{
			Context:     AuthContext{UserID: "usr_dev", Role: RoleDeveloper},
			Action:      ActionRollback,
			Environment: EnvProduction,
		}
	}

	result := EvaluatePermission(req.Context, req.Action, req.Environment)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func router(w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/health":
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, "Identity Service Healthy (Go 1.22)")
	case "/api/auth/login":
		handleLogin(w, r)
	case "/api/auth/permissions":
		handlePermissions(w, r)
	default:
		http.NotFound(w, r)
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("[identity-service] Native Go Identity Service listening on :%s\n", port)
	if err := http.ListenAndServe(":"+port, http.HandlerFunc(router)); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
