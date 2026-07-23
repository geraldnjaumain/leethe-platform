import { NixpacksPlan } from '../../../packages/types/compute';

/**
 * Pure Functional Nixpacks Build Plan Generator.
 * Inspects source file manifests to automatically derive build and runtime instructions.
 */
export function generateNixpacksPlan(fileManifest: string[]): NixpacksPlan {
  const files = new Set(fileManifest);

  // 1. Dockerfile Fallback
  if (files.has('Dockerfile') || files.has('dockerfile')) {
    return {
      provider: 'dockerfile',
      buildCommand: 'docker build -t app .',
      startCommand: 'docker run -p 8080:8080 app',
      environmentVars: { PORT: '8080' },
    };
  }

  // 2. Node.js Provider
  if (files.has('package.json')) {
    const hasPnpm = files.has('pnpm-lock.yaml');
    const hasYarn = files.has('yarn.lock');
    const installCmd = hasPnpm ? 'pnpm install' : hasYarn ? 'yarn install' : 'npm install';
    const buildCmd = hasPnpm ? 'pnpm run build' : hasYarn ? 'yarn build' : 'npm run build';
    const startCmd = hasPnpm ? 'pnpm start' : hasYarn ? 'yarn start' : 'npm start';

    return {
      provider: 'node',
      installCommand: installCmd,
      buildCommand: buildCmd,
      startCommand: startCmd,
      environmentVars: { NODE_ENV: 'production', PORT: '3000' },
    };
  }

  // 3. Go Provider
  if (files.has('go.mod') || files.has('main.go')) {
    return {
      provider: 'go',
      installCommand: 'go mod download',
      buildCommand: 'go build -o server .',
      startCommand: './server',
      environmentVars: { PORT: '8080' },
    };
  }

  // 4. Python Provider
  if (files.has('requirements.txt') || files.has('Pipfile') || files.has('pyproject.toml')) {
    return {
      provider: 'python',
      installCommand: 'pip install -r requirements.txt',
      buildCommand: undefined,
      startCommand: 'python app.py',
      environmentVars: { PYTHONUNBUFFERED: '1', PORT: '8000' },
    };
  }

  // 5. Rust Provider
  if (files.has('Cargo.toml')) {
    return {
      provider: 'rust',
      installCommand: undefined,
      buildCommand: 'cargo build --release',
      startCommand: './target/release/app',
      environmentVars: { RUST_LOG: 'info', PORT: '8080' },
    };
  }

  // Generic Fallback
  return {
    provider: 'generic',
    installCommand: undefined,
    buildCommand: undefined,
    startCommand: 'echo "No runtime detected"',
    environmentVars: {},
  };
}
