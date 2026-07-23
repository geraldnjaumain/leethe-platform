package main

import (
	"runtime"
	"time"
)

var startTime = time.Now()

type DiagnosticsPayload struct {
	Status        string  `json:"status"`
	UptimeSeconds float64 `json:"uptimeSeconds"`
	NumGoroutine  int     `json:"numGoroutine"`
	MemAllocMB    float64 `json:"memAllocMB"`
	ActiveRoutes  int     `json:"activeRoutes"`
	ActiveTarget  string  `json:"activeTarget"`
}

// GetDiagnosticsPayload retrieves sub-1ms Go runtime performance and memory metrics.
func GetDiagnosticsPayload(routeMap *ProxyRouteMap) DiagnosticsPayload {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	routeMap.mu.RLock()
	activeTarget := routeMap.ActiveDeploymentID
	routeCount := len(routeMap.Upstreams)
	routeMap.mu.RUnlock()

	return DiagnosticsPayload{
		Status:        "healthy",
		UptimeSeconds: time.Since(startTime).Seconds(),
		NumGoroutine:  runtime.NumGoroutine(),
		MemAllocMB:    float64(m.Alloc) / (1024 * 1024),
		ActiveRoutes:  routeCount,
		ActiveTarget:  activeTarget,
	}
}
