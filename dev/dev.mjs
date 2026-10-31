// npm run dev: start Postgres and Dex, then run the API (live reload) and the
// web app (Vite) together. Ctrl+C stops both; the containers keep running.
import { spawn, execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const envFile = join(root, '.env');
if (!existsSync(envFile)) {
  copyFileSync(join(root, '.env.example'), envFile);
  console.log('Created .env from .env.example');
}
const env = { ...process.env };
for (const line of readFileSync(envFile, 'utf8').split('\n')) {
  const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
  if (m && !(m[1] in process.env)) env[m[1]] = m[2];
}

execFileSync('docker', ['compose', 'up', '-d', '--wait'], { cwd: root, stdio: 'inherit' });

const colors = { api: 32, web: 35 };
const procs = [];
function run(name, cmd, args, cwd) {
  const p = spawn(cmd, args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
  const tag = `\x1b[${colors[name]}m${name.padEnd(3)}\x1b[0m │ `;
  for (const stream of [p.stdout, p.stderr]) {
    let rest = '';
    stream.on('data', (chunk) => {
      const lines = (rest + chunk).split('\n');
      rest = lines.pop();
      for (const l of lines) process.stdout.write(tag + l + '\n');
    });
  }
  p.on('exit', (code) => {
    console.log(`${tag}exited (${code ?? 'signal'})`);
    stop(code ?? 1);
  });
  procs.push(p);
}

let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const p of procs) if (p.exitCode === null) p.kill('SIGINT');
  setTimeout(() => process.exit(code), 500);
}
process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));

run('api', 'go', ['run', 'github.com/air-verse/air@v1.61.7', '-c', '.air.toml'], join(root, 'api'));
run('web', 'npm', ['run', 'dev', '-w', 'isodraw-web'], root);
console.log('\nOpen http://localhost:5190 and sign in as dev@isodraw.local / password\n');
