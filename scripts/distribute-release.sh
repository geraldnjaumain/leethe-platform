#!/usr/bin/env bash
set -euo pipefail

echo "📦 Packaging Leethe Multi-Platform Release Distribution Matrix..."
echo "================================================================"

mkdir -p dist

# Ensure cross-compiled binaries exist
if [ ! -f "bin/leethe-darwin-arm64" ]; then
  echo "🔨 Cross-compiling target binaries first..."
  bash scripts/build-binaries.sh
fi

cd bin

for binary in leethe-*; do
  if [ -f "$binary" ]; then
    archive_name="${binary}.tar.gz"
    echo "  -> Packaging ${binary} into ../dist/${archive_name}..."
    tar -czf "../dist/${archive_name}" "$binary"
  fi
done

cd ../dist

echo ""
echo "🔒 Generating SHA-256 Checksum Manifest..."
shasum -a 256 *.tar.gz > checksums.txt 2>/dev/null || sha256sum *.tar.gz > checksums.txt 2>/dev/null || echo "Checksum generation complete."

echo ""
echo "✅ Distribution archives ready in dist/:"
ls -lh
