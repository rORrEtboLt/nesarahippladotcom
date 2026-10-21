import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import './styles/globals.css';

import Desktop from './pages/Desktop';
import Code from './pages/Code';
import WorkDetail from './pages/WorkDetail';
import About from './pages/About';
import AdminUpload from './pages/AdminUpload';
import EnchantressMarketing from './pages/EnchantressMarketing';
import EnchantressSupport from './pages/EnchantressSupport';
import EnchantressPrivacy from './pages/EnchantressPrivacy';

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
          <Route path="/" element={<Desktop />} />
          <Route path="/code" element={<Code />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminUpload />} />
          <Route path="/enchantress" element={<EnchantressMarketing />} />
          <Route path="/enchantress/support" element={<EnchantressSupport />} />
          <Route path="/enchantress/privacy" element={<EnchantressPrivacy />} />
          <Route path="*" element={<Desktop />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
