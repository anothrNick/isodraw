import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

/**
 * Where the CLI finds the server and its token. ISODRAW_SERVER and
 * ISODRAW_TOKEN win over the saved config, so agents and CI need no files.
 */
export interface Config {
  server: string;
  token?: string;
}

/** Until the hosted app exists, the default is the local dev stack (npm run dev). */
export const DEFAULT_SERVER = 'http://localhost:5190';

export function configPath(): string {
  const base = process.env.XDG_CONFIG_HOME || join(homedir(), '.config');
  return join(base, 'isodraw', 'config.json');
}

function readSaved(): Partial<Config> {
  try {
    return JSON.parse(readFileSync(configPath(), 'utf8')) as Partial<Config>;
  } catch {
    return {};
  }
}

export function loadConfig(overrides: { server?: string } = {}): Config {
  const saved = readSaved();
  return {
    server: (overrides.server || process.env.ISODRAW_SERVER || saved.server || DEFAULT_SERVER).replace(/\/+$/, ''),
    token: process.env.ISODRAW_TOKEN || saved.token,
  };
}

/** Save the server and token, readable only by this user. */
export function saveConfig(c: Config) {
  const p = configPath();
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify({ server: c.server, token: c.token }, null, 2) + '\n', { mode: 0o600 });
  chmodSync(p, 0o600);
}

export function clearConfig() {
  if (existsSync(configPath())) rmSync(configPath());
}
