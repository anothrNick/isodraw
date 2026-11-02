import { useEffect, useState } from 'react';
import { ArrowRight, Bot, Box, Check, FileCode2, FileText, Layers, Link2, Minus, Monitor, Moon, Scale, Server, Sun, Users } from 'lucide-react';
import { StaticDiagram, ThemeContext } from 'isodraw';
import type { Example } from 'isodraw-templates';
import { Logo } from './App';
import { linkProps } from './router';
import { setThemeSetting, useTheme } from './theme';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * What a signed-out visitor sees at "/": what IsoDraw is, a live diagram drawn
 * by the library itself, and the plans. Every other page still sends them to sign in.
 */

const GITHUB_URL = 'https://github.com/anothrNick/isodraw';

/** GitHub's mark (lucide has no brand icons). */
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

// The templates carry docs and a Terraform sample, so they load after the page shows.
const loadTemplates = () => import('isodraw-templates').then((m) => m.EXAMPLES);

const FEATURES = [
  {
    icon: Box,
    title: 'Isometric or flat, one click apart',
    body: 'Draw in a clean 2D grid, then flip to a 2.5D isometric view for the slide deck. Same diagram, no redraw.',
  },
  {
    icon: FileText,
    title: 'Docs on every component',
    body: 'Each box, area and connection has its own Markdown page. Publish the whole thing as a readable site.',
  },
  {
    icon: Layers,
    title: 'Detail diagrams, as deep as you like',
    body: 'Drill into a service to draw its insides. The overview stays tidy and the detail is one click away.',
  },
  {
    icon: Bot,
    title: 'Built for AI agents',
    body: 'Connect Claude, ChatGPT or Cursor over MCP, or use the CLI. Agents read and update diagrams and the platform does the layout.',
  },
  {
    icon: FileCode2,
    title: 'Import from Terraform',
    body: 'Turn a state file into a laid-out diagram with AWS, Google Cloud and Azure icons, grouped by VPC and subnet.',
  },
  {
    icon: Link2,
    title: 'Pictures that travel',
    body: 'Signed PNG and SVG links that show the diagram as it is now, for READMEs, chat threads and pull requests.',
  },
];

export function LandingPage() {
  const { resolved } = useTheme();
  return (
    <div className="h-full overflow-y-auto bg-background">
      <Nav />
      <ThemeContext.Provider value={resolved}>
        <Hero />
      </ThemeContext.Provider>
      <Features />
      <AgentSection />
      <OpenSource />
      <Pricing />
      <Faq />
      <Footer />
    </div>
  );
}

