import React, { useState } from 'react';
import profile from '../../content/profile.json';

export default function ContactPanel() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please share your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email please.';
    if (form.message.trim().length < 10) e.message = 'A bit more to go on?';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('bad status');
      setStatus('sent');
    } catch {
      // Fall back to mailto so the user still has a route
      const subject = encodeURIComponent(`Hi from ${form.name}`);
      const body = encodeURIComponent(form.message + `\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus('sent');
    }
  };

  if (status === 'sent') {
    return (
      <div className="contact-sent">
        <h3>Letter sent! 📮</h3>
        <p>
          Thanks for reaching out. I read every message and will reply as soon
          as I can.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <label>
        <span>Name</span>
        <input
          type="text"
          value={form.name}
          onChange={update('name')}
          aria-invalid={!!errors.name}
          autoComplete="name"
        />
        {errors.name && <small className="err">{errors.name}</small>}
      </label>
      <label>
        <span>Email</span>
        <input
          type="email"
          value={form.email}
          onChange={update('email')}
          aria-invalid={!!errors.email}
          autoComplete="email"
        />
        {errors.email && <small className="err">{errors.email}</small>}
      </label>
      <label>
        <span>Message</span>
        <textarea
          rows={5}
          value={form.message}
          onChange={update('message')}
          aria-invalid={!!errors.message}
        />
        {errors.message && <small className="err">{errors.message}</small>}
      </label>
      <button
        type="submit"
        className="btn"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending…' : 'Drop in the mailbox'}
      </button>
      <p className="muted small">
        Prefer email? Write to{' '}
        <a href={`mailto:${profile.email}`}>{profile.email}</a>.
      </p>
    </form>
  );
}
