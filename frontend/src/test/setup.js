import '@testing-library/jest-dom';

// JSDOM polyfill for scrollIntoView
window.HTMLElement.prototype.scrollIntoView = function() {};
