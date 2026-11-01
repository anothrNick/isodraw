import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { Client } from './client';
import { createMcpServer } from './mcp';

/** `isodraw mcp`: serve the tools over stdio for apps that launch local servers. Nothing else may write to stdout. */
export async function serveStdio(client: Client): Promise<void> {
  await createMcpServer(client).connect(new StdioServerTransport());
}
