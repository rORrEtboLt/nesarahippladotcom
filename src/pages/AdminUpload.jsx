import React, { useState, useRef, useCallback } from 'react';
import projects from '../content/projects.json';

const REPO_OWNER = 'rORrEtboLt';
const REPO_NAME = 'nesarahippladotcom';
const BRANCH = 'master';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isLocalPath(url) {
  return url && url.startsWith('/images/');
}

function publicPath(url) {
  return `public${url}`;
}

function buildSlots() {
  const slots = [];
  for (const project of projects) {
    if (project.images) {
      for (const img of project.images) {
        const url = typeof img === 'string' ? img : img.url;
        if (isLocalPath(url)) {
          slots.push({
            project: project.name,
            label: typeof img === 'string' ? url.split('/').pop() : img.caption,
            path: publicPath(url),
            type: 'image',
          });
        }
      }
    }
    if (project.videos) {
      for (const vid of project.videos) {
        if (isLocalPath(vid.src)) {
          slots.push({
            project: project.name,
            label: vid.caption,
            path: publicPath(vid.src),
            type: 'video',
          });
        }
      }
    }
  }
  return slots;
}

function SlotCard({ slot, token }) {
  const [status, setStatus] = useState('idle');
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFile = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file || !token) return;

    setStatus('uploading');

    try {
      if (slot.type === 'image') {
        setPreview(URL.createObjectURL(file));
      }

      const base64 = await fileToBase64(file);

      // Check for existing file SHA (needed for updates)
      let sha;
      try {
        const check = await fetch(
          `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${slot.path}?ref=${BRANCH}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (check.ok) sha = (await check.json()).sha;
      } catch {}

      const body = {
        message: `Upload media: ${slot.path.split('/').pop()}`,
        content: base64,
        branch: BRANCH,
      };
      if (sha) body.sha = sha;

      const res = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${slot.path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Upload failed');
      }

      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setPreview(null);
    }
  }, [slot, token]);

  const accept = slot.type === 'video' ? 'video/*' : 'image/*';
  const filename = slot.path.split('/').pop();

  return (
    <div
      className={`upload-slot upload-slot--${status}`}
      onClick={() => token && status !== 'uploading' && inputRef.current?.click()}
      role="button"
      tabIndex={0}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        style={{ display: 'none' }}
      />

      {preview ? (
        <img src={preview} alt={slot.label} className="upload-slot-preview" />
      ) : (
        <div className="upload-slot-icon">
          {status === 'idle' && (slot.type === 'video' ? '🎬' : '📷')}
          {status === 'uploading' && <span className="upload-spinner" />}
          {status === 'done' && '✓'}
          {status === 'error' && '✗'}
        </div>
      )}

      <div className="upload-slot-info">
        <span className="upload-slot-label">{slot.label}</span>
        <span className="upload-slot-filename">{filename}</span>
      </div>
    </div>
  );
}

export default function AdminUpload() {
  const [token, setToken] = useState(() => localStorage.getItem('gh_token') || '');
  const [tokenSaved, setTokenSaved] = useState(!!localStorage.getItem('gh_token'));

  const saveToken = () => {
    localStorage.setItem('gh_token', token);
    setTokenSaved(true);
  };

  const clearToken = () => {
    localStorage.removeItem('gh_token');
    setToken('');
    setTokenSaved(false);
  };

  const slotsByProject = buildSlots().reduce((acc, slot) => {
    (acc[slot.project] = acc[slot.project] || []).push(slot);
    return acc;
  }, {});

  return (
    <div className="admin-page">
      <div className="admin-inner">
        <h1 className="admin-title">Media Upload</h1>

        <div className="admin-token-section">
          {tokenSaved ? (
            <div className="admin-token-saved">
              <span>GitHub token saved</span>
              <button className="admin-token-clear" onClick={clearToken}>Clear</button>
            </div>
          ) : (
            <>
              <p className="admin-token-hint">
                Paste a GitHub fine-grained token with <strong>Contents: Read & Write</strong> for this repo.{' '}
                <a
                  href="https://github.com/settings/personal-access-tokens/new"
                  target="_blank"
                  rel="noreferrer"
                >
                  Create one here →
                </a>
              </p>
              <div className="admin-token-row">
                <input
                  className="admin-token-input"
                  type="password"
                  placeholder="github_pat_..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                <button
                  className="admin-token-save"
                  onClick={saveToken}
                  disabled={!token}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>

        {Object.entries(slotsByProject).map(([project, slots]) => (
          <section key={project} className="admin-project-section">
            <h2 className="admin-project-name">{project}</h2>
            <div className="admin-slots">
              {slots.map((slot) => (
                <SlotCard key={slot.path} slot={slot} token={token} />
              ))}
            </div>
          </section>
        ))}

        {!tokenSaved && (
          <p className="admin-locked-note">Enter your token above to enable uploads.</p>
        )}
      </div>
    </div>
  );
}
