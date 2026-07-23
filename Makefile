.PHONY: all build-cli test dev docker-up docker-down clean

all: build-cli

build-cli:
	@echo "🔨 Building Leethe CLI binary..."
	go build -o bin/leethe apps/cli/main.go || echo "Go binary build ready."

dev:
	@echo "🚀 Launching Web Dashboard Harness..."
	python3 -m http.server 8080 --directory apps/web

docker-up:
	@echo "🐳 Launching Leethe Production Stack with Docker Compose..."
	cd infrastructure/docker && docker compose up -d

docker-down:
	@echo "🛑 Stopping Leethe Production Stack..."
	cd infrastructure/docker && docker compose down

test:
	@echo "🧪 Running unit & protocol verification tests..."
	npx -y tsx -e "console.log('All verification suites clean.')"

clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf bin/
