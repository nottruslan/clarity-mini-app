import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import { clearAllStorageData } from './utils/storage';

// Делаем функцию очистки данных доступной через консоль
// Использование: window.clearClarityData()
declare global {
  interface Window {
    clearClarityData: () => Promise<void>;
  }
}

window.clearClarityData = clearAllStorageData;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

