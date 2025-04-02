import os
import asyncio
import argparse
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent

from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()
model = ChatOpenAI(model="gpt-4o")

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

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run an agent with multiple MCP servers')
    parser.add_argument('query', nargs='?', default="What changes are made in the last commit for the harvestlaboffshorly/harvestlab-ai-services where RaphaelOffshorly is a contributor", 
                        help='The query to send to the agent')
    parser.add_argument('--server', '-s', choices=['math', 'github'], 
                        help='Specify a single server to use (math or github)')
    args = parser.parse_args()
    
    result = asyncio.run(run_agent(args.query, args.server))
    print(result)
