/**
 * React 앱 엔트리 포인트
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 모든 <img> src에서 http:// → https:// 자동 변환 (Mixed Content 방지)
const _srcDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
Object.defineProperty(HTMLImageElement.prototype, 'src', {
  get() { return _srcDesc.get.call(this); },
  set(v) { _srcDesc.set.call(this, typeof v === 'string' && v.startsWith('http://') ? v.replace('http://', 'https://') : v); },
  configurable: true, enumerable: true,
});

// 이미지 로드 실패 시 기본 placeholder로 대체 (404 방지)
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG' && !e.target.dataset.fallback) {
    e.target.dataset.fallback = 'true';
    e.target.src = 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#e2e8f0" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="#94a3b8" font-size="10">No Image</text></svg>'
    );
  }
}, true);

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
