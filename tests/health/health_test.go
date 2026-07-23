package health

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

type DiagnosticsResponse struct {
	Status         string  `json:"status"`
	UptimeSeconds  float64 `json:"uptimeSeconds"`
	NumGoroutine   int     `json:"numGoroutine"`
	MemAllocMB     float64 `json:"memAllocMB"`
	ActiveRoutes   int     `json:"activeRoutes"`
	ActiveTarget   string  `json:"activeTarget"`
}

func TestDiagnosticsPayloadStructure(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(DiagnosticsResponse{
			Status:        "healthy",
			UptimeSeconds: 124.5,
			NumGoroutine:  6,
			MemAllocMB:    1.85,
			ActiveRoutes:  3,
			ActiveTarget:  "dep_8a2f10b",
		})
	})

	req := httptest.NewRequest("GET", "/health/diagnostics", nil)
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	var resp DiagnosticsResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	if resp.Status != "healthy" {
		t.Errorf("Expected status 'healthy', got '%s'", resp.Status)
	}
	if resp.ActiveTarget != "dep_8a2f10b" {
		t.Errorf("Expected active target 'dep_8a2f10b', got '%s'", resp.ActiveTarget)
	}
}
