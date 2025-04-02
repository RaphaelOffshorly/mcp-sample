import os
import asyncio
import argparse
import markdown
from flask import Flask, request, jsonify, render_template
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()
model = ChatOpenAI(model="gpt-4o")

app = Flask(__name__)

async def run_agent(question, server=None):
    servers = {
        "math": {
            "command": "python",
            "args": ["math_server.py"],
            "transport": "stdio"
        },
        "github": {
            "command": "sudo",
            "args": ["docker", "run", "-e", f"GITHUB_PERSONAL_ACCESS_TOKEN={os.environ.get('GITHUB_PERSONAL_ACCESS_TOKEN')}", "-i", "mcp/github"],
            "transport": "stdio"
        }
    }
    
    # If a specific server is requested, only use that one
    if server and server in servers:
        server_config = {server: servers[server]}
    else:
        server_config = servers
        
    async with MultiServerMCPClient(server_config) as client:
        tools = client.get_tools()
        agent = create_react_agent(model, tools)
        agent_response = await agent.ainvoke(
            {"messages": question}
        )
        return agent_response['messages'][-1].content

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/query', methods=['POST'])
def query():
    print("Received query request")
    data = request.json
    print(f"Request data: {data}")
    question = data.get('question', '')
    server = data.get('server', None)
    
    if not question:
        print("Error: No question provided")
        return jsonify({'error': 'No question provided'}), 400
    
    try:
        print(f"Processing query: '{question}' with server: {server}")
        result = asyncio.run(run_agent(question, server))
        print(f"Query result: {result}")
        # Convert markdown to HTML with enhanced extensions
        html_result = markdown.markdown(
            result, 
            extensions=[
                'fenced_code',
                'tables',
                'nl2br',  # Convert newlines to <br> tags
                'sane_lists',  # Better list handling
                'smarty'  # Smart typography for better spacing
            ]
        )
        return jsonify({'result': html_result})
    except Exception as e:
        print(f"Error processing query: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
