"""Graph Data Structure implementation using an Adjacency List.

This module provides the Graph class representing social networks for the
Fake News Propagation Simulator. It supports both directed and undirected
graphs, dynamic node/edge additions, metadata tracking, and JSON serialization.
"""

from typing import Dict, List, Set, Any, Optional, Tuple


class Graph:
    """Represents a network of social media users using an Adjacency List.
    
    Attributes:
        is_directed (bool): True if connections are directional (e.g. Twitter/X followers),
                            False if mutual (e.g. Facebook friendships).
        adj (Dict[str, List[str]]): The adjacency list mapping each node ID to a list
                                    of its neighbor node IDs.
        nodes (Dict[str, Dict[str, Any]]): Metadata for each node (label, role, etc.).
    """

    def __init__(self, is_directed: bool = False):
        self.is_directed: bool = is_directed
        self.adj: Dict[str, List[str]] = {}
        self.nodes: Dict[str, Dict[str, Any]] = {}

    def add_node(self, node_id: str, label: Optional[str] = None, role: str = "Standard User") -> bool:
        """Add a new user (vertex) to the social network.
        
        Args:
            node_id: Unique string identifier for the user.
            label: Display name for the user (defaults to node_id if None).
            role: Social role (e.g., 'Influencer', 'Standard User', 'Fact Checker', 'Bot').
            
        Returns:
            bool: True if node was newly added, False if it already existed.
        """
        node_id = str(node_id).strip()
        if not node_id:
            raise ValueError("Node ID cannot be empty.")
            
        if node_id in self.nodes:
            # Update metadata if already present
            if label:
                self.nodes[node_id]["label"] = label
            if role:
                self.nodes[node_id]["role"] = role
            return False

        self.nodes[node_id] = {
            "id": node_id,
            "label": label if label else node_id,
            "role": role
        }
        self.adj[node_id] = []
        return True

    def remove_node(self, node_id: str) -> bool:
        """Remove a user and all incident edges from the network.
        
        Args:
            node_id: Identifier of the user to remove.
            
        Returns:
            bool: True if removed, False if node didn't exist.
        """
        node_id = str(node_id).strip()
        if node_id not in self.nodes:
            return False

        # Remove from nodes dictionary
        del self.nodes[node_id]
        del self.adj[node_id]

        # Remove all incoming edges pointing to this node
        for u in self.adj:
            self.adj[u] = [v for v in self.adj[u] if v != node_id]

        return True

    def add_edge(self, u: str, v: str) -> bool:
        """Create a connection (edge) between two users.
        
        Args:
            u: Source user ID.
            v: Destination user ID.
            
        Returns:
            bool: True if edge was added, False if already exists or invalid.
        """
        u, v = str(u).strip(), str(v).strip()
        if u not in self.nodes or v not in self.nodes:
            raise KeyError(f"Both nodes must exist in the graph. Found u={u in self.nodes}, v={v in self.nodes}")

        if v not in self.adj[u]:
            self.adj[u].append(v)
            if not self.is_directed:
                if u not in self.adj[v]:
                    self.adj[v].append(u)
            return True
        return False

    def remove_edge(self, u: str, v: str) -> bool:
        """Remove a connection between two users."""
        u, v = str(u).strip(), str(v).strip()
        removed = False
        if u in self.adj and v in self.adj[u]:
            self.adj[u].remove(v)
            removed = True

        if not self.is_directed and v in self.adj and u in self.adj[v]:
            self.adj[v].remove(u)
            removed = True

        return removed

    def has_node(self, node_id: str) -> bool:
        """Check whether a node exists."""
        return str(node_id).strip() in self.nodes

    def has_edge(self, u: str, v: str) -> bool:
        """Check whether an edge exists from u to v."""
        u, v = str(u).strip(), str(v).strip()
        return u in self.adj and v in self.adj[u]

    def get_neighbors(self, node_id: str) -> List[str]:
        """Return the list of adjacent neighbors for a node in insertion order."""
        node_id = str(node_id).strip()
        return list(self.adj.get(node_id, []))

    def get_nodes(self) -> List[str]:
        """Return a list of all node IDs in the graph."""
        return list(self.nodes.keys())

    def get_edges(self) -> List[Tuple[str, str]]:
        """Return all edges as tuples. For undirected graphs, returns unique pairs."""
        edges = []
        seen = set()
        for u in self.adj:
            for v in self.adj[u]:
                if self.is_directed:
                    edges.append((u, v))
                else:
                    pair = tuple(sorted([u, v]))
                    if pair not in seen:
                        seen.add(pair)
                        edges.append((u, v))
        return edges

    def get_node_count(self) -> int:
        """Return total number of vertices |V|."""
        return len(self.nodes)

    def get_edge_count(self) -> int:
        """Return total number of edges |E|."""
        if self.is_directed:
            return sum(len(neighbors) for neighbors in self.adj.values())
        else:
            return sum(len(neighbors) for neighbors in self.adj.values()) // 2

    def get_degrees(self) -> Dict[str, Dict[str, int]]:
        """Calculate in-degree, out-degree, and total degree for each node."""
        degrees = {
            node: {"in": 0, "out": len(self.adj[node]), "total": 0}
            for node in self.nodes
        }

        for u in self.adj:
            for v in self.adj[u]:
                if v in degrees:
                    degrees[v]["in"] += 1

        for node in degrees:
            if self.is_directed:
                degrees[node]["total"] = degrees[node]["in"] + degrees[node]["out"]
            else:
                degrees[node]["total"] = degrees[node]["out"]

        return degrees

    def get_connected_components(self) -> List[List[str]]:
        """Find all connected components using BFS.
        
        For directed graphs, this computes weakly connected components (treating edges as undirected).
        """
        visited = set()
        components = []

        # Build an undirected view of the graph for component analysis
        undirected_adj: Dict[str, Set[str]] = {n: set(self.adj[n]) for n in self.nodes}
        for u in self.adj:
            for v in self.adj[u]:
                if v in undirected_adj:
                    undirected_adj[v].add(u)

        for node in self.nodes:
            if node not in visited:
                component = []
                queue = [node]
                visited.add(node)
                while queue:
                    curr = queue.pop(0)
                    component.append(curr)
                    for neighbor in undirected_adj.get(curr, []):
                        if neighbor not in visited:
                            visited.add(neighbor)
                            queue.append(neighbor)
                components.append(component)

        return components

    def to_dict(self) -> Dict[str, Any]:
        """Serialize graph to a dictionary suitable for JSON responses and UI rendering."""
        edge_list = []
        seen = set()
        for u in self.adj:
            for v in self.adj[u]:
                if self.is_directed:
                    edge_list.append({"from": u, "to": v})
                else:
                    pair = tuple(sorted([u, v]))
                    if pair not in seen:
                        seen.add(pair)
                        edge_list.append({"from": u, "to": v})

        return {
            "is_directed": self.is_directed,
            "nodes": [
                {
                    "id": n_id,
                    "label": meta["label"],
                    "role": meta.get("role", "Standard User")
                }
                for n_id, meta in self.nodes.items()
            ],
            "edges": edge_list,
            "stats": {
                "vertex_count": self.get_node_count(),
                "edge_count": self.get_edge_count(),
                "components_count": len(self.get_connected_components())
            }
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Graph":
        """Instantiate a Graph object from a dictionary format."""
        is_directed = data.get("is_directed", False)
        graph = cls(is_directed=is_directed)

        for n in data.get("nodes", []):
            if isinstance(n, dict):
                graph.add_node(n["id"], label=n.get("label"), role=n.get("role", "Standard User"))
            else:
                graph.add_node(str(n))

        for e in data.get("edges", []):
            u = e["from"]
            v = e["to"]
            if not graph.has_node(u):
                graph.add_node(u)
            if not graph.has_node(v):
                graph.add_node(v)
            graph.add_edge(u, v)

        return graph
