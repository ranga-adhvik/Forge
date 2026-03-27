// ============================================
// LIFE OS — Toast Notification System
// ============================================

export class Toast {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    const icons = {
      info: '💡',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      agent: '🤖',
    };

    const colors = {
      info: 'rgba(59, 130, 246, 0.15)',
      success: 'rgba(16, 185, 129, 0.15)',
      warning: 'rgba(245, 158, 11, 0.15)',
      error: 'rgba(244, 63, 94, 0.15)',
      agent: 'rgba(139, 92, 246, 0.15)',
    };

    const borderColors = {
      info: 'rgba(59, 130, 246, 0.3)',
      success: 'rgba(16, 185, 129, 0.3)',
      warning: 'rgba(245, 158, 11, 0.3)',
      error: 'rgba(244, 63, 94, 0.3)',
      agent: 'rgba(139, 92, 246, 0.3)',
    };

    toast.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: ${colors[type]};
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid ${borderColors[type]};
      border-radius: 10px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: #e2e8f0;
      pointer-events: auto;
      animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      max-width: 380px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;

    toast.innerHTML = `<span style="font-size: 16px;">${icons[type]}</span><span>${message}</span>`;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s cubic-bezier(0.4, 0, 1, 1) forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}
