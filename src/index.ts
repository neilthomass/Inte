import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

// Resolve path relative to the built file location so the CLI works
// no matter the current working directory.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SNIPPETS_DIR = path.resolve(__dirname, "../snippets");

// Create server instance
const server = new McpServer({
  name: "inti",
  version: "1.0.0",
  capabilities: {
    resources: ["listVendors", "getSnippet"],
    tools: {},
  },
});

async function readMetadata(dir: string) {
  try {
    const data = await fs.readFile(path.join(dir, "metadata.json"), "utf8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

server.tool(
  "listVendors",
  "List available snippet vendors",
  async () => {
    const vendors: unknown[] = [];
    try {
      const vendorsDirs = await fs.readdir(SNIPPETS_DIR, { withFileTypes: true });
      for (const vendor of vendorsDirs) {
        if (!vendor.isDirectory()) continue;
        const langDirs = await fs.readdir(path.join(SNIPPETS_DIR, vendor.name), { withFileTypes: true });
        for (const lang of langDirs) {
          if (!lang.isDirectory()) continue;
          const meta = await readMetadata(path.join(SNIPPETS_DIR, vendor.name, lang.name));
          if (meta) vendors.push(meta);
        }
      }
    } catch (err) {
      return {
        content: [
          { type: "text", text: `Failed to list vendors: ${(err as Error).message}` },
        ],
      };
    }
    return {
      content: [
        { type: "text", text: JSON.stringify(vendors, null, 2) },
      ],
    };
  }
);

server.tool(
  "getSnippet",
  "Get snippet markdown for a vendor",
  { vendorName: z.string().describe("Vendor and language slug") },
  async ({ vendorName }) => {
    const snippetPath = path.join(SNIPPETS_DIR, vendorName, "snippet.md");
    try {
      const data = await fs.readFile(snippetPath, "utf8");
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
