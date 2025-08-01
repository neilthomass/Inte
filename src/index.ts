import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE_URL =
  "https://raw.githubusercontent.com/neiltthomas/inte/main/snippets";

// Create server instance
const server = new McpServer({
  name: "inte",
  version: "1.0.0",
  capabilities: {
    resources: ["listVendors", "getSnippet"],
    tools: {},
  },
});

async function fetchMetadata(): Promise<unknown[]> {
  const url = `${BASE_URL}/metadata.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

server.tool(
  "listVendors",
  "List available snippet vendors",
  async () => {
    try {
      const vendors = await fetchMetadata();
      return {
        content: [
          { type: "text", text: JSON.stringify(vendors, null, 2) },
        ],
      };
    } catch (err) {
      return {
        content: [
          { type: "text", text: `Failed to list vendors: ${(err as Error).message}` },
        ],
      };
    }
  }
);

server.tool(
  "getSnippet",
  "Get snippet markdown for a vendor",
  { vendorName: z.string().describe("Vendor slug") },
  async ({ vendorName }) => {
    try {
      const res = await fetch(`${BASE_URL}/${vendorName}/snippet.md`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.text();
      return { content: [{ type: "text", text: data }] };
    } catch (err) {
      return {
        content: [
          { type: "text", text: `Failed to read snippet for ${vendorName}: ${(err as Error).message}` },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Inti MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error in main():", err);
  process.exit(1);
});
