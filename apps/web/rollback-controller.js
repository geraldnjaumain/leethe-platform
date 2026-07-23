import { executeRollback } from '../../services/edge-proxy/domain/rollback-engine.ts';

/**
 * Bespoke Rollback Controller & PR Preview Component
 */
export class RollbackController {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.routeMap = options.routeMap;
    this.deployments = options.deployments || [];
    this.onRollback = options.onRollback;

    if (this.container && this.routeMap) {
      this.render();
    }
  }

  render(bannerRecord = null) {
    this.container.innerHTML = `
      <div class="rollback-panel">
        <div class="rollback-header">
          <div>
            <h3 class="rollback-title">Production Deployment History & Target Switcher</h3>
            <p class="leethe-card-description">Zero-Downtime Atomic Proxy Target Switching (<10ms)</p>
          </div>
          <span class="leethe-badge leethe-badge-mono leethe-badge-success">
            <span class="leethe-badge-dot"></span> Domain: ${this.routeMap.domain}
          </span>
        </div>

        <div class="rollback-timeline" id="timeline-list"></div>

        ${bannerRecord ? `
          <div class="rollback-banner">
            <span>⚡ Instant Rollback Executed! Target switched to <strong>${bannerRecord.targetDeploymentId}</strong></span>
            <span class="leethe-badge leethe-badge-mono leethe-badge-success">Latency: ${bannerRecord.latencyMs}ms</span>
          </div>
        ` : ''}
      </div>
    `;

    const timelineList = this.container.querySelector('#timeline-list');
    this.deployments.forEach(dep => {
      const isActive = dep.id === this.routeMap.activeDeploymentId;
      const item = document.createElement('div');
      item.className = `timeline-item ${isActive ? 'active-target' : ''}`;

      item.innerHTML = `
        <div class="timeline-meta">
          <span class="timeline-sha">sha: ${dep.commitSha}</span>
          <span class="leethe-badge leethe-badge-mono">${dep.id}</span>
          <span class="timeline-date">${dep.createdAt}</span>
        </div>
        <div class="timeline-actions">
          ${isActive ? `
            <span class="leethe-badge leethe-badge-success">
              <span class="leethe-badge-dot"></span> Active Production Target
            </span>
          ` : `
            <button class="leethe-btn leethe-btn-secondary leethe-btn-sm rollback-trigger-btn" data-dep-id="${dep.id}">
              <span>↩️ Rollback to this version</span>
            </button>
          `}
        </div>
      `;

      const btn = item.querySelector('.rollback-trigger-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          this.triggerRollback(dep.id);
        });
      }

      timelineList.appendChild(item);
    });
  }

  triggerRollback(targetDeploymentId) {
    try {
      const { updatedMap, record } = executeRollback(this.routeMap, targetDeploymentId, 'developer');
      this.routeMap = updatedMap;
      this.render(record);
      if (this.onRollback) this.onRollback(updatedMap, record);
    } catch (err) {
      alert(`Rollback failed: ${err.message}`);
    }
  }
}
