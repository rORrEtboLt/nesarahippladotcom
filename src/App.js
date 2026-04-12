import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import './styles/globals.css';
import 'highlight.js/styles/github-dark.css';

import Home from './pages/Home';
import Flat from './pages/Flat';

function App() {
  return (
    <HelmetProvider>
      <Router>
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
