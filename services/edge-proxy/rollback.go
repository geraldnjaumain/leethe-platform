package main

import (
	"fmt"

	"sync"
	"time"
)

type UpstreamTarget struct {
	DeploymentID string `json:"deploymentId"`
	Host         string `json:"host"`
	Port         int    `json:"port"`
	Weight       int    `json:"weight"`
	IsHealthy    bool   `json:"isHealthy"`
}

type ProxyRouteMap struct {
	Domain             string                    `json:"domain"`
	ActiveDeploymentID string                    `json:"activeDeploymentId"`
	UpdatedAt          string                    `json:"updatedAt"`
	Upstreams          map[string]UpstreamTarget `json:"upstreams"`
	mu                 sync.RWMutex
}

type RollbackRecord struct {
	RollbackID        string  `json:"rollbackId"`
	PreviousID        string  `json:"previousId"`
	TargetID          string  `json:"targetId"`
	ExecutionLatencyMs float64 `json:"executionLatencyMs"`
	ExecutedAt        string  `json:"executedAt"`
}

// ExecuteGoRollback performs an atomic, thread-safe in-memory upstream target pointer swap under sub-1ms budgets.
func ExecuteGoRollback(routeMap *ProxyRouteMap, targetID string) (RollbackRecord, error) {
	startTime := time.Now()

	routeMap.mu.Lock()
	defer routeMap.mu.Unlock()

	targetUpstream, exists := routeMap.Upstreams[targetID]
	if !exists || !targetUpstream.IsHealthy {
		return RollbackRecord{}, fmt.Errorf("target deployment '%s' is invalid or unhealthy", targetID)
	}

	previousID := routeMap.ActiveDeploymentID
	routeMap.ActiveDeploymentID = targetID
	routeMap.UpdatedAt = time.Now().Format(time.RFC3339)

	latency := float64(time.Since(startTime).Microseconds()) / 1000.0

	return RollbackRecord{
		RollbackID:         fmt.Sprintf("rb_%d", time.Now().UnixNano()),
		PreviousID:         previousID,
		TargetID:           targetID,
		ExecutionLatencyMs: latency,
		ExecutedAt:         routeMap.UpdatedAt,
	}, nil
}
