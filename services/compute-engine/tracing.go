package main

import (
	"fmt"
	"log"
	"time"
)

type TraceSpan struct {
	TraceID     string
	SpanID      string
	ServiceName string
	Operation   string
	DurationMs  float64
	Timestamp   string
}

func RecordSpan(serviceName, operation string, durationMs float64) TraceSpan {
	now := time.Now()
	span := TraceSpan{
		TraceID:     fmt.Sprintf("tr_%d", now.UnixNano()),
		SpanID:      fmt.Sprintf("sp_%d", now.UnixNano()%100000),
		ServiceName: serviceName,
		Operation:   operation,
		DurationMs:  durationMs,
		Timestamp:   now.Format(time.RFC3339),
	}

	log.Printf("[tracing-collector] Recorded Span [%s] %s::%s - %.3f ms\n", span.TraceID, span.ServiceName, span.Operation, span.DurationMs)
	return span
}
