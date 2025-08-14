---
title: Hosting Model Context Protocal (MCP) Servers
weight: -40
---

**Model Context Protocol (MCP)** is a standard interface that allows large
language models (LLMs) to communicate with external tools and data sources.
With MCP, developers and tool providers integrate once and ensure
interoperability across any MCP-compatible system.

For comprehensive information about the Model Context Protocol, including
specifications, examples, and implementation details, we recomend you visit the
[official MCP documentation](https://modelcontextprotocol.io/) maintained by Anthropic.

## Get started with MCP on Upsun

- **[Build and deploy AI-native applications with MCP servers on Upsun](https://devcenter.upsun.com/posts/tutorials/?utm_source=chatgpt.com)**  
  Learn how to build and deploy AI-native applications by leveraging MCP servers
  hosted on Upsun.

## Why Connect LLMs to External Systems?

LLMs typically lack direct access to real-time or system-specific data. To
provide current, relevant responses—such as live configuration settings or API
data—LLMs need to connect with external systems.

Every service offers a different API, schema, and authentication. Without a
standard, managing multiple integrations becomes complex, brittle, and
error-prone.

## Standardizing LLM interactions with MCP

MCP standardizes how LLMs interact with external services. Developers create a
single MCP integration point that can interface with any MCP-compatible provider.

Similarly, tool and data providers only need to expose their service via an MCP
interface once—making it accessible to any MCP-enabled application.

Think of MCP as the **USB-C of LLM integration**—one interface that works
uniformly across devices.

## MCP Hosts, Clients, and Servers

MCP operates on a client–server model:

- **MCP Host**: The AI application environment (e.g., your IDE, ChatGPT-like
  interface, or AI agent).

- **MCP Client**: The connection created by the host to talk to a service.

- **MCP Server**: The external service that exposes an MCP interface.

To connect to multiple external services, a single host needs to manage multiple
MCP clients, each connecting to a different MCP server.

## Additional Resources

- **[Deep Dive into MCP's Interaction Model](https://devcenter.upsun.com/posts/mcp-interaction-types-article/?utm_source=chatgpt.com)**  
  Explore MCP's three core interaction types—*prompts* (user-driven),
  *resources* (application-driven), and *tools* (model-driven)—to design more
  powerful and flexible AI workflows.

## Summary Table

| Concept | Upsun Article (Link) |
|---------|----------------------|
| Accessing Docs | [Access Upsun documentation via Context7 using MCP](https://devcenter.upsun.com/posts/context7-mcp/?utm_source=chatgpt.com) |
| Deploying MCP | [Build and deploy AI-native applications with MCP servers on Upsun](https://devcenter.upsun.com/posts/tutorials/?utm_source=chatgpt.com) |
| MCP Interaction | [Beyond Tool Calling: Understanding MCP's Three Core Interaction Types](https://devcenter.upsun.com/posts/mcp-interaction-types-article/?utm_source=chatgpt.com) |

---
