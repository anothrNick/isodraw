import { useEffect, useState } from 'react';
import { ArrowRight, Bot, Box, Check, FileCode2, FileText, Layers, Link2, Monitor, Moon, MousePointer2, Scale, Server, Sun, Users } from 'lucide-react';
import { IsoDocView, StaticDiagram, ThemeContext, docOf, hasDoc, titleOf, type DocTarget } from 'isodraw';
import type { Example } from 'isodraw-templates';
import { Logo } from './App';
import { Glow, IsoGrid } from './AuthScene';
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
        <nav className="ml-4 hidden items-center gap-0.5 whitespace-nowrap text-muted-foreground md:flex lg:ml-6 lg:gap-1">
          <a href="#features" className="rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-foreground">
            Features
          </a>
          <a href="#agents" className="rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-foreground">
            AI agents
          </a>
          <a href="#pricing" className="rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-foreground">
            Pricing
          </a>
          <a {...linkProps('/playground')} className="rounded-md px-2.5 py-1.5 hover:bg-accent hover:text-foreground">
            Playground
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
          {/* Where the nav links don't fit, the Playground keeps its place up here. */}
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex md:hidden">
            <a {...linkProps('/playground')}>Playground</a>
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
  // The docs sidebar: the diagram's overview, or the doc of the component clicked.
  const [page, setPage] = useState<DocTarget>({ kind: 'diagram' });
  const [focus, setFocus] = useState<DocTarget | null>(null);
  const { resolved } = useTheme();
  useEffect(() => {
    loadTemplates().then(setExamples, () => setExamples([]));
  }, []);
  const shown = examples?.slice(0, 4) ?? [];
  const example = shown[choice];
  const pick = (i: number) => {
    setChoice(i);
    setPage({ kind: 'diagram' });
  };

  return (
    <section className="relative overflow-hidden border-b">
      {/* The same isometric grid and glow as the sign-in pages. */}
      <Glow />
      <IsoGrid />
      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" />
            Founding lifetime: 100 seats, pay once
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Architecture diagrams that <span className="text-primary">explain themselves</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
            Draw your system in isometric or flat views, write docs on every component, and let your AI agents keep it all up to date.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a {...linkProps('/playground')}>
                <MousePointer2 />
                Try the Playground
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a {...linkProps('/signup')}>
                Sign up free
                <ArrowRight />
              </a>
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            The Playground needs no sign-up: it runs in your browser, with import and export. Free accounts for personal use, no card needed.{' '}
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
                  onClick={() => pick(i)}
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
          <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="flex min-w-0 flex-col">
              <div className="flex aspect-[16/9] items-center justify-center bg-muted/30 p-4 sm:p-8 lg:aspect-auto lg:h-[480px]">
                {example ? (
                  <StaticDiagram
                    key={example.id}
                    diagram={example.diagram}
                    view={view}
                    maxHeight="100%"
                    className="h-full"
                    label={example.name}
                    highlight={page.kind === 'node' ? page.id : undefined}
                    focus={focus}
                    onNodeClick={(id) => setPage({ kind: 'node', id })}
                  />
                ) : (
                  <div className="h-full w-full animate-pulse rounded-lg bg-muted" />
                )}
              </div>
              {example && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t px-4 py-2.5 text-xs text-muted-foreground">
                  <p className="min-w-0 flex-1">
                    {example.description} <span className="text-foreground/70">Click a component to read its docs.</span>
                  </p>
                  <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                    <a {...linkProps(`/playground?example=${encodeURIComponent(example.id)}`)}>
                      Open in Playground
                      <ArrowRight />
                    </a>
                  </Button>
                </div>
              )}
            </div>
            {example && <DocsSidebar diagram={example.diagram} page={page} onPage={setPage} onFocus={setFocus} theme={resolved} />}
          </div>
        </div>
      </div>
    </section>
  );
}

