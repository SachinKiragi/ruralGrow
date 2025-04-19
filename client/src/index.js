import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { EmailProvider } from './context/EmailContext';

ReactDOM.render(
  <React.StrictMode>
    <EmailProvider>
        <App />
    </EmailProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
