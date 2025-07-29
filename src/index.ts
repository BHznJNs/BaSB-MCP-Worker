import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { setTargetEndpoint, mcpServerFactory } from "basb-mcp";

export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "BaSB-MCP",
		version: "1.0.0",
	});

	async init(): Promise<void> {
		this.server = mcpServerFactory()
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		setTargetEndpoint(env.TARGET_ENDPOINT);

		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;
