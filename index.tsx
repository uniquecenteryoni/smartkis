import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Warn if API key is missing, but still render the app
if (!process.env.API_KEY) {
  console.warn(
    '[smartkis] GEMINI_API_KEY is not set. AI-powered features will not work.\n' +
    'Create a .env file with GEMINI_API_KEY=your_key to enable them.'
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);