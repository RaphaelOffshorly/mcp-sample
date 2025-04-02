from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from langchain_mcp_adapters.tools import load_mcp_tools
from langchain_mcp_adapters.tools import load_mcp_tools
from langgraph.prebuilt import create_react_agent
import asyncio

from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv

load_dotenv()
model = ChatOpenAI(model="gpt-4o")

# server_params = StdioServerParameters(
#     command="python",
#     args=["math_server.py"]
# )
server_params = StdioServerParameters(
    command="sudo",
    args=["docker", "run", "-e", f"GITHUB_PERSONAL_ACCESS_TOKEN={os.environ.get('GITHUB_PERSONAL_ACCESS_TOKEN')}", "-i", "mcp/github"],
)
async def run_agent(question):
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools=await load_mcp_tools(session)
            agent = create_react_agent(model, tools)
            agent_response = await agent.ainvoke(
                {"messages":question}
            )
            return agent_response['messages'][-1].content
if __name__ == "__main__":
    result = asyncio.run(run_agent("What changes are made in the last commit for the harvestlaboffshorly/harvestlab-ai-services where RaphaelOffshorly is a contributor"))
    print(result)
        