import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import './styles/globals.css';

import ProjectGrid from './pages/ProjectGrid';
import WorkDetail from './pages/WorkDetail';
import About from './pages/About';

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
          <Route path="/" element={<ProjectGrid />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<ProjectGrid />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
