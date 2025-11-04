---
title: The {{% vendor/name %}} MCP Server
weight: -50
layout: single
description: The {{% vendor/name %}} Model Context Protocol (MCP) Server allows users to perform infrastructure operations, monitor environments, and manage resources using natural language commands and AI assistants.
newfeature: true
keywords:
    - AI
    - MCP
    - LLM
    - Claude
---
<!-- vale off -->
The {{% vendor/name %}} Model Context Protocol [(MCP) Server](https://devcenter.upsun.com/posts/upsun-mcp-announcement/) enables management of {{% vendor/name %}} projects and environments through AI assistants such as Claude. It supports conversational commands to create, modify, and monitor infrastructure without using the terminal or console.

![MCP projects](/images/AI/mcp-projects.png "0.65")

## Key capabilities

| Capability | Description | Use case                   |
|------------|-------------|-----------------------------|
| **Natural Language Infrastructure Management** | Converts user instructions written in natural language to corresponding API operations. | - “Show me all active environments in my project.” <br> - “Add Redis caching to my staging environment.” |
| **CI/CD Integration** | Integrates with existing development workflows and interacts with CI/CD pipelines to trigger or respond to automated workflows. | - Trigger deployments from the IDE. <br> - Monitor build progress from documentation tools or chat interfaces. |
| **AI-Based Automation** | Supports AI-driven automation that adapts to real-world conditions by analyzing metrics, historical data, and usage patterns. | - Resource allocation based on usage trends. <br> - Automated troubleshooting with suggested root causes. <br> - Adaptive backup scheduling. |

## Security Model

All MCP operations follow the existing {{% vendor/name %}} [security model](https://upsun.com/trust-center/security/). The MCP Server defaults to read-only operations for safety, with write operations available through explicit configuration.

To enable write operations, include the following header in your MCP configuration:

```json
{
  "enable-write": "true"
}
```

{{< note theme="warning" title="Security Implications">}}

Enable write operations **only** if you understand the associated security implications and trust your AI assistant to modify infrastructure resources.

{{< /note >}}

## Architecture

The {{% vendor/name %}} MCP Server uses [Streamable HTTP transport](https://modelcontextprotocol.io/docs/learn/architecture) for communication and event streaming.

It uses HTTP POST for client-to-server messages with optional Server-Sent Events for streaming capabilities. This transport enables remote server communication and supports standard HTTP authentication methods including bearer tokens, API keys, and custom headers.

## Installation

### 1. Generate an API Token

- In the {{% vendor/name %}} [Console](https://console.upsun.com/), open your account settings.
- Generate a new API token with permissions appropriate for your projects.

### 2. Configure the MCP Client
- Configure your MCP client to connect to `mcp.upsun.com/mcp`.

### 3. Connect and Use

- Connect your AI assistant or any MCP-compatible client.
- Begin managing {{% vendor/name %}} resources using natural language commands.

{{< note theme="info" title="Select your preferred client">}}

The {{% vendor/name %}} MCP server works with all major AI development environments. 

**Choose your preferred client from the list below:**

{{< /note >}}

<details>
<summary><b>Install in Cursor</b></summary>

Go to: `Settings` -> `Cursor Settings` -> `MCP` -> `Add new global MCP server`

Pasting the following configuration into your Cursor `~/.cursor/mcp.json` file is the recommended approach. You may also install in a specific project by creating `.cursor/mcp.json` in your project folder. 

See the [Cursor MCP docs](https://docs.cursor.com/context/model-context-protocol) for more info.

#### Cursor Remote Server Connection

```json
{
  "mcpServers": {
    "upsun": {
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

</details>

<details>
<summary><b>Install in Claude Code</b></summary>

Run this command. See [Claude Code MCP docs](https://docs.anthropic.com/en/docs/claude-code/mcp) for more info.

#### Claude Code Remote Server Connection

```sh
claude mcp add --transport http upsun https://mcp.upsun.com/mcp --header "upsun-api-token: YOUR_API_TOKEN" --header "enable-write: false"
```

</details>

<details>
<summary><b>Install in Windsurf</b></summary>

Add this to your Windsurf MCP config file. See [Windsurf MCP docs](https://docs.windsurf.com/windsurf/cascade/mcp) for more info.

#### Windsurf Remote Server Connection

```json
{
  "mcpServers": {
    "upsun": {
      "serverUrl": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

</details>

<details>
<summary><b>Install in VS Code</b></summary>

Add this to your VS Code MCP config file. See [VS Code MCP docs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for more info.

#### VS Code Remote Server Connection

```json
"mcp": {
  "servers": {
    "upsun": {
      "type": "http",
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

</details>

<details>
<summary>
<b>Install in Cline</b>
</summary>

You can easily configure the Upsun MCP server through Cline:

1. Open **Cline**.
2. Click the hamburger menu icon (☰) to enter the **MCP Servers** section.
3. Choose **Remote Servers** tab.
4. Click the **Edit Configuration** button.
5. Add upsun to `mcpServers`:

```json
{
  "mcpServers": {
    "upsun": {
      "url": "https://mcp.upsun.com/mcp",
      "type": "streamableHttp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

</details>

<details>
<summary><b>Install in Zed</b></summary>

Add this to your Zed `settings.json`. See [Zed Context Server docs](https://zed.dev/docs/assistant/context-servers) for more info.

```json
{
  "context_servers": {
    "Upsun": {
      "settings": {
        "url": "https://mcp.upsun.com/mcp",
        "headers": {
          "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
        }
      }
    }
  }
}
```

</details>

<details>
<summary><b>Install in Augment Code</b></summary>

To configure the Upsun MCP server in Augment Code:

**Manual Configuration**

1. Press Cmd/Ctrl Shift P or go to the hamburger menu in the Augment panel
2. Select Edit Settings
3. Under Advanced, click Edit in settings.json
4. Add the server configuration to the `mcpServers` array in the `augment.advanced` object

```json
"augment.advanced": {
  "mcpServers": [
    {
      "name": "upsun",
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  ]
}
```

Once the MCP server is added, restart your editor. If you receive any errors, check the syntax to make sure closing brackets or commas are not missing.

</details>

<details>
<summary><b>Install in Roo Code</b></summary>

Add this to your Roo Code MCP configuration file. See [Roo Code MCP docs](https://docs.roocode.com/features/mcp/using-mcp-in-roo) for more info.

#### Roo Code Remote Server Connection

```json
{
  "mcpServers": {
    "upsun": {
      "type": "streamable-http",
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

</details>

<details>
<summary><b>Install in Gemini CLI</b></summary>

See [Gemini CLI Configuration](https://google-gemini.github.io/gemini-cli/docs/tools/mcp-server.html) for details.

1.  Open the Gemini CLI settings file. The location is `~/.gemini/settings.json` (where `~` is your home directory).
2.  Add the following to the `mcpServers` object in your `settings.json` file:

```json
{
  "mcpServers": {
    "upsun": {
      "httpUrl": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false",
        "Accept": "application/json, text/event-stream"
      }
    }
  }
}
```

If the `mcpServers` object does not exist, create it.

</details>

<details>
<summary><b>Install in Claude Desktop</b></summary>

#### Remote Server Connection

Open Claude Desktop and navigate to Settings > Connectors > Add Custom Connector. Enter the name as `Upsun` and the remote MCP server URL as `https://mcp.upsun.com/mcp`.

Add your API token in the headers configuration:

```json
{
  "upsun-api-token": "YOUR_API_TOKEN",
    "enable-write": "false"
}
```

</details>

<details>
<summary><b>Install in Opencode</b></summary>

Add this to your Opencode configuration file. See [Opencode MCP docs](https://opencode.ai/docs/mcp-servers) for more info.

#### Opencode Remote Server Connection

```json
"mcp": {
  "upsun": {
    "type": "remote",
    "url": "https://mcp.upsun.com/mcp",
    "headers": {
      "upsun-api-token": "YOUR_API_TOKEN",
    "enable-write": "false"
    },
    "enabled": true
  }
}
```

</details>

<details>
<summary><b>Install in JetBrains AI Assistant</b></summary>

See [JetBrains AI Assistant Documentation](https://www.jetbrains.com/help/ai-assistant/configure-an-mcp-server.html) for more details.

1. In JetBrains IDEs, go to `Settings` -> `Tools` -> `AI Assistant` -> `Model Context Protocol (MCP)`
2. Click `+ Add`.
3. Click on `Command` in the top-left corner of the dialog and select the As JSON option from the list
4. Add this configuration and click `OK`

```json
{
  "mcpServers": {
    "upsun": {
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

5. Click `Apply` to save changes.
6. The same way upsun could be added for JetBrains Junie in `Settings` -> `Tools` -> `Junie` -> `MCP Settings`

</details>

<details>

<summary><b>Install in Kiro</b></summary>

See [Kiro Model Context Protocol Documentation](https://kiro.dev/docs/mcp/configuration/) for details.

1. Navigate `Kiro` > `MCP Servers`
2. Add a new MCP server by clicking the `+ Add` button.
3. Paste the configuration given below:

```json
{
  "mcpServers": {
    "Upsun": {
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

4. Click `Save` to apply the changes.

</details>

<details>
<summary><b>Install in Trae</b></summary>

Use the Add manually feature and fill in the JSON configuration information for that MCP server.
For more details, visit the [Trae documentation](https://docs.trae.ai/ide/model-context-protocol?_lang=en).

#### Trae Remote Server Connection

```json
{
  "mcpServers": {
    "upsun": {
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

</details>

<details>
<summary><b>Install in Amazon Q Developer CLI</b></summary>

Add this to your Amazon Q Developer CLI configuration file. See [Amazon Q Developer CLI docs](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line-mcp-configuration.html) for more details.

```json
{
  "mcpServers": {
    "upsun": {
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

</details>

<details>
<summary><b>Install in Warp</b></summary>

See [Warp Model Context Protocol Documentation](https://docs.warp.dev/knowledge-and-collaboration/mcp#adding-an-mcp-server) for details.

1. Navigate `Settings` > `AI` > `Manage MCP servers`.
2. Add a new MCP server by clicking the `+ Add` button.
3. Paste the configuration given below:

```json
{
  "Upsun": {
    "url": "https://mcp.upsun.com/mcp",
    "headers": {
      "upsun-api-token": "YOUR_API_TOKEN",
    "enable-write": "false"
    },
    "start_on_launch": true
  }
}
```

4. Click `Save` to apply the changes.

</details>

<details>

<summary><b>Install in Copilot Coding Agent</b></summary>

**Using Upsun MCP with Copilot Coding Agent**

Add the following configuration to the `mcp` section of your Copilot Coding Agent configuration file Repository->Settings->Copilot->Coding agent->MCP configuration:

```json
{
  "mcpServers": {
    "upsun": {
      "type": "http",
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

For more information, see the [official GitHub documentation](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/agents/copilot-coding-agent/extending-copilot-coding-agent-with-mcp).

</details>

<details>
<summary><b>Install in LM Studio</b></summary>

See [LM Studio MCP Support](https://lmstudio.ai/blog/lmstudio-v0.3.17) for more information.

#### Manual set-up:

1. Navigate to `Program` (right side) > `Install` > `Edit mcp.json`.
2. Paste the configuration given below:

```json
{
  "mcpServers": {
    "Upsun": {
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

3. Click `Save` to apply the changes.
4. Toggle the MCP server on/off from the right hand side, under `Program`, or by clicking the plug icon at the bottom of the chat box.

</details>

<details>
<summary><b>Install in Visual Studio 2022</b></summary>

You can configure the Upsun MCP server in Visual Studio 2022 by following the [Visual Studio MCP Servers documentation](https://learn.microsoft.com/visualstudio/ide/mcp-servers?view=vs-2022).

Add this to your Visual Studio MCP config file (see the [Visual Studio docs](https://learn.microsoft.com/visualstudio/ide/mcp-servers?view=vs-2022) for details):

```json
{
  "inputs": [],
  "servers": {
    "upsun": {
      "type": "http",
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

For more information and troubleshooting, refer to the [Visual Studio MCP Servers documentation](https://learn.microsoft.com/visualstudio/ide/mcp-servers?view=vs-2022).

</details>

<details>
<summary><b>Install in Crush</b></summary>

Add this to your Crush configuration file. See [Crush MCP docs](https://github.com/charmbracelet/crush#mcps) for more info.

#### Crush Remote Server Connection (HTTP)

```json
{
  "$schema": "https://charm.land/crush.json",
  "mcp": {
    "upsun": {
      "type": "http",
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

</details>

<details>
<summary><b>Install in BoltAI</b></summary>

Open the "Settings" page of the app, navigate to "Plugins," and configure the Upsun MCP server:

```json
{
  "mcpServers": {
    "upsun": {
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

More information is available on [BoltAI's Documentation site](https://docs.boltai.com/docs/plugins/mcp-servers). For BoltAI on iOS, [see this guide](https://docs.boltai.com/docs/boltai-mobile/mcp-servers).

</details>

<details>
<summary><b>Install in Rovo Dev CLI</b></summary>

Edit your Rovo Dev CLI MCP config by running the command below -

```bash
acli rovodev mcp
```

Example config -

#### Remote Server Connection

```json
{
  "mcpServers": {
    "upsun": {
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

</details>

<details>
<summary><b>Install in Zencoder</b></summary>

To configure the Upsun MCP server in Zencoder, follow these steps:

1. Go to the Zencoder menu (...)
2. From the dropdown menu, select Agent tools
3. Click on the Add custom MCP
4. Add the name and server configuration from below, and make sure to hit the Install button

```json
{
  "url": "https://mcp.upsun.com/mcp",
  "headers": {
    "upsun-api-token": "YOUR_API_TOKEN",
    "enable-write": "false"
  }
}
```

Once the MCP server is added, you can easily continue using it.

</details>

<details>
<summary><b>Install in Qodo Gen</b></summary>

See [Qodo Gen docs](https://docs.qodo.ai/qodo-documentation/qodo-gen/qodo-gen-chat/agentic-mode/agentic-tools-mcps) for more details.

1. Open Qodo Gen chat panel in VSCode or IntelliJ.
2. Click Connect more tools.
3. Click + Add new MCP.
4. Add the following configuration:

#### Qodo Gen Remote Server Connection

```json
{
  "mcpServers": {
    "upsun": {
      "url": "https://mcp.upsun.com/mcp",
      "headers": {
        "upsun-api-token": "YOUR_API_TOKEN",
        "enable-write": "false"
      }
    }
  }
}
```

</details>

<details>
<summary><b>Install in Perplexity Desktop</b></summary>

See [Local and Remote MCPs for Perplexity](https://www.perplexity.ai/help-center/en/articles/11502712-local-and-remote-mcps-for-perplexity) for more information.

1. Navigate `Perplexity` > `Settings`
2. Select `Connectors`.
3. Click `Add Connector`.
4. Select `Advanced`.
5. Enter Server Name: `Upsun`
6. Paste the following JSON in the text area:

```json
{
  "url": "https://mcp.upsun.com/mcp",
  "headers": {
    "upsun-api-token": "YOUR_API_TOKEN",
    "enable-write": "false"
  }
}
```

7. Click `Save`.
</details>

## Related content

### {{% vendor/name %}} AI tutorials

- {{% vendor/name %}} [AI and Machine Learning tutorials](https://devcenter.upsun.com/posts/ai/?utm_source=docs&utm_medium=ai-agent&utm_campaign=tutorials)
- [Experiment with Chainlit AI interface with RAG](https://devcenter.upsun.com/posts/deploying-chainlit-with-rag/) on {{% vendor/name %}}
- [Access {{% vendor/name %}} Documentation contextually via Context7 + MCP](https://devcenter.upsun.com/posts/context7-mcp/)
- Use the {{% vendor/name %}} API to [automate Agent deployment](https://devcenter.upsun.com/posts/using-the-upsun-api/)
- {{% vendor/name %}} [MCP Server Announcement](https://devcenter.upsun.com/posts/upsun-mcp-announcement/)

### {{% vendor/name %}} AI documentation

- [Host AI Agents](/get-started/ai/aiagent.html) on {{% vendor/name %}}
- [Deploy AI](/get-started/ai.html) on {{% vendor/name %}}
<!-- vale on -->