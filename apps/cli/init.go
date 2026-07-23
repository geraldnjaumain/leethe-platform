package main

import (
	"fmt"
	"os"
	"path/filepath"
)

func HandleInit(appName string) error {
	if appName == "" {
		appName = "my-leethe-service"
	}

	targetDir := filepath.Join(".", appName)
	fmt.Printf("\032[34m🚀 Initializing Leethe Service Workspace in ./%s...\033[0m\n", appName)

	if err := os.MkdirAll(targetDir, 0755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	// Scaffold main.go
	mainContent := `package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Hello from Leethe Platform!")
	})
	log.Println("Listening on :8080...")
	http.ListenAndServe(":8080", nil)
}
`
	if err := os.WriteFile(filepath.Join(targetDir, "main.go"), []byte(mainContent), 0644); err != nil {
		return err
	}

	// Scaffold go.mod
	goModContent := fmt.Sprintf("module %s\n\ngo 1.22\n", appName)
	if err := os.WriteFile(filepath.Join(targetDir, "go.mod"), []byte(goModContent), 0644); err != nil {
		return err
	}

	fmt.Printf("\033[32m✅ Workspace '%s' scaffolded successfully!\033[0m\n", appName)
	return nil
}
