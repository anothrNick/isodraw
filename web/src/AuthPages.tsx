import { useEffect, useState } from 'react';
import { Loader2, MailCheck } from 'lucide-react';
import { ApiError, authApi } from './api';
import { Logo } from './App';
import { linkProps, navigate, type Route } from './router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * IsoDraw's own sign-in, sign-up, verification and password reset pages. They
 * run before there is a session, and talk to the JSON endpoints under /auth.
 * Every page keeps `?return=` so you land where you were going.
 */
export type AuthPage = 'login' | 'signup' | 'verify' | 'forgot' | 'reset';

// The password typed on sign-up or sign-in, kept in memory only, so the
// verify page can sign you in without asking for it again.
let pending: { email: string; password: string } | null = null;

function query() {
  const q = new URLSearchParams(location.search);
  const ret = q.get('return') ?? '/';
  // Only paths on this site; never "//elsewhere".
  return { email: q.get('email') ?? '', returnTo: ret.startsWith('/') && !ret.startsWith('//') ? ret : '/' };
}

/** A link to another auth page, carrying the email and the return path. */
function authPath(page: AuthPage, email?: string) {
  const { returnTo } = query();
  const q = new URLSearchParams();
  if (email) q.set('email', email);
  if (returnTo !== '/') q.set('return', returnTo);
  const s = q.toString();
  return `/${page}${s ? `?${s}` : ''}`;
}

function finish() {
  pending = null;
  // A full load, so the app starts with the new session.
  window.location.assign(query().returnTo);
}

export function AuthPages({ route }: { route: Extract<Route, { page: AuthPage }> }) {
  const [mode, setMode] = useState<'password' | 'redirect' | null>(null);
  useEffect(() => {
    authApi
      .config()
      .then(({ mode }) => {
        // An identity provider's own pages (Dex locally): go there instead.
        if (mode === 'redirect') window.location.replace(`/auth/login?return=${encodeURIComponent(query().returnTo)}`);
        else setMode(mode);
      })
      .catch(() => setMode('password'));
  }, []);
  if (mode !== 'password') {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }
  switch (route.page) {
    case 'login':
      return <LoginPage />;
    case 'signup':
      return <SignUpPage />;
    case 'verify':
      return <VerifyPage />;
    case 'forgot':
      return <ForgotPage />;
    case 'reset':
      return <ResetPage />;
  }
}

function Card({ title, description, children, footer }: { title: string; description?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <a className="mb-6 flex items-center gap-2 text-lg font-semibold" {...linkProps('/')}>
        <Logo />
        IsoDraw
      </a>
      <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        <div className="mt-5">{children}</div>
      </div>
      {footer && <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}

function Field({ label, aside, ...props }: { label: string; aside?: React.ReactNode } & React.ComponentProps<typeof Input>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between text-sm font-medium">
        {label}
        {aside}
      </span>
      <Input {...props} />
    </label>
  );
}

function TextLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <a className="font-medium text-primary underline-offset-4 hover:underline" {...linkProps(to)}>
      {children}
    </a>
  );
}

/** A form that shows its request's error and a busy button. */
function useSubmit(action: () => Promise<void>) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Try again in a moment.');
      setBusy(false);
    }
  };
  return { busy, error, setError, onSubmit };
}

