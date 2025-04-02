# MCP Client Chatbot

A web application that demonstrates the use of Model Context Protocol (MCP) to interact with multiple servers through a unified interface. This project includes a math server for performing mathematical operations and a GitHub server for querying repository information.

## Features

- Web interface for interacting with MCP servers
- Support for multiple servers (Math and GitHub)
- Command-line interface for direct queries
- Markdown rendering for formatted responses

## Prerequisites

- Python 3.8 or higher
- Docker (for running the GitHub server)
- OpenAI API key
- GitHub Personal Access Token (for GitHub server functionality)
- MCP Servers repository

## MCP Servers Setup

Before running the application, you need to set up the MCP servers:

1. Clone the MCP servers repository:
```bash
git clone https://github.com/modelcontextprotocol/servers.git
cd servers
```

2. Build and run the Docker image for the GitHub server:
```bash
# Navigate to the GitHub server directory
cd src/github

# Build the Docker image
docker build -t mcp/github .

# Return to the project root
cd ../..
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/mcp-client-chatbot.git
cd mcp-client-chatbot
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

On Windows:
```bash
venv\Scripts\activate
```

On macOS and Linux:
```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Set up environment variables

Create a `.env` file in the project root directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_personal_access_token
```

Replace `your_openai_api_key` and `your_github_personal_access_token` with your actual API keys.

## Usage

### Running the Web Application

To start the web application:

```bash
python app.py
```

This will start a Flask development server at `http://127.0.0.1:5000/`. Open this URL in your browser to access the web interface.

### Running the Command-Line Client

To use the command-line interface:

```bash
python multi_server_client.py "Your query here"
```

#### Examples:

1. Using all available servers:
```bash
python multi_server_client.py "What is 5 + 10?"
```

2. Using only the math server:
```bash
python multi_server_client.py --server math "What is 5 * 10?"
```

3. Using only the GitHub server:
```bash
python multi_server_client.py --server github "What changes were made in the last commit for repository X?"
```

## Project Structure

- `app.py`: Flask web application
- `multi_server_client.py`: Command-line interface for querying MCP servers
- `math_server.py`: Simple MCP server that provides mathematical operations
- `client.py`: Single-server client implementation (example/reference)
- `templates/`: HTML templates for the web interface
- `static/`: CSS and JavaScript files for the web interface

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for accessing language models
- `GITHUB_PERSONAL_ACCESS_TOKEN`: Your GitHub personal access token for accessing GitHub data

## License

[MIT License](LICENSE)
