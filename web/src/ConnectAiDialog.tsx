import { useState } from 'react';
import { Check, Copy, Sparkles } from 'lucide-react';
import { navigate } from './router';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

/**
 * How to add IsoDraw's MCP server to an AI app: Claude (web and desktop),
 * Claude Code, Cursor, or anything else that speaks remote MCP. Connecting
 * signs in here and asks for a workspace and access (see ConnectPage).
 */

type App = 'claude' | 'code' | 'cursor' | 'other';

const APPS: [App, string][] = [
  ['claude', 'Claude'],
  ['code', 'Claude Code'],
  ['cursor', 'Cursor'],
  ['other', 'Other apps'],
];

export function ConnectAiDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [app, setApp] = useState<App>('claude');
  const url = `${location.origin}/mcp`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Connect IsoDraw to Claude</DialogTitle>
          <DialogDescription>
            Add IsoDraw as a connector, then ask for diagrams in chat. The agent adds components, connections and docs; IsoDraw lays them out.
          </DialogDescription>
        </DialogHeader>

        <div role="tablist" aria-label="App" className="inline-flex h-9 w-fit max-w-full items-center overflow-x-auto rounded-md bg-muted p-0.5">
          {APPS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={app === id}
              onClick={() => setApp(id)}
              className={cn(
                'h-full flex-none rounded px-3 text-sm font-medium transition-colors',
                app === id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="min-w-0 text-sm">
          {app === 'claude' && (
            <Steps>
              <li>
                In Claude (claude.ai or the desktop app), open <b>Settings → Connectors</b> and choose <b>Add custom connector</b>.
              </li>
              <li>
                Name it <b>IsoDraw</b> and paste this URL:
                <CopyLine text={url} />
              </li>
              <li>
                Click <b>Connect</b>. You'll come back here to pick a workspace and whether Claude can change diagrams or only read them.
              </li>
              <li>
                In a chat, make sure IsoDraw is on in the tools menu, then ask away.
              </li>
            </Steps>
          )}
          {app === 'claude' && (
            <p className="mt-3 text-muted-foreground">On a Claude Team or Enterprise plan, an owner may need to add the connector for the organization first.</p>
          )}
          {app === 'code' && (
            <Steps>
              <li>
                Add the server:
                <CopyLine text={`claude mcp add --transport http isodraw ${url}`} />
              </li>
              <li>
                In Claude Code, run <Code>/mcp</Code>, pick <b>isodraw</b> and authenticate. Your browser opens here to choose a workspace and access.
              </li>
            </Steps>
          )}
          {app === 'cursor' && (
            <Steps>
              <li>
                Open <b>Cursor Settings → MCP</b> and add a new server, or add this to <Code>~/.cursor/mcp.json</Code>:
                <CopyLine text={JSON.stringify({ mcpServers: { isodraw: { url } } }, null, 2)} block />
              </li>
              <li>Cursor shows IsoDraw as needing sign-in: click it, then choose a workspace and access here.</li>
            </Steps>
          )}
          {app === 'other' && (
            <Steps>
              <li>
                Any app that supports remote MCP servers with OAuth can connect. Use this URL:
                <CopyLine text={url} />
              </li>
              <li>
                Apps without OAuth can use an{' '}
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/settings/tokens');
                  }}
                >
                  API token
                </button>{' '}
                as a bearer token instead.
              </li>
            </Steps>
          )}
        </div>

        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">
          <p className="mb-1 flex items-center gap-1.5 font-medium">
            <Sparkles className="size-4 text-primary" />
            Try asking
          </p>
          <p className="text-muted-foreground">
            "Draw our checkout flow in IsoDraw: web app, API, payments service and Postgres, with a doc on each part." Or "Make a sequence diagram of
            how sign-in works."
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="flex list-decimal flex-col gap-3 pl-5 marker:text-muted-foreground">{children}</ol>;
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted px-1 py-0.5 text-xs">{children}</code>;
}

function CopyLine({ text, block }: { text: string; block?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-2 flex items-start gap-2">
      <pre className={cn('min-w-0 flex-1 rounded-md border bg-muted/50 px-3 py-2 font-mono text-xs', block ? 'overflow-x-auto' : 'break-all whitespace-pre-wrap')}>
        {text}
      </pre>
      <Button
        variant="outline"
        size="sm"
        className="flex-none"
        onClick={async () => {
          await navigator.clipboard.writeText(text).catch(() => undefined);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check /> : <Copy />}
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  );
}
