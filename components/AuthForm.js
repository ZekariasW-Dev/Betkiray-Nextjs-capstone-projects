'use client';

import { useSearchParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { Eye, EyeOff, House, LockKeyhole } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export function AuthForm({ mode }) {
  const isSignup = mode === 'signup';
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore(state => state.login);
  const register = useAuthStore(state => state.register);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    role: ['OWNER', 'landlord'].includes(searchParams.get('role')) ? 'landlord' : 'tenant'
  });
  const next = searchParams.get('next') || '';

  function destination(user) {
    const safePath = next.startsWith('/') && !next.startsWith('//') ? next : '';
    if (user?.role === 'landlord') return safePath.startsWith('/owner-dashboard') ? safePath : '/owner-dashboard';
    return safePath.startsWith('/owner-dashboard') ? '/' : safePath || '/';
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = isSignup
        ? await register(values.name, values.email, values.password, values.role)
        : await login(values.email, values.password);
      router.replace(destination(user));
    } catch (cause) {
      setError(cause.message || 'We could not complete the request. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return <div className="auth-page"><section className="auth-card surface">
    <div className="auth-brand"><span className="brand-mark"><House size={19} /></span><span>BetKiray<span className="brand-ethiopia"> Ethiopia</span></span></div>
    <span className="eyebrow">{isSignup ? 'Join BetKiray' : 'Welcome back'}</span>
    <h1>{isSignup ? 'Create your account' : 'Sign in to BetKiray'}</h1>
    <p>{isSignup ? 'Save homes and explore the owner workspace.' : 'Sign in to continue to your BetKiray account.'}</p>
    {error && <div className="auth-error" role="alert">{error}</div>}
    <form onSubmit={submit} className="auth-form">
      {isSignup && <label className="form-field"><span>Your name</span><input className="form-control" autoComplete="name" value={values.name} onChange={event => setValues({ ...values, name: event.target.value })} required minLength={2} maxLength={80} /></label>}
      <label className="form-field"><span>Email address</span><input className="form-control" type="email" autoComplete="email" value={values.email} onChange={event => setValues({ ...values, email: event.target.value })} required maxLength={254} /></label>
      <label className="form-field"><span>Password</span><div className="password-input"><LockKeyhole size={16} /><input className="form-control" type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} value={values.password} onChange={event => setValues({ ...values, password: event.target.value })} required minLength={isSignup ? 8 : 1} maxLength={128} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>{isSignup && <small>Use at least 8 characters.</small>}</label>
      {isSignup && <fieldset className="role-choice">
        <legend>Choose your account type</legend>
        <label className={values.role === 'landlord' ? 'role-choice-option selected' : 'role-choice-option'}>
          <input type="radio" name="role" value="landlord" checked={values.role === 'landlord'} onChange={() => setValues({ ...values, role: 'landlord' })} />
          <span><strong>I am a Landlord</strong><small>አከራይ · List and manage homes</small></span>
        </label>
        <label className={values.role === 'tenant' ? 'role-choice-option selected' : 'role-choice-option'}>
          <input type="radio" name="role" value="tenant" checked={values.role === 'tenant'} onChange={() => setValues({ ...values, role: 'tenant' })} />
          <span><strong>I am a Tenant</strong><small>ተከራይ · Find and save homes</small></span>
        </label>
      </fieldset>}
      <button className="btn btn-primary auth-submit" type="submit" disabled={busy}>{busy ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}</button>
    </form>
    <div className="auth-switch">{isSignup ? <>Already have an account? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ''}`}>Sign in</Link></> : <>New to BetKiray? <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ''}`}>Create an account</Link></>}</div>
  </section></div>;
}
