/**
 * Bespoke Code Diff Viewer Component
 */
export class DiffViewer {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.files = options.files || [];
    this.mode = options.mode || 'unified'; // 'unified' | 'split'

    if (this.container) {
      this.render();
    }
  }

  setFiles(files) {
    this.files = files;
    this.render();
  }

  setMode(mode) {
    this.mode = mode;
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    if (!this.files.length) {
      this.container.innerHTML = `<div class="diff-container" style="padding: 24px; text-align: center; color: var(--text-muted);">No diff content available</div>`;
      return;
    }

    this.files.forEach(file => {
      const fileCard = document.createElement('div');
      fileCard.className = 'diff-container';

      // Header
      const header = document.createElement('div');
      header.className = 'diff-header';
      header.innerHTML = `
        <div class="diff-file-info">
          <span>📄</span>
          <span>${file.newPath || file.oldPath}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <div class="diff-stat">
            <span class="diff-stat-add">+${file.additions}</span>
            <span class="diff-stat-delete">-${file.deletions}</span>
          </div>
          <div class="diff-mode-toggle">
            <button class="diff-mode-btn ${this.mode === 'unified' ? 'active' : ''}" data-mode="unified">Unified</button>
            <button class="diff-mode-btn ${this.mode === 'split' ? 'active' : ''}" data-mode="split">Split</button>
          </div>
        </div>
      `;

      // Mode Switcher Listeners
      header.querySelectorAll('.diff-mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.setMode(e.target.dataset.mode);
        });
      });

      // Table Content
      const table = document.createElement('table');
      table.className = 'diff-table';

      if (this.mode === 'unified') {
        table.appendChild(this.renderUnifiedBody(file));
      } else {
        table.appendChild(this.renderSplitBody(file));
      }

      fileCard.appendChild(header);
      fileCard.appendChild(table);
      this.container.appendChild(fileCard);
    });
  }

  renderUnifiedBody(file) {
    const tbody = document.createElement('tbody');

    file.hunks.forEach(hunk => {
      // Hunk Header Row
      const hunkRow = document.createElement('tr');
      hunkRow.className = 'diff-row diff-row-hunk';
      hunkRow.innerHTML = `
        <td class="diff-num">...</td>
        <td class="diff-num">...</td>
        <td class="diff-content">${this.escapeHTML(hunk.header)}</td>
      `;
      tbody.appendChild(hunkRow);

      // Line Rows
      hunk.lines.forEach(line => {
        const tr = document.createElement('tr');
        tr.className = `diff-row ${line.type === 'add' ? 'diff-row-add' : line.type === 'delete' ? 'diff-row-delete' : ''}`;
        
        const prefix = line.type === 'add' ? '+' : line.type === 'delete' ? '-' : ' ';
        tr.innerHTML = `
          <td class="diff-num">${line.oldLineNumber || ''}</td>
          <td class="diff-num">${line.newLineNumber || ''}</td>
          <td class="diff-content">${prefix} ${this.escapeHTML(line.content)}</td>
        `;
        tbody.appendChild(tr);
      });
    });

    return tbody;
  }

  renderSplitBody(file) {
    const tbody = document.createElement('tbody');

    file.hunks.forEach(hunk => {
      // Hunk Header Row
      const hunkRow = document.createElement('tr');
      hunkRow.className = 'diff-row diff-row-hunk';
      hunkRow.innerHTML = `
        <td class="diff-num">...</td>
        <td class="diff-content diff-split-cell">${this.escapeHTML(hunk.header)}</td>
        <td class="diff-num">...</td>
        <td class="diff-content diff-split-cell">${this.escapeHTML(hunk.header)}</td>
      `;
      tbody.appendChild(hunkRow);

      // Simple Split Alignment
      let i = 0;
      while (i < hunk.lines.length) {
        const line = hunk.lines[i];
        const tr = document.createElement('tr');
        tr.className = 'diff-row';

        if (line.type === 'normal') {
          tr.innerHTML = `
            <td class="diff-num">${line.oldLineNumber}</td>
            <td class="diff-content diff-split-cell">  ${this.escapeHTML(line.content)}</td>
            <td class="diff-num">${line.newLineNumber}</td>
            <td class="diff-content diff-split-cell">  ${this.escapeHTML(line.content)}</td>
          `;
          i++;
        } else if (line.type === 'delete') {
          // Check if next is addition for side-by-side pairing
          const nextLine = hunk.lines[i + 1];
          if (nextLine && nextLine.type === 'add') {
            tr.innerHTML = `
              <td class="diff-num diff-row-delete">${line.oldLineNumber}</td>
              <td class="diff-content diff-split-cell diff-row-delete">- ${this.escapeHTML(line.content)}</td>
              <td class="diff-num diff-row-add">${nextLine.newLineNumber}</td>
              <td class="diff-content diff-split-cell diff-row-add">+ ${this.escapeHTML(nextLine.content)}</td>
            `;
            i += 2;
          } else {
            tr.innerHTML = `
              <td class="diff-num diff-row-delete">${line.oldLineNumber}</td>
              <td class="diff-content diff-split-cell diff-row-delete">- ${this.escapeHTML(line.content)}</td>
              <td class="diff-num"></td>
              <td class="diff-content diff-split-cell"></td>
            `;
            i++;
          }
        } else if (line.type === 'add') {
          tr.innerHTML = `
            <td class="diff-num"></td>
            <td class="diff-content diff-split-cell"></td>
            <td class="diff-num diff-row-add">${line.newLineNumber}</td>
            <td class="diff-content diff-split-cell diff-row-add">+ ${this.escapeHTML(line.content)}</td>
          `;
          i++;
        }
        tbody.appendChild(tr);
      }
    });

    return tbody;
  }

  escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
