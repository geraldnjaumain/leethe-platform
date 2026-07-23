// Bespoke Service Topology Visualizer Component

export function renderServiceTopology(container) {
  container.innerHTML = `
    <div class="leethe-card" id="topology-card" style="margin-top: 32px;">
      <div class="leethe-card-header">
        <div>
          <h3 class="leethe-card-title">Service Infrastructure Topology</h3>
          <p class="leethe-card-description">Live traffic routing & microservice dependencies</p>
        </div>
        <span class="leethe-badge leethe-badge-success">Active Topology</span>
      </div>
      <div style="display: flex; align-items: center; justify-content: space-around; padding: 24px 12px; background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); margin-top: 16px; flex-wrap: wrap; gap: 16px;">
        <div style="padding: 12px 18px; background: #000000; border: 1px solid var(--color-success-border); border-radius: 8px; text-align: center;">
          <div style="font-size: 11px; color: var(--text-muted);">EDGE PROXY</div>
          <div style="font-weight: 600; color: #ffffff; margin-top: 4px;">:8084</div>
        </div>
        <div style="color: var(--text-muted); font-family: var(--font-mono);">---></div>
        <div style="padding: 12px 18px; background: #000000; border: 1px solid var(--border-subtle); border-radius: 8px; text-align: center;">
          <div style="font-size: 11px; color: var(--text-muted);">IDENTITY SVC</div>
          <div style="font-weight: 600; color: #ffffff; margin-top: 4px;">:8081</div>
        </div>
        <div style="color: var(--text-muted); font-family: var(--font-mono);">---></div>
        <div style="padding: 12px 18px; background: #000000; border: 1px solid var(--border-subtle); border-radius: 8px; text-align: center;">
          <div style="font-size: 11px; color: var(--text-muted);">VCS ENGINE</div>
          <div style="font-weight: 600; color: #ffffff; margin-top: 4px;">:8082</div>
        </div>
        <div style="color: var(--text-muted); font-family: var(--font-mono);">---></div>
        <div style="padding: 12px 18px; background: #000000; border: 1px solid var(--border-subtle); border-radius: 8px; text-align: center;">
          <div style="font-size: 11px; color: var(--text-muted);">COMPUTE SVC</div>
          <div style="font-weight: 600; color: #ffffff; margin-top: 4px;">:8083</div>
        </div>
      </div>
    </div>
  `;
}
