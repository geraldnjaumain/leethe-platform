package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

type RollbackRequest struct {
	TargetDeploymentID string `json:"targetDeploymentId"`
}

var globalRouteMap = &ProxyRouteMap{
	Domain:             "leethe-platform.leethe.app",
	ActiveDeploymentID: "dep_8a2f10b",
	UpdatedAt:          time.Now().Format(time.RFC3339),
	Upstreams: map[string]UpstreamTarget{
		"dep_8a2f10b": {DeploymentID: "dep_8a2f10b", Host: "10.0.4.12", Port: 3000, Weight: 100, IsHealthy: true},
		"dep_7f8a92a": {DeploymentID: "dep_7f8a92a", Host: "10.0.4.11", Port: 3000, Weight: 100, IsHealthy: true},
		"dep_6e7a81f": {DeploymentID: "dep_6e7a81f", Host: "10.0.4.10", Port: 3000, Weight: 100, IsHealthy: true},
	},
}

func handleRoutes(w http.ResponseWriter, r *http.Request) {
	globalRouteMap.mu.RLock()
	defer globalRouteMap.mu.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(globalRouteMap)
}

func handleDiagnostics(w http.ResponseWriter, r *http.Request) {
	diag := GetDiagnosticsPayload(globalRouteMap)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(diag)
}

func handleRollback(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var req RollbackRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.TargetDeploymentID == "" {
		req.TargetDeploymentID = "dep_7f8a92a"
	}

	record, err := ExecuteGoRollback(globalRouteMap, req.TargetDeploymentID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(record)

	log.Printf("[edge-proxy] Atomic Rollback to '%s' executed in %.4f ms\n", record.TargetID, record.ExecutionLatencyMs)
}

func router(w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/health":
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, "Edge Proxy Healthy (Go 1.22)")
	case "/health/diagnostics":
		handleDiagnostics(w, r)
	case "/api/proxy/routes":
		handleRoutes(w, r)
	case "/api/proxy/rollback":
		handleRollback(w, r)
	default:
		http.NotFound(w, r)
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8084"
	}

	// Initialize background health poller
	poller := NewHealthPoller()
	poller.StartPoller(globalRouteMap, 10*time.Second)

	log.Printf("[edge-proxy] Native Go Edge Proxy listening on :%s\n", port)
	if err := http.ListenAndServe(":"+port, http.HandlerFunc(router)); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
