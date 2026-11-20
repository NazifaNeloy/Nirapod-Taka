import '@testing-library/jest-dom';

// JSDOM polyfill for scrollIntoView
window.HTMLElement.prototype.scrollIntoView = function() {};

// JSDOM polyfill for matchMedia
if (!window.matchMedia) {
  window.matchMedia = function(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function() {},
      removeListener: function() {},
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() { return false; },
    };
  };
}

// JSDOM polyfill for URL.createObjectURL
if (!window.URL.createObjectURL) {
  window.URL.createObjectURL = function() {
    return 'blob:mock-url';
  };
}
if (!window.URL.revokeObjectURL) {
  window.URL.revokeObjectURL = function() {};
}

// JSDOM polyfill for Blob.text and Blob.arrayBuffer
if (typeof Blob !== 'undefined') {
  if (!Blob.prototype.arrayBuffer) {
    Blob.prototype.arrayBuffer = function() {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(this);
      });
    };
  }
  if (!Blob.prototype.text) {
    Blob.prototype.text = function() {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(this);
      });
    };
  }
}

// In-memory Storage polyfill for test environments
class MockStorage {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] !== undefined ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}

const mockLocal = new MockStorage();
const mockSession = new MockStorage();

Object.defineProperty(window, 'localStorage', { value: mockLocal, writable: true });
Object.defineProperty(globalThis, 'localStorage', { value: mockLocal, writable: true });
Object.defineProperty(window, 'sessionStorage', { value: mockSession, writable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: mockSession, writable: true });
