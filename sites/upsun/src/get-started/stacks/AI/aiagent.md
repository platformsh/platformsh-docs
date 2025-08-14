---
title: Host AI Agents
weight: -40
---

You can host AI agents on Upsun using any runtime that supports your preferred
programming language and integrate with various LLM APIs. Upsun provides
container-based deployments that give you control over your application
architecture and dependencies.

## Runtime and language support

Upsun supports multiple runtimes through container-based deployments including
Python, Node.js, PHP, Ruby, Go, Java, and more. For the complete list of
supported runtimes and their versions, see the [runtime types reference]
(/create-apps/app-reference/single-runtime-image.md#types).

You configure your runtime in the [`.upsun/config.yaml`](/learn/overview/yaml/yaml-structure.md)
 file.
The platform builds your application in a container with the specified runtime
and dependencies.

## LLM API Integration

You can integrate your AI agent with any LLM API that your chosen runtime supports:

- **OpenAI API**: Use the [official OpenAI client libraries](https://platform.openai.com/docs/libraries) 
for Python, Node.js, and other languages
- **Anthropic Claude API**: Use the [Anthropic client libraries](https://docs.anthropic.com/en/docs/getting-started-with-the-api) for Python,
Node.js, and other languages
- **Google Gemini**: Use the [Google AI client libraries](https://ai.google.dev/docs)
for Python, Node.js, and other languages
- **Azure OpenAI**: Use the [Azure OpenAI client libraries](https://learn.microsoft.com/en-us/azure/ai-services/openai/) for Python,
Node.js, and other languages
- **AWS Bedrock**: Use the [AWS Bedrock client libraries](https://docs.aws.amazon.com/bedrock/) for Python, Node.js, and other languages
- **Other providers**: Integrate with any API that provides HTTP endpoints

Your application code handles the API calls and response processing. Upsun doesn't
restrict which services you can use.

## Environment Management

Upsun provides isolated environments for development, testing, and production:

- **Branch-based environments**: Each Git branch creates a separate environment
- **Data isolation**: Each environment has its own services and data
- **Easy cloning**: Clone production data to development environments for testing
- **Environment variables**: Store API keys and configuration securely using
[variables](/development/variables/_index.md)

## Tutorials

- **Deploy a RAG-Based Conversational Agent with Chainlit**: Build a Retrieval-Augmented
Generation agent using Chainlit, llama_index, and OpenAI, then deploy it on Upsun.
See the [Chainlit deployment tutorial](https://devcenter.upsun.com/posts/deploying-chainlit-with-rag/).

- **Access Documentation contextually via Context7 + MCP**: Use the Model Context
Protocol to let AI assistants fetch your Upsun documentation in real-time. See the
[Context7 MCP article](https://devcenter.upsun.com/posts/context7-mcp/).

- **Use the Upsun API to Automate Agent Deployment**: Automate deployments, environment
management, and configuration through the Upsun API. See the
[API usage guide](https://devcenter.upsun.com/posts/using-the-upsun-api/).

## Configuration Example

Here's a basic configuration for a Python AI agent. For more configuration
options, see the [complete application reference](/create-apps/app-reference/single-runtime-image.md):

```yaml
# .upsun/config.yaml
applications:
  ai-agent:
    source:
      root: "/"
    type: "python:3.11"
    mounts:
      ".data": source: "storage", source_path: "data"
    web:
      commands:
        start: "python agent.py"
      upstream:
        socket_family: tcp
        locations:
          "/": root: "", passthru: true
```

## Application Code

For examples of how to implement AI agents with different frameworks and APIs,
see the [AI and Machine Learning tutorials on DevCenter](https://devcenter.upsun.com/posts/?utm_source=docs&utm_medium=ai-agent&utm_campaign=tutorials).

## Deploy Your Agent

1. Add your code to Git:

   ```bash
   git add .
   git commit -m "Add AI agent service"
   ```

2. Set your OpenAI API key as an environment variable using the [CLI]
(/administration/cli/_index.md):

   ```bash
   upsun variable:create env:OPENAI_API_KEY --value=<your_key>
   ```

   For more information about setting variables, see [how to set variables]
   (/development/variables/set-variables.md).

3. Deploy to Upsun:

   ```bash
   upsun push
   ```

Your agent will be available at your Upsun environment URL. The platform handles
the containerization, networking, and scaling automatically. For more deployment
options, see [deploy your project](/learn/overview/build-deploy.md).

---

## Key Benefits

- **Runtime flexibility**: Choose the programming language and version that fits
your needs
- **Service independence**: Use any LLM API or external service
- **Environment isolation**: Test changes safely in separate environments
- **Automated deployment**: Deploy through Git pushes or API calls
- **Scalability**: The platform handles load balancing and resource allocation

For more information about building and deploying applications, see the
[configure apps](/create-apps/_index.md) section.
