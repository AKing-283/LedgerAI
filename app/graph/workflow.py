from langgraph.graph import StateGraph
from langgraph.graph import END

from app.graph.state import AccountingState
from app.agents.document_agent import document_agent


builder = StateGraph(AccountingState)

builder.add_node(
    "document_agent",
    document_agent
)

builder.set_entry_point(
    "document_agent"
)

builder.add_edge(
    "document_agent",
    END
)

graph = builder.compile()