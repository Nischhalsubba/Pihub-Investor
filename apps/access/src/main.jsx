import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../../packages/ui/src/platform.css';
import '../../../packages/ui/src/containment.css';
import './styles.css';
import '../../../packages/ui/src/investor-design-system.css';
import App from './App';
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);