function Submit({ busy, children }: { busy: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" className="mt-1 w-full" disabled={busy}>
      {busy && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}

function FormError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {error}
    </p>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return <p className="rounded-md border bg-muted/60 px-3 py-2 text-sm text-muted-foreground">{children}</p>;
}

const PASSWORD_HINT = 'At least 10 characters, with a number.';

function LoginPage() {
  const [email, setEmail] = useState(query().email);
  const [password, setPassword] = useState('');
  const notice = new URLSearchParams(location.search).get('notice');
  const { busy, error, onSubmit } = useSubmit(async () => {
    try {
      await authApi.signIn(email, password);
    } catch (err) {
      if (err instanceof ApiError && err.code === 'unverified') {
        pending = { email, password };
        navigate(authPath('verify', email));
        return;
      }
      throw err;
    }
    finish();
  });
  return (
    <Card
      title="Sign in"
      description="Welcome back. Sign in to your diagrams."
      footer={
        <>
          New to IsoDraw? <TextLink to={authPath('signup', email)}>Create an account</TextLink>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {notice === 'reset' && <Notice>Your password was changed. Sign in with the new one.</Notice>}
        {notice === 'verified' && <Notice>Your email is verified. Sign in to continue.</Notice>}
        <FormError error={error} />
        <Field label="Email" type="email" autoComplete="email" required autoFocus={!email} value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus={!!email}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aside={
            <a className="text-xs font-normal text-muted-foreground hover:text-foreground" {...linkProps(authPath('forgot', email))}>
              Forgot password?
            </a>
          }
        />
        <Submit busy={busy}>Sign in</Submit>
      </form>
    </Card>
  );
}

function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(query().email);
  const [password, setPassword] = useState('');
  const { busy, error, onSubmit } = useSubmit(async () => {
    await authApi.signUp(email, password, name);
    pending = { email, password };
    navigate(authPath('verify', email));
  });
  return (
    <Card
      title="Create your account"
      description="Draw systems as isometric diagrams, with docs alongside."
      footer={
        <>
          Already have an account? <TextLink to={authPath('login', email)}>Sign in</TextLink>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <FormError error={error} />
        <Field label="Name" autoComplete="name" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
        <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="flex flex-col gap-1.5">
          <Field label="Password" type="password" autoComplete="new-password" required minLength={10} value={password} onChange={(e) => setPassword(e.target.value)} />
          <span className="text-xs text-muted-foreground">{PASSWORD_HINT}</span>
        </div>
        <Submit busy={busy}>Create account</Submit>
      </form>
    </Card>
  );
}

function VerifyPage() {
  const email = query().email;
  const [code, setCode] = useState('');
  const [sent, setSent] = useState<string | null>(null);
  const { busy, error, setError, onSubmit } = useSubmit(async () => {
    await authApi.verify(email, code);
    if (pending?.email === email) {
      await authApi.signIn(pending.email, pending.password);
      finish();
    } else {
      navigate(`${authPath('login', email)}&notice=verified`);
    }
  });
  const resend = async () => {
    setError(null);
    try {
      const { sentTo } = await authApi.resend(email);
      setSent(sentTo || email);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send a new code.');
    }
  };
  if (!email) {
    navigate(authPath('login'), { replace: true });
    return null;
  }
  return (
    <Card
      title="Check your email"
      description={
        <>
          We sent a verification code to <span className="font-medium text-foreground">{email}</span>. Enter it to finish creating your account.
        </>
      }
      footer={
        <>
          Wrong address? <TextLink to={authPath('signup')}>Start over</TextLink>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {sent && (
          <Notice>
            <MailCheck className="mr-1.5 inline size-4 align-[-3px]" />A new code is on its way to {sent}.
          </Notice>
        )}
        <FormError error={error} />
        <Field
          label="Verification code"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\s/g, ''))}
          className="text-center font-mono text-lg tracking-[0.3em]"
        />
        <Submit busy={busy}>Verify email</Submit>
        <button type="button" className="text-sm text-muted-foreground hover:text-foreground" onClick={resend}>
          Didn't get it? Send a new code
        </button>
      </form>
    </Card>
  );
}

function ForgotPage() {
  const [email, setEmail] = useState(query().email);
  const { busy, error, onSubmit } = useSubmit(async () => {
    await authApi.forgot(email);
    navigate(authPath('reset', email));
  });
  return (
    <Card
      title="Reset your password"
      description="Enter your email and we'll send you a code to choose a new password."
      footer={
        <>
          Remembered it? <TextLink to={authPath('login', email)}>Sign in</TextLink>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <FormError error={error} />
        <Field label="Email" type="email" autoComplete="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
        <Submit busy={busy}>Send reset code</Submit>
      </form>
    </Card>
  );
}

function ResetPage() {
  const email = query().email;
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const { busy, error, onSubmit } = useSubmit(async () => {
    await authApi.reset(email, code, password);
    try {
      await authApi.signIn(email, password);
    } catch {
      navigate(`${authPath('login', email)}&notice=reset`);
      return;
    }
    finish();
  });
  if (!email) {
    navigate(authPath('forgot'), { replace: true });
    return null;
  }
  return (
    <Card
      title="Choose a new password"
      description={
        <>
          If there's an account for <span className="font-medium text-foreground">{email}</span>, we've emailed it a code.
        </>
      }
      footer={<TextLink to={authPath('forgot', email)}>Use a different email</TextLink>}
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <FormError error={error} />
        <Field
          label="Reset code"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\s/g, ''))}
          className="font-mono tracking-widest"
        />
        <div className="flex flex-col gap-1.5">
          <Field label="New password" type="password" autoComplete="new-password" required minLength={10} value={password} onChange={(e) => setPassword(e.target.value)} />
          <span className="text-xs text-muted-foreground">{PASSWORD_HINT}</span>
        </div>
        <Submit busy={busy}>Set password and sign in</Submit>
      </form>
    </Card>
  );
}
