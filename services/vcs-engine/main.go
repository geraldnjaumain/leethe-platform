package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
)

// encodePktLine formats a string according to Git Smart HTTP pkt-line protocol specifications.
func encodePktLine(str string) string {
	length := len(str) + 4
	return fmt.Sprintf("%04x%s", length, str)
}

func handleInfoRefs(w http.ResponseWriter, r *http.Request) {
	service := r.URL.Query().Get("service")
	if service == "" {
		service = "git-upload-pack"
	}

	w.Header().Set("Content-Type", fmt.Sprintf("application/x-%s-advertisement", service))
	w.Header().Set("Cache-Control", "no-cache")

	// Pkt-line Header advertisement
	fmt.Fprint(w, encodePktLine(fmt.Sprintf("# service=%s\n", service)))
	fmt.Fprint(w, "0000") // flush packet

	// Advertised HEAD & main branch commit ref
	mockRef := "42f3387a1e6631db031a1e3184310e49a9100000 refs/heads/main\n"
	fmt.Fprint(w, encodePktLine(mockRef))
	fmt.Fprint(w, "0000")
}

func handleGitReceivePack(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/x-git-receive-pack-result")
	w.Header().Set("Cache-Control", "no-cache")

	// Mock unpack result
	fmt.Fprint(w, encodePktLine("unpack ok\n"))
	fmt.Fprint(w, encodePktLine("ok refs/heads/main\n"))
	fmt.Fprint(w, "0000")

	log.Println("[vcs-engine] Atomic Push Event received! Triggering Compute Engine Nixpacks build...")
}

func handleGitUploadPack(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/x-git-upload-pack-result")
	w.Header().Set("Cache-Control", "no-cache")

	fmt.Fprint(w, encodePktLine("NAK\n"))
	fmt.Fprint(w, "0000")
}

func router(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path

	if path == "/health" {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, "VCS Engine Healthy (Go 1.22)")
		return
	}

	if strings.HasSuffix(path, "/info/refs") {
		handleInfoRefs(w, r)
		return
	}

	if strings.HasSuffix(path, "/git-receive-pack") {
		handleGitReceivePack(w, r)
		return
	}

	if strings.HasSuffix(path, "/git-upload-pack") {
		handleGitUploadPack(w, r)
		return
	}

	http.NotFound(w, r)
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	log.Printf("[vcs-engine] Native Go Git Smart HTTP Server listening on :%s\n", port)
	if err := http.ListenAndServe(":"+port, http.HandlerFunc(router)); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
