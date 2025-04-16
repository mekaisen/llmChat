import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import ThemeProvider from './utils/Context/Theme/ThemeProvider.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultProfile='dark'>
    <App />
  </ThemeProvider>

);
