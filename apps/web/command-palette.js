/**
 * Bespoke Vanilla JS Command Palette Module
 */
export class CommandPalette {
  constructor(options = {}) {
    this.options = options;
    this.commands = options.commands || [];
    this.selectedIndex = 0;
    this.isOpen = false;

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    // Backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'cmd-backdrop';
    this.backdrop.id = 'leethe-cmd-backdrop';

    // Dialog
    this.dialog = document.createElement('div');
    this.dialog.className = 'cmd-dialog';
    this.dialog.setAttribute('role', 'dialog');
    this.dialog.setAttribute('aria-modal', 'true');
    this.dialog.setAttribute('aria-label', 'Command Palette');

    // Header Search Input
    const header = document.createElement('div');
    header.className = 'cmd-header';
    header.innerHTML = `
      <svg class="cmd-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input type="text" class="cmd-input" placeholder="Type a command or search platform repositories..." id="cmd-search-input">
    `;

    // List
    this.list = document.createElement('ul');
    this.list.className = 'cmd-list';
    this.list.id = 'cmd-item-list';

    // Footer
    const footer = document.createElement('div');
    footer.className = 'cmd-footer';
    footer.innerHTML = `
      <span>LEETHE Command Menu</span>
      <div class="cmd-footer-hints">
        <span><span class="cmd-item-shortcut">↑↓</span> Navigate</span>
        <span><span class="cmd-item-shortcut">↵</span> Select</span>
        <span><span class="cmd-item-shortcut">ESC</span> Close</span>
      </div>
    `;

    this.dialog.appendChild(header);
    this.dialog.appendChild(this.list);
    this.dialog.appendChild(footer);
    this.backdrop.appendChild(this.dialog);
    document.body.appendChild(this.backdrop);

    this.input = header.querySelector('.cmd-input');
  }

  bindEvents() {
    // Open/Close Shortcut Listener (Cmd+K / Ctrl+K)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      } else if (this.isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.navigate(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.navigate(-1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.executeSelected();
        }
      }
    });

    // Input Filter Listener
    this.input.addEventListener('input', () => {
      this.renderItems(this.input.value.trim());
    });

    // Backdrop Click to Close
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.backdrop.classList.add('open');
    this.input.value = '';
    this.renderItems('');
    setTimeout(() => this.input.focus(), 10);
  }

  close() {
    this.isOpen = false;
    this.backdrop.classList.remove('open');
    this.input.blur();
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  renderItems(query = '') {
    this.list.innerHTML = '';
    const filtered = this.commands.filter(cmd =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      (cmd.category && cmd.category.toLowerCase().includes(query.toLowerCase()))
    );

    if (filtered.length === 0) {
      this.list.innerHTML = `<li class="cmd-item" style="color: var(--text-muted); justify-content: center;">No matching commands found</li>`;
      return;
    }

    this.selectedIndex = 0;
    filtered.forEach((cmd, idx) => {
      const li = document.createElement('li');
      li.className = `cmd-item ${idx === 0 ? 'selected' : ''}`;
      li.dataset.index = idx;
      li.innerHTML = `
        <div class="cmd-item-label">
          <span>${cmd.icon || '⚡'}</span>
          <span>${cmd.title}</span>
        </div>
        ${cmd.shortcut ? `<span class="cmd-item-shortcut">${cmd.shortcut}</span>` : ''}
      `;

      li.addEventListener('click', () => {
        if (cmd.action) cmd.action();
        this.close();
      });

      this.list.appendChild(li);
    });
  }

  navigate(direction) {
    const items = this.list.querySelectorAll('.cmd-item');
    if (!items.length) return;

    items[this.selectedIndex]?.classList.remove('selected');
    this.selectedIndex = (this.selectedIndex + direction + items.length) % items.length;
    const selectedItem = items[this.selectedIndex];
    selectedItem?.classList.add('selected');
    selectedItem?.scrollIntoView({ block: 'nearest' });
  }

  executeSelected() {
    const items = this.list.querySelectorAll('.cmd-item');
    if (items[this.selectedIndex]) {
      items[this.selectedIndex].click();
    }
  }
}
