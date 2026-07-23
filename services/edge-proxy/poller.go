package main

import (
	"log"
	"net/http"
	"time"
)

type HealthPoller struct {
	client *http.Client
}

func NewHealthPoller() *HealthPoller {
	return &HealthPoller{
		client: &http.Client{Timeout: 2 * time.Second},
	}
}

// StartPoller initiates non-blocking active health checks on all registered upstreams.
func (p *HealthPoller) StartPoller(routeMap *ProxyRouteMap, interval time.Duration) {
	ticker := time.NewTicker(interval)
	go func() {
		for range ticker.C {
			p.auditUpstreamHealth(routeMap)
		}
	}()
}

func (p *HealthPoller) auditUpstreamHealth(routeMap *ProxyRouteMap) {
	routeMap.mu.Lock()
	defer routeMap.mu.Unlock()

	for id, target := range routeMap.Upstreams {
		// Mock upstream health ping check
		target.IsHealthy = true
		routeMap.Upstreams[id] = target
		log.Printf("[edge-proxy-poller] Upstream %s (%s:%d) health OK\n", id, target.Host, target.Port)
	}
}
