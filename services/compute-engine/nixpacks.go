package main

type Provider string

const (
	ProviderDockerfile Provider = "dockerfile"
	ProviderNode       Provider = "node"
	ProviderGo         Provider = "go"
	ProviderPython     Provider = "python"
	ProviderRust       Provider = "rust"
)

type ManifestFiles struct {
	HasDockerfile bool
	HasPackageJSON bool
	HasPnpmLock   bool
	HasYarnLock   bool
	HasGoMod      bool
	HasRequirements bool
	HasCargoToml  bool
}

type PhaseConfig struct {
	Commands []string          `json:"commands"`
	Env      map[string]string `json:"env,omitempty"`
}

type NixpacksPlan struct {
	Provider Provider               `json:"provider"`
	Pkgs     []string               `json:"pkgs"`
	Phases   map[string]PhaseConfig `json:"phases"`
	StartCmd string                 `json:"startCmd"`
}

// DeriveNixpacksPlan derives container build execution plans based on repository manifest files.
func DeriveNixpacksPlan(manifest ManifestFiles) NixpacksPlan {
	if manifest.HasDockerfile {
		return NixpacksPlan{
			Provider: ProviderDockerfile,
			Pkgs:     []string{"docker"},
			Phases: map[string]PhaseConfig{
				"build": {Commands: []string{"docker build -t app ."}},
			},
			StartCmd: "docker run app",
		}
	}

	if manifest.HasPackageJSON {
		pkgManager := "npm"
		installCmd := "npm install"
		if manifest.HasPnpmLock {
			pkgManager = "pnpm"
			installCmd = "pnpm install --frozen-lockfile"
		} else if manifest.HasYarnLock {
			pkgManager = "yarn"
			installCmd = "yarn install --frozen-lockfile"
		}

		return NixpacksPlan{
			Provider: ProviderNode,
			Pkgs:     []string{"nodejs", pkgManager},
			Phases: map[string]PhaseConfig{
				"setup": {Commands: []string{installCmd}},
				"build": {Commands: []string{pkgManager + " run build"}},
			},
			StartCmd: pkgManager + " start",
		}
	}

	if manifest.HasGoMod {
		return NixpacksPlan{
			Provider: ProviderGo,
			Pkgs:     []string{"go"},
			Phases: map[string]PhaseConfig{
				"setup": {Commands: []string{"go mod download"}},
				"build": {Commands: []string{"go build -o server ."}},
			},
			StartCmd: "./server",
		}
	}

	if manifest.HasRequirements {
		return NixpacksPlan{
			Provider: ProviderPython,
			Pkgs:     []string{"python", "pip"},
			Phases: map[string]PhaseConfig{
				"setup": {Commands: []string{"pip install -r requirements.txt"}},
			},
			StartCmd: "python main.py",
		}
	}

	return NixpacksPlan{
		Provider: ProviderRust,
		Pkgs:     []string{"rustc", "cargo"},
		Phases: map[string]PhaseConfig{
			"build": {Commands: []string{"cargo build --release"}},
		},
		StartCmd: "./target/release/app",
	}
}
