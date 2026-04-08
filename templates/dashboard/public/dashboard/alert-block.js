/**
 * Editor.js custom alert block — loaded before inline editor boot.
 * Global: window.SnappostAlertBlock
 */
(function () {
  'use strict';

  window.SnappostAlertBlock = class SnappostAlertBlock {
    static get toolbox() {
      return { title: 'Alert Box', icon: '⚠️' };
    }

    constructor({ data }) {
      this.data = { text: data.text || 'Alert message...', type: data.type || 'info' };
      this.wrapper = null;
      this.span = null;
    }

    static get STYLES() {
      return {
        info: 'background:#dbeafe;border-left:4px solid #3b82f6',
        warning: 'background:#fef3c7;border-left:4px solid #f59e0b',
        success: 'background:#d1fae5;border-left:4px solid #10b981',
        error: 'background:#fee2e2;border-left:4px solid #ef4444',
      };
    }

    render() {
      this.wrapper = document.createElement('div');
      this._applyStyle();

      this.span = document.createElement('span');
      this.span.contentEditable = true;
      this.span.textContent = this.data.text;
      this.span.style.cssText = 'outline:none;display:block;min-height:1.5em';
      this.span.addEventListener('input', () => {
        this.data.text = this.span.textContent;
      });

      this.wrapper.appendChild(this.span);
      const announce = () => {
        document.dispatchEvent(new CustomEvent('alert-selected', { detail: this }));
      };
      this.wrapper.addEventListener('click', announce);
      this.wrapper.addEventListener('focusin', announce);

      return this.wrapper;
    }

    _applyStyle() {
      const s = SnappostAlertBlock.STYLES[this.data.type] || SnappostAlertBlock.STYLES.info;
      this.wrapper.setAttribute('style', s + ';padding:1rem;margin:0.25rem 0;border-radius:0.5rem;cursor:text');
    }

    setType(type) {
      this.data.type = type;
      this._applyStyle();
    }

    save() {
      return { text: this.data.text, type: this.data.type };
    }

    validate(d) {
      return d.text && d.text.trim().length > 0;
    }
  };
})();
