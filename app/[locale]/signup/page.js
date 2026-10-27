import { Suspense } from 'react';
import { AuthForm } from '@/components/AuthForm';

export const metadata = { title: 'Create an account' };
export default function SignupPage() {
  return <Suspense fallback={<div className="auth-wait">Loading sign up…</div>}><AuthForm mode="signup" /></Suspense>;
}
