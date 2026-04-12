import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import './styles/globals.css';
import 'highlight.js/styles/github-dark.css';

import Home from './pages/Home';
import Flat from './pages/Flat';

// Strip trailing slash so basename works when PUBLIC_URL is a full or
// relative path. Falls back to "/" so local dev keeps working.
function getBasename() {
  const url = process.env.PUBLIC_URL || '';
  try {
    const path = new URL(url, window.location.origin).pathname.replace(/\/$/, '');
    return path || '/';
  } catch {
    return '/';
  }
}

function App() {
  return (
    <HelmetProvider>
      <Router basename={getBasename()}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flat" element={<Flat />} />
          <Route path="/flat/*" element={<Flat />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
