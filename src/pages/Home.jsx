import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Experience from '../three/Experience';
import HUD from '../overlays/HUD';
import Panel from '../overlays/Panel';
import LoadingScreen from '../overlays/LoadingScreen';
import useReducedMotion from '../hooks/useReducedMotion';
import { useNavigate } from 'react-router-dom';
import profile from '../content/profile.json';

export default function Home() {
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();

  useEffect(() => {
    if (reducedMotion) navigate('/flat', { replace: true });
  }, [reducedMotion, navigate]);

  if (reducedMotion) return null;

  return (
    <>
      <Helmet>
        <title>{profile.name} — interactive portfolio</title>
        <meta name="description" content={profile.tagline} />
        <meta property="og:title" content={profile.name} />
        <meta property="og:description" content={profile.tagline} />
      </Helmet>
      <div className="experience-root">
        <Experience />
        <HUD />
        <Panel />
        <LoadingScreen />
      </div>
    </>
  );
}
