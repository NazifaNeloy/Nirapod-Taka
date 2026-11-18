import '@testing-library/jest-dom';

// JSDOM polyfill for scrollIntoView
window.HTMLElement.prototype.scrollIntoView = function() {};

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