/** The hero demo's docs: one page at a time, like the Docs tab and the published site. */
function DocsSidebar({
  diagram,
  page,
  onPage,
  onFocus,
  theme,
}: {
  diagram: Example['diagram'];
  page: DocTarget;
  onPage: (t: DocTarget) => void;
  onFocus: (t: DocTarget | null) => void;
  theme: 'light' | 'dark';
}) {
  const md = docOf(page, diagram);
  const title = page.kind === 'diagram' ? 'Overview' : titleOf(page, diagram);
  // Many docs open with their own heading; don't show two.
  const ownHeading = /^\s*#{1,3}\s/.test(md);
  return (
    <aside className="flex max-h-[420px] min-w-0 flex-col border-t bg-card lg:max-h-[528px] lg:border-t-0 lg:border-l">
      <div className="flex items-center gap-2 border-b px-4 py-2.5">
        <FileText className="size-4 text-primary" aria-hidden />
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Docs</span>
        {page.kind !== 'diagram' && (
          <button type="button" onClick={() => onPage({ kind: 'diagram' })} className="ml-auto text-xs text-muted-foreground hover:text-foreground">
            ← Overview
          </button>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {!ownHeading && <h3 className="mb-3 text-base font-semibold">{title}</h3>}
        {hasDoc(md) ? (
          <IsoDocView
            key={`${page.kind}:${'id' in page ? page.id : ''}`}
            markdown={md}
            diagram={diagram}
            theme={theme}
            onNavigate={(t) => {
              onFocus(null);
              onPage(t);
            }}
            onMentionHover={onFocus}
          />
        ) : (
          <p className="text-sm text-muted-foreground">No doc for this one yet. In the editor, every component, area and connection can have one.</p>
        )}
      </div>
    </aside>
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

type Plan = {
  name: string;
  price: string;
  note: string;
  later?: string;
  pitch: string;
  items: string[];
  cta?: { label: string; to: string; variant: 'default' | 'outline' };
  badge?: string;
  soon?: boolean;
  /** Another way to pay for the same plan, behind a toggle on its card. */
  alternative?: { toggle: [string, string]; price: string; note: string; later: string; soon: boolean };
};

const PLANS: Plan[] = [
  {
    name: 'Personal',
    price: 'Free',
    note: 'forever',
    pitch: 'Every feature, in your own workspace.',
    items: ['2D and isometric editor', 'Docs, detail diagrams, published views', 'MCP and CLI, reads and writes', 'Up to 10 diagrams'],
    cta: { label: 'Start drawing', to: '/signup', variant: 'outline' },
  },
  {
    name: 'Pro',
    price: '$99',
    note: 'once',
    later: 'Pay once, keep Pro for good',
    pitch: 'A shared workspace for a small team.',
    items: ['Everything in Personal', 'Unlimited diagrams', 'Up to 4 people, any role', 'Shared image library'],
    cta: { label: 'Get lifetime access', to: '/signup?return=%2Fsettings%2Fplan', variant: 'default' },
    badge: '100 founding seats',
    alternative: { toggle: ['Lifetime', 'Monthly'], price: '$8', note: '/month', later: 'After the founding seats, or billed yearly at $80', soon: true },
  },
  {
    name: 'Team',
    price: '$49',
    note: '/month',
    pitch: 'One price for the whole team, however big.',
    items: ['Everything in Pro', 'Unlimited people', 'Version history and GitHub sync, as they ship', 'Private published docs'],
    soon: true,
  },
  {
    name: 'Business',
    price: '$199',
    note: '/month',
    pitch: 'For companies with sign-in and compliance needs.',
    items: ['Everything in Team', 'SSO / SAML', 'Audit log', 'Priority support and a signed agreement'],
    soon: true,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-14 border-b py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Pricing"
          title="One price per workspace. Never per seat."
          body="Your personal workspace is free, with every feature. Shared workspaces have one flat price per plan: Pro covers up to 4 people and Team has no limit, so adding a teammate never costs extra."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <PlanCard key={p.name} plan={p} />
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Plans don't include metered AI features that run on our bill, or storage beyond fair use. Move or copy diagrams between workspaces any time.
          30-day refunds on lifetime, no questions.
        </p>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const [alt, setAlt] = useState(false);
  // The toggle swaps the price and how it's bought; what the plan includes stays.
  const p: Plan = alt && plan.alternative ? { ...plan, ...plan.alternative, badge: undefined, cta: undefined } : plan;
  const featured = !!plan.badge;
  return (
    <div className={cn('relative flex flex-col rounded-xl border bg-card p-6', featured && 'border-primary shadow-lg shadow-primary/10', p.soon && 'bg-card/60')}>
      {p.badge && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
          <Users className="size-3" />
          {p.badge}
        </span>
      )}
      <h3 className="flex items-center gap-2 font-semibold">
        {p.name}
        {/* With a toggle there's no room; the button says it instead. */}
        {p.soon && !plan.alternative && <span className="rounded-full border px-2 py-0.5 text-[11px] font-normal text-muted-foreground">Coming soon</span>}
        {plan.alternative && (
          <span role="radiogroup" aria-label={`${plan.name} billing`} className="ml-auto inline-flex rounded-md border p-0.5 text-[11px] font-normal">
            {plan.alternative.toggle.map((label, i) => (
              <button
                key={label}
                type="button"
                role="radio"
                aria-checked={alt === (i === 1)}
                onClick={() => setAlt(i === 1)}
                className={cn('rounded px-1.5 py-0.5 text-muted-foreground', alt === (i === 1) && 'bg-primary text-primary-foreground')}
              >
                {label}
              </button>
            ))}
          </span>
        )}
      </h3>
      <p className="mt-1 min-h-10 text-sm text-muted-foreground">{p.pitch}</p>
      <p className="mt-5 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold tracking-tight">{p.price}</span>
        <span className="text-sm text-muted-foreground">{p.note}</span>
      </p>
      <p className="mt-1 min-h-4 text-xs text-muted-foreground">{p.later}</p>
      <ul className="mt-5 flex-1 space-y-2.5 text-sm">
        {p.items.map((i) => (
          <li key={i} className="flex gap-2">
            <Check className="mt-0.5 size-4 flex-none text-primary" aria-hidden />
            {i}
          </li>
        ))}
      </ul>
      {p.cta ? (
        <Button asChild variant={p.cta.variant} className="mt-6 w-full">
          <a {...linkProps(p.cta.to)}>{p.cta.label}</a>
        </Button>
      ) : (
        <Button variant="outline" className="mt-6 w-full" disabled>
          Coming soon
        </Button>
      )}
    </div>
  );
}

const FAQ = [
  {
    q: 'Is IsoDraw open source?',
    a: 'Yes, under the AGPL-3.0. You can self-host it for free; paying for the hosted version supports it and its development.',
  },
  {
    q: 'Why per workspace and not per seat?',
    a: "Because diagrams are for sharing. Each plan has one flat price for the whole workspace (Pro for up to 4 people, Team for any number), so you never have to decide whether a teammate is worth a seat.",
  },
  {
    q: 'What does founding lifetime mean?',
    a: 'The first 100 buyers pay once instead of monthly and keep Pro for good: unlimited diagrams and a shared workspace for up to 4 people.',
  },
  {
    q: 'What happens at 10 diagrams on the free plan?',
    a: "Creating an 11th is refused, with a note on exporting and deleting one, or moving it to a paid workspace. Nothing you've drawn is ever locked or deleted.",
  },
  {
    q: 'When are Team and Business coming?',
    a: 'Soon after the founding seats. Founding members can move their diagrams into a Team workspace whenever they outgrow 4 people.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Within 30 days of buying lifetime access, no questions. Your diagrams stay; the workspace goes back to the free limits.',
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
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a {...linkProps('/signup')}>
                Get started free
                <ArrowRight />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a {...linkProps('/playground')}>
                <MousePointer2 />
                Try the Playground first
              </a>
            </Button>
          </div>
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
