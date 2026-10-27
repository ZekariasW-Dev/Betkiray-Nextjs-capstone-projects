import { Suspense } from 'react';
import { AuthForm } from '@/components/AuthForm';

export const metadata = { title: 'Sign in' };
export default function LoginPage() {
  return <Suspense fallback={<div className="auth-wait">Loading sign in…</div>}><AuthForm mode="login" /></Suspense>;
}
