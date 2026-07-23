/**
 * Bespoke Live Log Terminal Component
 */
export class LogTerminal {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.autoScroll = true;
    this.logs = [];

    if (this.container) {
      this.initDOM();
    }
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="terminal-container">
        <div class="terminal-header">
          <div class="terminal-title">
            <span>💻</span>
            <span>Live Build & Runtime Stream</span>
            <span class="leethe-badge leethe-badge-warning leethe-badge-sm" id="term-status-badge">
              <span class="leethe-badge-dot"></span> Streaming...
            </span>
          </div>
          <div class="terminal-controls">
            <button class="terminal-btn ${this.autoScroll ? 'active' : ''}" id="term-autoscroll-btn">Auto-scroll: ON</button>
            <button class="terminal-btn" id="term-clear-btn">Clear Logs</button>
          </div>
        </div>
        <div class="terminal-viewport" id="terminal-viewport"></div>
      </div>
    `;

    this.viewport = this.container.querySelector('#terminal-viewport');
    this.autoScrollBtn = this.container.querySelector('#term-autoscroll-btn');
    this.clearBtn = this.container.querySelector('#term-clear-btn');

    this.autoScrollBtn.addEventListener('click', () => {
      this.autoScroll = !this.autoScroll;
      this.autoScrollBtn.textContent = `Auto-scroll: ${this.autoScroll ? 'ON' : 'OFF'}`;
      this.autoScrollBtn.classList.toggle('active', this.autoScroll);
    });

    this.clearBtn.addEventListener('click', () => {
      this.clear();
    });
  }

  appendLog(chunk) {
    this.logs.push(chunk);
    const line = document.createElement('div');
    line.className = 'terminal-line';

    const levelClass = chunk.level === 'success' ? 'log-success' :
                       chunk.level === 'error' ? 'log-error' :
                       chunk.level === 'warn' ? 'log-warn' : 'log-info';

    line.innerHTML = `
      <span class="terminal-timestamp">${chunk.timestamp}</span>
      <span class="terminal-phase">${chunk.phase}</span>
      <span class="terminal-msg ${levelClass}">${this.escapeHTML(chunk.message)}</span>
    `;

    this.viewport.appendChild(line);

    if (this.autoScroll) {
      this.viewport.scrollTop = this.viewport.scrollHeight;
    }
  }

  setStatus(statusText, variant = 'warning') {
    const badge = this.container.querySelector('#term-status-badge');
    if (badge) {
      badge.className = `leethe-badge leethe-badge-${variant} leethe-badge-sm`;
      badge.innerHTML = `<span class="leethe-badge-dot"></span> ${statusText}`;
    }
  }

  clear() {
    this.logs = [];
    if (this.viewport) this.viewport.innerHTML = '';
  }

  escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
