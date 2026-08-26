import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../../packages/ui/src/investor-base.css';
import './styles.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>,
);
