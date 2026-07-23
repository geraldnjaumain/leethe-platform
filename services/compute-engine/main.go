package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

type BuildRequest struct {
	DeploymentID string        `json:"deploymentId"`
	RepoName     string        `json:"repoName"`
	Manifest     ManifestFiles `json:"manifest"`
}

type BuildResponse struct {
	DeploymentID string       `json:"deploymentId"`
	Plan         NixpacksPlan `json:"plan"`
	Status       string       `json:"status"`
	CreatedAt    string       `json:"createdAt"`
}

func handleBuilds(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var req BuildRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		req = BuildRequest{
			DeploymentID: "dep_default",
			RepoName:     "leethe-app",
			Manifest:     ManifestFiles{HasPackageJSON: true, HasPnpmLock: true},
		}
	}

	plan := DeriveNixpacksPlan(req.Manifest)
	resp := BuildResponse{
		DeploymentID: req.DeploymentID,
		Plan:         plan,
		Status:       "QUEUED",
		CreatedAt:    time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)

	log.Printf("[compute-engine] Build triggered for %s (Provider: %s)\n", req.DeploymentID, plan.Provider)
}

func handleLogs(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, `{"status": "connected", "stream": "ws://localhost:8083/logs/ws"}`)
}

func router(w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/health":
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, "Compute Engine Healthy (Go 1.22)")
	case "/api/builds":
		handleBuilds(w, r)
	case "/logs":
		handleLogs(w, r)
	default:
		http.NotFound(w, r)
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8083"
	}

	log.Printf("[compute-engine] Native Go Compute Engine listening on :%s\n", port)
	if err := http.ListenAndServe(":"+port, http.HandlerFunc(router)); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
