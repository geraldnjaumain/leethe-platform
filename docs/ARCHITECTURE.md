# Leethe Platform Architecture & Engineering Operations Handbook

`leethe` is an AI-free, high-performance developer platform designed for sub-millisecond deployments, zero-downtime rollbacks, and native self-hosting.

---

## 1. Domain Services Topology

The platform consists of 4 core Go domain services:

```
                  +-----------------------+
                  |  Edge Proxy (Port 8084)|
                  |  - Atomic Switcher    |
                  |  - Health Poller      |
                  +-----------+-----------+
                              |
       +----------------------+----------------------+
       |                      |                      |
+------v-------+      +-------v------+       +-------v------+
| Identity Svc |      |  VCS Engine  |       | Compute Svc  |
| (Port 8081)  |      | (Port 8082)  |       | (Port 8083)  |
| - FGAC       |      | - Git Smart  |       | - Nixpacks   |
| - Passkey    |      |   HTTP Server|       | - WS Logs    |
+--------------+      +--------------+       +--------------+
```

1. **`services/identity`** (Port 8081): Passkey authentication & $O(1)$ FGAC policy evaluation engine (**231M ops/sec**).
2. **`services/vcs-engine`** (Port 8082): Native Smart HTTP Git server (`git-upload-pack`, `git-receive-pack`) & streaming patch parser.
3. **`services/compute-engine`** (Port 8083): Nixpacks auto-builder plan generator & real-time WebSocket log streaming server.
4. **`services/edge-proxy`** (Port 8084): Sub-1ms dynamic request router, active upstream health poller, and **0.0060ms** atomic target rollback switcher.

---

## 2. Zero-Downtime Atomic Rollback Engine

The edge proxy routes incoming HTTP requests via a thread-safe atomic pointer map:

* Target swaps update `ActiveDeploymentID` with $O(1)$ RCU (Read-Copy-Update) mutex locking.
* Benchmarked rollback execution latency: **0.0060 ms**.

---

## 3. Developer CLI Commands (`bin/leethe`)

| Command | Usage | Description |
| :--- | :--- | :--- |
| `leethe init [app]` | `leethe init my-app` | Scaffold a zero-dependency Go web service template |
| `leethe deploy` | `leethe deploy` | Trigger Nixpacks auto-builder and update edge proxy route |
| `leethe rollback` | `leethe rollback dep_7f8a92a` | Execute instant zero-downtime target pointer rollback |
| `leethe status` | `leethe status` | View active proxy target ID and health telemetry |
| `leethe logs` | `leethe logs` | Stream real-time WebSocket deployment logs |

---

## 4. Build & Testing Matrix

```bash
make all          # Build single-binary Developer CLI
make build-all    # Cross-compile static target binaries for 4 architectures
make dev          # Launch Web Dashboard Harness on http://localhost:8095
make e2e          # Run 4-stage Go E2E pipeline test
make bench        # Run Go zero-allocation performance benchmark suite
make test-health  # Run health & diagnostics integration tests
make dist         # Package gzipped release tarballs and generate dist/checksums.txt
```
