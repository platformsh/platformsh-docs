---
title: How to deploy AI
weight: -50
layout: single

---

{{% vendor/name %}} provides powerful capabilities for hosting AI applications,
agents, and services. You can deploy AI workloads using any supported runtime
and integrate with various LLM APIs and services.

{{< note theme="info" >}}
Before you start, check out the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project)
and the main [Getting started guide](/get-started/here/_index.md).
They provide all the core concepts and common commands you need to know before
using the following materials.
{{< /note >}}

## AI applications and services

- [**AI Agents**](aiagent.md) - Host conversational AI agents
and chatbots using any
supported runtime
- [**MCP Servers**](deploy-mcp.md) - Deploy Model Context Protocol servers for
AI tool integration
- [**{{% vendor/name %}} MCP Server**](using-the-mcp.md) - Use the {{% vendor/name %}} Model Context Protocel Server
- **Vector Databases** - [Chroma](add-services/chroma.md), [Qdrant](add-services/qdrant.md)

## Supported technologies

- **Runtimes**: Python, Node.js, PHP, Ruby, Go, Java, and
[supported runtime types](/create-apps/app-reference/single-runtime-image.md#types)
- **LLM APIs**: [OpenAI](https://platform.openai.com/docs),
[Anthropic Claude](https://docs.anthropic.com/en/docs/getting-started-with-the-api),
[Google Gemini](https://ai.google.dev/docs),
[Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/),
[AWS Bedrock](https://docs.aws.amazon.com/bedrock/),
and any other HTTP-based API service
- **AI Frameworks**: [LangChain](https://python.langchain.com/docs/get_started/introduction),
[LlamaIndex](https://docs.llamaindex.ai/), [Chainlit](https://docs.chainlit.io/),
and custom implementations
- **Integration**: REST APIs, WebSockets, and event-driven architectures

{{< note theme="info" title="API flexibility" >}}
Upsun supports integration with **any** LLM service that provides an HTTP API.
The services listed above are just popular examples. You can integrate with
self-hosted models, specialized AI services, or any custom API endpoint that
follows standard HTTP protocols.
{{< /note >}}

## Get started

1. **Choose your runtime**: Select the programming language that
best fits your AI application needs.
1. **Configure your app**: Set up your application in the `.upsun/config.yaml` configuration file. You can use AI to [generate an initial configuration](/administration/cli/init.md).
1. **Integrate LLM APIs**: Connect to your preferred AI service providers.
1. **Deploy and scale**: Push your code and let Upsun handle the infrastructure.

For detailed examples and tutorials, see the
[AI and Machine Learning tutorials on DevCenter](https://devcenter.upsun.com/posts/ai?utm_source=docs&utm_medium=ai-section&utm_campaign=tutorials).

Find out more about the many [languages {{% vendor/name %}} supports](/languages/_index.md).
