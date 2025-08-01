# Integration Snippets

A modern integration snippets platform that provides API integration code snippets through two interfaces: a web application wand an MCP (Model Context Protocol) server for AI assistants and automated tools.

## Two Usage Options

### 1. Web Application Mode
A browser-based interface for manually browsing and copying integration snippets.

**Features:**
- **GitHub Dark Mode Styling**: Authentic GitHub dark theme with professional code highlighting
- **Dynamic Search**: Real-time search across vendors and topics
- **Copy to Clipboard**: One-click copying of integration code snippets
- **Responsive Design**: Optimized for desktop and mobile devices
- **Visual Interface**: Click-to-browse integration library

### 2. MCP Server Mode
A Model Context Protocol server that provides integration snippets as a structured service for AI assistants and automated tools.

**Features:**
- **Programmatic Access**: Query integration data via MCP protocol
- **AI Assistant Integration**: Compatible with Claude and other MCP-enabled tools
- **Automation Support**: Integrate snippets into development workflows
- **Structured Data**: JSON-formatted integration metadata and code

## Common Features (Both Modes)

- **Modular Architecture**: Each integration is self-contained with its own metadata
- **Code Syntax Highlighting**: Proper highlighting for JavaScript and bash code blocks
- **Dynamic Content**: Loads integration data from GitHub repository


## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm 
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/inte.git
   cd inte
   ```

2. **Install root dependencies and build MCP**
   ```bash
   npm install
   npm run build
   cd web
   npm install
   cd ..
   ```

## Running the Application

Choose one of the two modes based on your needs:

### Option 1: Web Application Mode

**Use when:** You want to browse integrations visually, copy-paste code manually, or explore available integrations through a user-friendly interface.

1. **Start the web development server**
   ```bash
   cd web
   npm run dev
   ```

2. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

### Option 2: MCP Server Mode

**Use when:** You want AI assistants to access integration data, you're building automated tools, or you need programmatic access to integration snippets.

1. **Start the MCP server**
   ```bash
   node build/index.js
   ```

2. **Connect your MCP-enabled tool**
   The server will be available for MCP protocol connections following is how to use in config json, make sure to use absolute path
   ```json
    {
    "mcpServers": {
        "inte": {
        "command": "node",
        "args": ["/Users/YOURUSERNAME/inte/build/index.js"],
        "tools": [],
        "resources": ["listVendors", "getSnippet"],
        "description": "MCP server serving API integration snippets for various vendors and languages",
        "enabled": true,
        "category": "development"
        }
    }
    }
    ```


## When to Use Each Mode

| Feature | Web Mode | MCP Server Mode |
|---------|----------|----------------|
| **Interface** | Browser UI | API/Protocol server |
| **Target User** | Human developers | AI assistants/tools |
| **Access Method** | Visual browsing | Programmatic queries |
| **Best For** | Manual exploration | Automated workflows |

## Usage



### Adding New Integrations

1. **Create a new folder** in the `snippets/` directory with your integration name
2. **Add metadata.json** with the following structure:
   ```json
   {
     "vendorName": "YourService",
     "language": "JavaScript",
     "topics": ["api", "integration", "service"],
     "lastUpdated": "2025-01-15",
     "slug": "yourservice"
   }
   ```
3. **Add snippet.md** with your integration code and documentation
4. **Update the main metadata.json** file in the snippets root director
5. **Push to Github** 



### Technology Stack

**Web Application:**
- **Frontend**: Next.js with React
- **Styling**: CSS-in-JS with styled-jsx
- **Markdown**: ReactMarkdown for content rendering

**MCP Server:**
- **Protocol**: Model Context Protocol
- **Runtime**: Node.js
- **Data Format**: JSON metadata with Markdown content
