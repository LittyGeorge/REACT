import { useState } from 'react';
import { isAxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { demoAccounts } from '../api/demoAccounts';
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema';
import { useLogin } from '../hooks/useLogin';
import { useAuthStore } from '../../../stores/authStore';
import { dashboardPathForRole } from '../../../lib/permissions';

export function LoginPage() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (!isHydrated) return <main className="session-loading"><span className="loading-mark">N</span><span className="loading-copy">Preparing secure sign in…</span></main>;
  if (token && user) return <Navigate to={dashboardPathForRole(user.role)} replace />;

  async function onSubmit(values: LoginFormValues) {
    try {
      const session = await login.mutateAsync(values);
      navigate(dashboardPathForRole(session.user.role), { replace: true });
    } catch {
      // The form presents a concise, user-safe message below.
    }
  }

  const errorMessage = login.isError
    ? isAxiosError(login.error) && login.error.response?.status === 401
      ? 'That email and password combination wasn’t recognized.'
      : 'We couldn’t connect to the service. Check your connection and try again.'
    : null;

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-heading">
        <div className="login-brand"><span className="brand-mark">N</span><span>northstar<span>operations</span></span></div>
        <div className="login-intro">
          <p className="eyebrow"><span className="eyebrow-line" /> SERVICE OPERATIONS PLATFORM</p>
          <h1 id="login-heading">Good work starts with a clear view.</h1>
          <p>Sign in to manage your service workspace.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="field-label" htmlFor="email">Work email</label>
          <input id="email" type="email" autoComplete="username" placeholder="you@company.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} {...register('email')} />
          {errors.email && <span className="field-error" id="email-error">{errors.email.message}</span>}

          <div className="password-label-row"><label className="field-label" htmlFor="password">Password</label><span className="password-hint">Use your workspace credentials</span></div>
          <div className="password-input-wrap">
            <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} {...register('password')} />
            <button className="show-password" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          {errors.password && <span className="field-error" id="password-error">{errors.password.message}</span>}
          {errorMessage && <div className="login-error" role="alert"><span aria-hidden="true">!</span>{errorMessage}</div>}

          <button className="sign-in-button" type="submit" disabled={isSubmitting || login.isPending}>
            {login.isPending ? <><span className="button-spinner" />Signing in…</> : <>Sign in <span aria-hidden="true">→</span></>}
          </button>
        </form>

        {import.meta.env.VITE_USE_MOCK_API !== 'false' && (
          <section className="demo-access" aria-labelledby="demo-heading">
            <div className="demo-heading-row"><span className="demo-dot" /><div><h2 id="demo-heading">Demo workspace access</h2><p>Choose a sample role or enter its credentials.</p></div></div>
            <div className="demo-account-list">
              {demoAccounts.map((account) => (
                <button className="demo-account" type="button" key={account.user.id} onClick={() => {
                  setValue('email', account.email, { shouldValidate: true });
                  setValue('password', account.password, { shouldValidate: true });
                  login.reset();
                }}>
                  <span className="demo-account-icon">{account.label.slice(0, 1)}</span>
                  <span><strong>{account.label}</strong><small>{account.email}</small></span>
                  <span className="demo-use">Use <span aria-hidden="true">↗</span></span>
                </button>
              ))}
            </div>
            <p className="demo-footnote">Demo mode uses local sample accounts. It is not a production identity service.</p>
          </section>
        )}
        <footer className="login-footer"><span>© 2026 Northstar Operations</span><span>Secure workspace sign-in</span></footer>
      </section>

      <aside className="login-aside" aria-label="Platform overview">
        <div className="aside-decoration" aria-hidden="true"><span className="aside-orbit" /><span className="aside-orbit orbit-tilt" /><span className="aside-core">N</span><span className="aside-star">✳</span></div>
        <div className="aside-copy"><p className="eyebrow">ONE CONNECTED WORKSPACE</p><h2>From first request to final payment.</h2><p>Keep customer relationships, branch teams and service work moving together.</p></div>
        <div className="aside-bottom"><span className="aside-line" /><span>Built for the people who keep things running.</span></div>
      </aside>
    </main>
  );
}
