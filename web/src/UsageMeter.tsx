import { Check } from 'lucide-react';
import { linkProps, navigate } from './router';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/** At most this many tiles; with a bigger limit each one stands for a share of it. */
const MAX_TILES = 12;

/**
 * How full a free personal workspace is: a row of isometric tiles that fill
 * up, which opens what the plan includes. It only asks for attention, in
 * amber, when there's little room left.
 */
export function UsageMeter({ used, limit, lifetime }: { used: number; limit: number; lifetime: boolean }) {
  const left = Math.max(limit - used, 0);
  const full = left === 0;
  const near = !full && left <= Math.max(1, Math.ceil(limit * 0.2));
  const tiles = Math.min(limit, MAX_TILES);
  // Any use shows, and the last tile only fills when there's no room left.
  const filled = full ? tiles : used === 0 ? 0 : Math.min(Math.max(Math.round((used / limit) * tiles), 1), tiles - 1);
  const urgent = full || near;
  return (
    <div className="flex translate-y-px items-center gap-3 text-xs whitespace-nowrap text-muted-foreground">
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`${used} of ${limit} diagrams used. Show what the free plan includes.`}
          className="-mx-1.5 inline-flex items-center gap-2.5 rounded-md px-1.5 py-1 transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span aria-hidden className="flex items-center gap-[3px] pl-0.5">
            {Array.from({ length: tiles }, (_, i) => (
              <span
                key={i}
                className={cn(
                  'h-3 w-1.5 -skew-x-[30deg] rounded-[1.5px] transition-colors',
                  i >= filled ? 'bg-foreground/10' : urgent ? 'bg-amber-500' : 'bg-primary/70',
                )}
              />
            ))}
          </span>
          <span className={cn('tabular-nums', urgent && 'text-amber-700 dark:text-amber-400')}>
            {used} of {limit}
            {full ? ' · Full' : near ? ` · ${left} left` : ''}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">Free plan</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground">
              {[`Up to ${limit} ${limit === 1 ? 'diagram' : 'diagrams'}`, 'Every feature included', 'The CLI and MCP for AI apps'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-3.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            {full && (
              <p className="mt-3 rounded-md bg-amber-500/10 px-2 py-1.5 text-xs text-amber-800 dark:text-amber-300">
                To make room, download one as JSON and delete it. You can import it again any time.
              </p>
            )}
          </div>
          <DropdownMenuSeparator />
          <p className="px-2 py-1 text-xs text-muted-foreground">A Pro workspace has no limit, and you can move these diagrams into it.</p>
          <DropdownMenuItem onSelect={() => navigate('/settings/plan')}>Compare plans</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <a className={cn('font-medium transition-colors', urgent ? 'text-primary hover:underline' : 'hover:text-foreground')} {...linkProps('/settings/plan')}>
        {lifetime ? 'Pro workspace' : 'Get Pro'}
      </a>
    </div>
  );
}
