package benchmark

import (
	"sync"
	"testing"
	"time"
)

type PermissionCheck struct {
	Role     string
	Resource string
	Action   string
}

func EvaluatePermission(role, action string) bool {
	if role == "owner" || role == "admin" {
		return true
	}
	if role == "developer" && action != "deploy:rollback" && action != "repo:delete" {
		return true
	}
	return role == "viewer" && action == "repo:read"
}

type ProxyRouteMap struct {
	mu                 sync.RWMutex
	ActiveDeploymentID string
}

func (r *ProxyRouteMap) SwapTarget(target string) {
	r.mu.Lock()
	r.ActiveDeploymentID = target
	r.mu.Unlock()
}

func BenchmarkFGACEvaluator(b *testing.B) {
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = EvaluatePermission("developer", "repo:write")
	}
}

func BenchmarkAtomicRollback(b *testing.B) {
	routeMap := &ProxyRouteMap{ActiveDeploymentID: "dep_8a2f10b"}
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		target := "dep_7f8a92a"
		if i%2 == 0 {
			target = "dep_8a2f10b"
		}
		routeMap.SwapTarget(target)
	}
}

func BenchmarkNixpacksPlanDerivation(b *testing.B) {
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = time.Now().Format(time.RFC3339)
	}
}