function Nav() {
  const { setting } = useTheme();
  const next = setting === 'light' ? 'dark' : setting === 'dark' ? 'system' : 'light';
  const ThemeIcon = setting === 'dark' ? Moon : setting === 'light' ? Sun : Monitor;
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
        <a className="flex items-center gap-2 font-semibold" {...linkProps('/')}>
          <Logo />
          IsoDraw
        </a>
        <nav className="ml-6 hidden items-center gap-1 text-muted-foreground sm:flex">
          <a href="#features" className="rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-foreground">
            Features
          </a>
          <a href="#agents" className="rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-foreground">
            AI agents
          </a>
          <a href="#pricing" className="rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-foreground">
            Pricing
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <Button asChild variant="ghost" size="icon-sm">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="IsoDraw on GitHub" title="IsoDraw on GitHub">
              <GitHubIcon className="size-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={`Theme: ${setting}`} title={`Theme: ${setting}`} onClick={() => setThemeSetting(next)}>
            <ThemeIcon />
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a {...linkProps('/login')}>Sign in</a>
          </Button>
          <Button asChild size="sm">
            <a {...linkProps('/signup')}>Get started</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const [examples, setExamples] = useState<Example[] | null>(null);
  const [choice, setChoice] = useState(0);
  const [view, setView] = useState<'2d' | '3d'>('3d');
  useEffect(() => {
    loadTemplates().then(setExamples, () => setExamples([]));
  }, []);
  const shown = examples?.slice(0, 4) ?? [];
  const example = shown[choice];

  return (
    <section className="relative overflow-hidden border-b">
      {/* A faint isometric grid behind the hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] dark:opacity-[0.25]"
        style={{
          backgroundImage:
            'linear-gradient(30deg, var(--border) 1px, transparent 1px), linear-gradient(150deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 23px',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" />
            Founding lifetime access is open
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Architecture diagrams that <span className="text-primary">explain themselves</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
            Draw your system in isometric or flat views, write docs on every component, and let your AI agents keep it all up to date.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a {...linkProps('/signup')}>
                Start drawing free
                <ArrowRight />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#agents">Connect your AI</a>
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Free for personal use. No card needed.{' '}
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-foreground hover:underline">
              Open source on GitHub
            </a>
            .
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-xl border bg-card shadow-xl shadow-primary/5">
          <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
            </div>
            <div className="ml-2 flex min-w-0 flex-1 gap-1 overflow-x-auto" role="tablist" aria-label="Example diagrams">
              {shown.map((ex, i) => (
                <button
                  key={ex.id}
                  role="tab"
                  aria-selected={i === choice}
                  onClick={() => setChoice(i)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs whitespace-nowrap text-muted-foreground hover:bg-accent hover:text-foreground',
                    i === choice && 'bg-accent font-medium text-foreground',
                  )}
                >
                  {ex.name}
                </button>
              ))}
            </div>
            <div className="flex rounded-md border p-0.5 text-xs" role="group" aria-label="View">
              {(['2d', '3d'] as const).map((v) => (
                <button
                  key={v}
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn('rounded px-2 py-0.5 text-muted-foreground', view === v && 'bg-primary text-primary-foreground')}
                >
                  {v === '2d' ? 'Flat' : 'Isometric'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex aspect-[16/9] items-center justify-center bg-muted/30 p-4 sm:p-8">
            {example ? (
              <StaticDiagram key={example.id} diagram={example.diagram} view={view} maxHeight="100%" className="h-full" label={example.name} />
            ) : (
              <div className="h-full w-full animate-pulse rounded-lg bg-muted" />
            )}
          </div>
          {example && <p className="border-t px-4 py-2.5 text-xs text-muted-foreground">{example.description}</p>}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {body && <p className="mt-4 text-base text-pretty text-muted-foreground">{body}</p>}
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="scroll-mt-14 border-b py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Features"
          title="More than boxes and arrows"
          body="A diagram in IsoDraw is the map of your system and the documentation for it, in one place your whole team can read."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="size-4.5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm/6 text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentSection() {
  const mcpUrl = `${location.origin}/mcp`;
  return (
    <section id="agents" className="scroll-mt-14 border-b bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-primary">AI agents</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">Your agent draws. IsoDraw keeps it tidy.</h2>
          <p className="mt-4 text-base text-pretty text-muted-foreground">
            Add IsoDraw as a connector in Claude, ChatGPT or Cursor and ask for what you want. Agents add components, connections and docs; the
            platform places and lays them out, so diagrams built by AI still look drawn by hand.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm">
            {[
              'Remote MCP server with OAuth: pick a workspace, read-only or read-and-write, and an expiry',
              'A CLI with JSON output and stable exit codes, for scripts and CI',
              'Every change ends with a preview picture, so chat shows what changed',
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <Check className="mt-0.5 size-4 flex-none text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-xl border bg-card font-mono text-[13px] shadow-sm">
          <div className="border-b px-4 py-2 font-sans text-xs text-muted-foreground">Settings → Connectors → Add custom connector</div>
          <div className="space-y-4 p-4">
            <div className="rounded-md border bg-muted/50 px-3 py-2 break-all">{mcpUrl}</div>
            <div className="space-y-3 font-sans text-sm">
              <div className="ml-auto w-fit max-w-[85%] rounded-lg bg-primary px-3 py-2 text-primary-foreground">
                Add a Redis cache in front of the orders database and document why.
              </div>
              <div className="w-fit max-w-[85%] rounded-lg bg-muted px-3 py-2">
                Added <b>Orders cache</b> (ElastiCache) between <b>Order service</b> and <b>Orders DB</b>, with a doc on the read-through pattern
                and TTLs.
              </div>
            </div>
            <div className="text-muted-foreground">
              <span className="text-primary">$</span> npx isodraw describe "Payments service"
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OpenSource() {
  const points = [
    { icon: Scale, title: 'AGPL-3.0', body: 'The editor, the API, the CLI and the MCP server, all under one license.' },
    { icon: Server, title: 'Self-host it', body: 'Postgres, a Go API and a static web app. Run it on your own machines with your own sign-in.' },
    { icon: GitHubIcon, title: 'Read and contribute', body: 'Issues and pull requests welcome. See how your diagrams are stored before you trust us with them.' },
  ];
  return (
    <section id="open-source" className="scroll-mt-14 border-b py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Open source"
          title="Yours to read, run and change"
          body="IsoDraw is open source. Use the hosted version to skip the setup, or run it yourself."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {points.map((p) => (
            <div key={p.title} className="rounded-xl border bg-card p-6">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <p.icon className="size-4.5" />
              </div>
              <h3 className="mt-4 font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm/6 text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <GitHubIcon className="size-4" />
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

type Row = { label: string; free: boolean | string; lifetime: boolean | string };
const PLAN_ROWS: Row[] = [
  { label: 'Every editor feature, 2D and isometric', free: true, lifetime: true },
  { label: 'Docs, detail diagrams, published views', free: true, lifetime: true },
  { label: 'MCP and CLI, reads and writes', free: true, lifetime: true },
  { label: 'Diagrams in your personal workspace', free: 'Up to 10', lifetime: 'Unlimited' },
  { label: 'Team workspaces', free: false, lifetime: '5 editors each, unlimited viewers' },
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <Check className="size-4 text-primary" aria-label="Included" />;
  if (v === false) return <Minus className="size-4 text-muted-foreground/60" aria-label="Not included" />;
  return <span>{v}</span>;
}

function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-14 border-b py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <SectionHeading
          eyebrow="Pricing"
          title="Free for you. Pay once for your team."
          body="Nothing is held back from the free plan. Founding lifetime access adds teams, for a one-time price, for the first 100 buyers."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <PlanCard
            name="Personal"
            price="Free"
            note="forever"
            pitch="Everything, in your own workspace."
            cta={{ label: 'Start drawing', to: '/signup', variant: 'outline' }}
            plan="free"
          />
          <PlanCard
            name="Founding lifetime"
            price="$99"
            note="one time"
            pitch="Teams, and no limits on your personal workspace."
            cta={{ label: 'Get lifetime access', to: '/signup?return=%2Fsettings%2Fplan', variant: 'default' }}
            plan="lifetime"
            featured
          />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Lifetime doesn't include metered AI features that run on our bill, enterprise features (SSO, audit logs, teams over 5 editors) or storage
          beyond fair use. 30-day refunds, no questions.
        </p>
      </div>
    </section>
  );
}

function PlanCard({
  name,
  price,
  note,
  pitch,
  cta,
  plan,
  featured,
}: {
  name: string;
  price: string;
  note: string;
  pitch: string;
  cta: { label: string; to: string; variant: 'default' | 'outline' };
  plan: 'free' | 'lifetime';
  featured?: boolean;
}) {
  return (
    <div className={cn('relative flex flex-col rounded-xl border bg-card p-6 sm:p-8', featured && 'border-primary shadow-lg shadow-primary/10')}>
      {featured && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
          <Users className="size-3" />
          100 seats only
        </span>
      )}
      <h3 className="font-semibold">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{pitch}</p>
      <p className="mt-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold tracking-tight">{price}</span>
        <span className="text-sm text-muted-foreground">{note}</span>
      </p>
      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {PLAN_ROWS.map((r) => (
          <li key={r.label} className="flex items-start justify-between gap-4 border-b pb-3 last:border-0">
            <span className="text-muted-foreground">{r.label}</span>
            <span className="flex-none text-right font-medium">
              <Cell v={r[plan]} />
            </span>
          </li>
        ))}
      </ul>
      <Button asChild variant={cta.variant} className="mt-6 w-full">
        <a {...linkProps(cta.to)}>{cta.label}</a>
      </Button>
    </div>
  );
}

const FAQ = [
  {
    q: 'Is IsoDraw open source?',
    a: 'Yes, under the AGPL-3.0. You can self-host it for free; paying for lifetime access supports the hosted version and its development.',
  },
  {
    q: 'What does "lifetime" mean?',
    a: 'You pay once, with no subscription, and keep team workspaces and an unlimited personal workspace from then on.',
  },
  {
    q: 'Do my teammates need to buy too?',
    a: 'No. Each team you create has room for you and four more editors, plus as many viewers as you like. Only you buy.',
  },
  {
    q: 'What happens at 10 diagrams on the free plan?',
    a: "Creating an 11th is refused, with a note on exporting and deleting one. Nothing you've drawn is ever locked or deleted.",
  },
  {
    q: 'Can I get a refund?',
    a: 'Within 30 days, no questions. A refund ends team access, and your personal workspace goes back to the free limits.',
  },
];

function Faq() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <div className="mt-12 divide-y rounded-xl border bg-card">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {f.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm/6 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Draw your first diagram in a minute</h2>
          <p className="mt-2 text-muted-foreground">Start from a documented template, or ask your agent to draw it for you.</p>
          <Button asChild size="lg" className="mt-6">
            <a {...linkProps('/signup')}>
              Get started free
              <ArrowRight />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-8 text-sm text-muted-foreground">
        <span className="flex items-center gap-2 font-medium text-foreground">
          <Logo size={18} />
          IsoDraw
        </span>
        <span>© {new Date().getFullYear()} · AGPL-3.0</span>
        <div className="ml-auto flex gap-4">
          <a href="#pricing" className="hover:text-foreground">
            Pricing
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
            <GitHubIcon className="size-3.5" />
            GitHub
          </a>
          <a className="hover:text-foreground" {...linkProps('/login')}>
            Sign in
          </a>
        </div>
      </div>
    </footer>
  );
}
