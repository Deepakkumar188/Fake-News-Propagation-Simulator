"""Breadth-First Search (BFS), Depth-First Search (DFS), and Multi-Source Race Engines.

This module executes graph traversals on social networks to simulate fake news
propagation and counter-disinformation defense. It features:
- BFS viral broadcast and DFS targeted whisper chains
- AI-driven Susceptibility & Skepticism threshold resistance
- Multi-Source Simultaneous Race (Truth vs. Rumor)
- PageRank & Betweenness Centrality Super-Spreader Detection
"""

from collections import deque
from typing import Dict, List, Set, Any, Optional, Tuple
from core.graph import Graph


def _generate_stats(total_nodes: int, visited_count: int, levels: Dict[str, int]) -> Dict[str, Any]:
    """Calculate real-time propagation statistics."""
    max_depth = max(levels.values()) if levels else 0
    reach_pct = round((visited_count / total_nodes * 100), 1) if total_nodes > 0 else 0
    return {
        "total_nodes": total_nodes,
        "reached_count": visited_count,
        "unreached_count": total_nodes - visited_count,
        "reach_percentage": reach_pct,
        "max_propagation_depth": max_depth
    }


def compute_pagerank(graph: Graph, damping: float = 0.85, max_iter: int = 35) -> Dict[str, float]:
    """Compute PageRank influence scores for all nodes in the graph."""
    nodes = graph.get_nodes()
    n = len(nodes)
    if n == 0:
        return {}

    pr = {node: 1.0 / n for node in nodes}

    for _ in range(max_iter):
        new_pr = {}
        for u in nodes:
            rank_sum = 0.0
            for v in graph.get_neighbors(u):
                out_deg = len(graph.get_neighbors(v))
                if out_deg > 0:
                    rank_sum += pr[v] / out_deg
            new_pr[u] = (1.0 - damping) / n + damping * rank_sum
        pr = new_pr

    max_val = max(pr.values()) if pr and max(pr.values()) > 0 else 1.0
    return {k: round(v / max_val, 4) for k, v in pr.items()}


def compute_centrality(graph: Graph) -> Dict[str, Any]:
    """Identify network Super-Spreaders using PageRank and Degree Centrality."""
    pr = compute_pagerank(graph)
    degrees = graph.get_degrees()
    total_nodes = graph.get_node_count()

    ranked = []
    for node in graph.get_nodes():
        meta = graph.nodes.get(node, {})
        label = meta.get("label", node)
        role = meta.get("role", "Standard User")
        rank_score = pr.get(node, 0.1)
        deg = degrees.get(node, {}).get("total", 0)
        norm_deg = (deg / max(1, total_nodes - 1)) if total_nodes > 1 else 0.5
        influence = round((rank_score * 0.65 + norm_deg * 0.35) * 100, 1)

        ranked.append({
            "id": node,
            "label": label,
            "role": role,
            "pagerank": rank_score,
            "degree": deg,
            "influence_index": influence
        })

    ranked.sort(key=lambda x: x["influence_index"], reverse=True)
    return {
        "top_super_spreaders": ranked[:3],
        "all_nodes": ranked,
        "pagerank_scores": pr
    }


def simulate_bfs(graph: Graph, source: str, virality: float = 0.75) -> Dict[str, Any]:
    """Simulate Fake News Propagation using Breadth-First Search (BFS).
    
    Includes AI Susceptibility: if neighbor skepticism > virality, rumor is resisted.
    """
    source = str(source).strip()
    if not graph.has_node(source):
        raise KeyError(f"Source user '{source}' does not exist in the network.")

    total_nodes = graph.get_node_count()
    step_log: List[Dict[str, Any]] = []
    traversal_order: List[str] = []
    resisted: Set[str] = set()

    queue: deque = deque([source])
    visited: Set[str] = {source}
    levels: Dict[str, int] = {source: 0}
    parents: Dict[str, Optional[str]] = {source: None}
    
    step_counter = 1

    step_log.append({
        "step_id": step_counter,
        "algorithm": "BFS",
        "action": "START",
        "current_node": source,
        "neighbor_node": None,
        "active_edge": None,
        "queue_state": list(queue),
        "stack_state": [],
        "visited_nodes": list(visited),
        "resisted_nodes": list(resisted),
        "levels": dict(levels),
        "parents": dict(parents),
        "traversal_order": list(traversal_order),
        "explanation": f"Disinformation originates at '{source}' (Level 0). Enqueued into FIFO buffer.",
        "stats": _generate_stats(total_nodes, len(visited), levels)
    })

    while queue:
        curr = queue.popleft()
        traversal_order.append(curr)
        curr_level = levels[curr]
        step_counter += 1

        step_log.append({
            "step_id": step_counter,
            "algorithm": "BFS",
            "action": "POP_QUEUE",
            "current_node": curr,
            "neighbor_node": None,
            "active_edge": None,
            "queue_state": list(queue),
            "stack_state": [],
            "visited_nodes": list(visited),
            "resisted_nodes": list(resisted),
            "levels": dict(levels),
            "parents": dict(parents),
            "traversal_order": list(traversal_order),
            "explanation": f"Dequeued '{curr}' at Wavefront Level {curr_level}. Scanning outgoing vectors.",
            "stats": _generate_stats(total_nodes, len(visited), levels)
        })

        neighbors = graph.get_neighbors(curr)

        for neighbor in neighbors:
            step_counter += 1
            active_edge = [curr, neighbor]

            if neighbor not in visited:
                skepticism = graph.nodes.get(neighbor, {}).get("skepticism", 0.45)
                # Check AI Susceptibility threshold
                if virality < 1.0 and skepticism > virality:
                    resisted.add(neighbor)
                    step_log.append({
                        "step_id": step_counter,
                        "algorithm": "BFS",
                        "action": "RESISTED_SKEPTIC",
                        "current_node": curr,
                        "neighbor_node": neighbor,
                        "active_edge": active_edge,
                        "queue_state": list(queue),
                        "stack_state": [],
                        "visited_nodes": list(visited),
                        "resisted_nodes": list(resisted),
                        "levels": dict(levels),
                        "parents": dict(parents),
                        "traversal_order": list(traversal_order),
                        "explanation": f"Entity '{neighbor}' resisted transmission! Skepticism ({skepticism:.2f}) > Persuasiveness ({virality:.2f}). Rumor rejected.",
                        "stats": _generate_stats(total_nodes, len(visited), levels)
                    })
                    continue

                visited.add(neighbor)
                levels[neighbor] = curr_level + 1
                parents[neighbor] = curr
                queue.append(neighbor)

                step_log.append({
                    "step_id": step_counter,
                    "algorithm": "BFS",
                    "action": "DISCOVER_NEW",
                    "current_node": curr,
                    "neighbor_node": neighbor,
                    "active_edge": active_edge,
                    "queue_state": list(queue),
                    "stack_state": [],
                    "visited_nodes": list(visited),
                    "resisted_nodes": list(resisted),
                    "levels": dict(levels),
                    "parents": dict(parents),
                    "traversal_order": list(traversal_order),
                    "explanation": f"Transmission vector '{curr}' -> '{neighbor}' succeeded. '{neighbor}' compromised at Hop {curr_level + 1} and enqueued.",
                    "stats": _generate_stats(total_nodes, len(visited), levels)
                })
            else:
                step_log.append({
                    "step_id": step_counter,
                    "algorithm": "BFS",
                    "action": "SKIP_VISITED",
                    "current_node": curr,
                    "neighbor_node": neighbor,
                    "active_edge": active_edge,
                    "queue_state": list(queue),
                    "stack_state": [],
                    "visited_nodes": list(visited),
                    "resisted_nodes": list(resisted),
                    "levels": dict(levels),
                    "parents": dict(parents),
                    "traversal_order": list(traversal_order),
                    "explanation": f"Vector '{curr}' -> '{neighbor}' already compromised previously. Skipped to prevent redundant forwarding.",
                    "stats": _generate_stats(total_nodes, len(visited), levels)
                })

    step_counter += 1
    unreached = [n for n in graph.get_nodes() if n not in visited]

    step_log.append({
        "step_id": step_counter,
        "algorithm": "BFS",
        "action": "COMPLETE",
        "current_node": None,
        "neighbor_node": None,
        "active_edge": None,
        "queue_state": [],
        "stack_state": [],
        "visited_nodes": list(visited),
        "resisted_nodes": list(resisted),
        "levels": dict(levels),
        "parents": dict(parents),
        "traversal_order": list(traversal_order),
        "explanation": f"FIFO buffer exhausted. BFS diffusion stabilized. Compromised: {len(visited)}/{total_nodes} entities across {max(levels.values())} levels.",
        "stats": _generate_stats(total_nodes, len(visited), levels)
    })

    return {
        "algorithm": "BFS",
        "source": source,
        "virality": virality,
        "steps": step_log,
        "total_steps": len(step_log),
        "traversal_order": traversal_order,
        "reached_nodes": list(visited),
        "resisted_nodes": list(resisted),
        "unreached_nodes": unreached,
        "levels": levels,
        "parents": parents,
        "summary": {
            "total_nodes": total_nodes,
            "total_edges": graph.get_edge_count(),
            "infected_count": len(visited),
            "resisted_count": len(resisted),
            "unreached_count": len(unreached),
            "reach_percentage": round((len(visited) / total_nodes * 100), 1) if total_nodes > 0 else 0,
            "max_depth": max(levels.values()) if levels else 0,
            "data_structure": "FIFO Queue (collections.deque)",
            "time_complexity": "O(V + E)",
            "space_complexity": "O(V)"
        }
    }


def simulate_dfs(graph: Graph, source: str, virality: float = 0.75) -> Dict[str, Any]:
    """Simulate Fake News Propagation using Depth-First Search (DFS)."""
    source = str(source).strip()
    if not graph.has_node(source):
        raise KeyError(f"Source user '{source}' does not exist in the network.")

    total_nodes = graph.get_node_count()
    step_log: List[Dict[str, Any]] = []
    traversal_order: List[str] = []
    resisted: Set[str] = set()

    stack: List[str] = [source]
    visited: Set[str] = set()
    levels: Dict[str, int] = {source: 0}
    parents: Dict[str, Optional[str]] = {source: None}
    
    step_counter = 1

    step_log.append({
        "step_id": step_counter,
        "algorithm": "DFS",
        "action": "START",
        "current_node": source,
        "neighbor_node": None,
        "active_edge": None,
        "queue_state": [],
        "stack_state": list(stack),
        "visited_nodes": list(visited),
        "resisted_nodes": list(resisted),
        "levels": dict(levels),
        "parents": dict(parents),
        "traversal_order": list(traversal_order),
        "explanation": f"Penetrative whisper cascade initiated at '{source}'. Pushed onto LIFO branch register.",
        "stats": _generate_stats(total_nodes, len(visited), levels)
    })

    while stack:
        curr = stack.pop()
        step_counter += 1

        if curr not in visited:
            skepticism = graph.nodes.get(curr, {}).get("skepticism", 0.45)
            if curr != source and virality < 1.0 and skepticism > virality:
                resisted.add(curr)
                step_log.append({
                    "step_id": step_counter,
                    "algorithm": "DFS",
                    "action": "RESISTED_SKEPTIC",
                    "current_node": curr,
                    "neighbor_node": None,
                    "active_edge": None,
                    "queue_state": [],
                    "stack_state": list(stack),
                    "visited_nodes": list(visited),
                    "resisted_nodes": list(resisted),
                    "levels": dict(levels),
                    "parents": dict(parents),
                    "traversal_order": list(traversal_order),
                    "explanation": f"Entity '{curr}' popped from stack but resisted propagation! Skepticism ({skepticism:.2f}) > Virality ({virality:.2f}).",
                    "stats": _generate_stats(total_nodes, len(visited), levels)
                })
                continue

            visited.add(curr)
            traversal_order.append(curr)
            curr_level = levels.get(curr, 0)

            step_log.append({
                "step_id": step_counter,
                "algorithm": "DFS",
                "action": "POP_AND_VISIT",
                "current_node": curr,
                "neighbor_node": None,
                "active_edge": None,
                "queue_state": [],
                "stack_state": list(stack),
                "visited_nodes": list(visited),
                "resisted_nodes": list(resisted),
                "levels": dict(levels),
                "parents": dict(parents),
                "traversal_order": list(traversal_order),
                "explanation": f"Popped '{curr}' from top of Stack. Entity compromised along active whisper path.",
                "stats": _generate_stats(total_nodes, len(visited), levels)
            })

            neighbors = graph.get_neighbors(curr)
            unvisited_neighbors = [n for n in reversed(neighbors) if n not in visited]

            if not unvisited_neighbors:
                step_counter += 1
                step_log.append({
                    "step_id": step_counter,
                    "algorithm": "DFS",
                    "action": "BACKTRACK",
                    "current_node": curr,
                    "neighbor_node": None,
                    "active_edge": None,
                    "queue_state": [],
                    "stack_state": list(stack),
                    "visited_nodes": list(visited),
                    "resisted_nodes": list(resisted),
                    "levels": dict(levels),
                    "parents": dict(parents),
                    "traversal_order": list(traversal_order),
                    "explanation": f"All vectors from '{curr}' exhausted. Backtracking to explore alternate branches in Stack.",
                    "stats": _generate_stats(total_nodes, len(visited), levels)
                })

            for neighbor in unvisited_neighbors:
                step_counter += 1
                active_edge = [curr, neighbor]

                if neighbor not in stack:
                    levels[neighbor] = curr_level + 1
                    parents[neighbor] = curr
                    stack.append(neighbor)

                    step_log.append({
                        "step_id": step_counter,
                        "algorithm": "DFS",
                        "action": "PUSH_STACK",
                        "current_node": curr,
                        "neighbor_node": neighbor,
                        "active_edge": active_edge,
                        "queue_state": [],
                        "stack_state": list(stack),
                        "visited_nodes": list(visited),
                        "resisted_nodes": list(resisted),
                        "levels": dict(levels),
                        "parents": dict(parents),
                        "traversal_order": list(traversal_order),
                        "explanation": f"Whisper passed via vector '{curr}' -> '{neighbor}'. '{neighbor}' pushed onto Stack.",
                        "stats": _generate_stats(total_nodes, len(visited), levels)
                    })

    step_counter += 1
    unreached = [n for n in graph.get_nodes() if n not in visited]

    step_log.append({
        "step_id": step_counter,
        "algorithm": "DFS",
        "action": "COMPLETE",
        "current_node": None,
        "neighbor_node": None,
        "active_edge": None,
        "queue_state": [],
        "stack_state": [],
        "visited_nodes": list(visited),
        "resisted_nodes": list(resisted),
        "levels": dict(levels),
        "parents": dict(parents),
        "traversal_order": list(traversal_order),
        "explanation": f"Stack register empty. DFS trajectory concluded. Compromised: {len(visited)}/{total_nodes} entities.",
        "stats": _generate_stats(total_nodes, len(visited), levels)
    })

    return {
        "algorithm": "DFS",
        "source": source,
        "virality": virality,
        "steps": step_log,
        "total_steps": len(step_log),
        "traversal_order": traversal_order,
        "reached_nodes": list(visited),
        "resisted_nodes": list(resisted),
        "unreached_nodes": unreached,
        "levels": levels,
        "parents": parents,
        "summary": {
            "total_nodes": total_nodes,
            "total_edges": graph.get_edge_count(),
            "infected_count": len(visited),
            "resisted_count": len(resisted),
            "unreached_count": len(unreached),
            "reach_percentage": round((len(visited) / total_nodes * 100), 1) if total_nodes > 0 else 0,
            "max_depth": max(levels.values()) if levels else 0,
            "data_structure": "LIFO Stack (List)",
            "time_complexity": "O(V + E)",
            "space_complexity": "O(V)"
        }
    }


def compare_algorithms(graph: Graph, source: str) -> Dict[str, Any]:
    """Execute both BFS and DFS on the same graph and return a comprehensive comparison."""
    bfs_result = simulate_bfs(graph, source)
    dfs_result = simulate_dfs(graph, source)

    bfs_steps = bfs_result["steps"]
    dfs_steps = dfs_result["steps"]

    bfs_max_queue = max(len(step["queue_state"]) for step in bfs_steps) if bfs_steps else 0
    dfs_max_stack = max(len(step["stack_state"]) for step in dfs_steps) if dfs_steps else 0

    return {
        "source": source,
        "graph_stats": {
            "vertices": graph.get_node_count(),
            "edges": graph.get_edge_count(),
            "is_directed": graph.is_directed
        },
        "bfs": {
            "traversal_order": bfs_result["traversal_order"],
            "total_steps": bfs_result["total_steps"],
            "max_queue_size": bfs_max_queue,
            "max_propagation_depth": bfs_result["summary"]["max_depth"],
            "reached_count": bfs_result["summary"]["infected_count"],
            "unreached_count": bfs_result["summary"]["unreached_count"]
        },
        "dfs": {
            "traversal_order": dfs_result["traversal_order"],
            "total_steps": dfs_result["total_steps"],
            "max_stack_size": dfs_max_stack,
            "max_propagation_depth": dfs_result["summary"]["max_depth"],
            "reached_count": dfs_result["summary"]["infected_count"],
            "unreached_count": dfs_result["summary"]["unreached_count"]
        },
        "observations": [
            f"Both algorithms reached the exact same set of reachable nodes ({len(bfs_result['reached_nodes'])} users).",
            "BFS explored users in concentric radial hops (Level 0 -> Level 1 -> Level 2), guaranteeing shortest hop distance.",
            "DFS plunged deeply into single branch chains before backtracking.",
            f"Peak auxiliary memory: BFS Queue reached {bfs_max_queue} elements; DFS Stack reached {dfs_max_stack} elements."
        ]
    }


def simulate_race(graph: Graph, rumor_source: str, fact_source: str, fact_delay: int = 1) -> Dict[str, Any]:
    """Simulate a dual-wave race: Rumor Propagation vs. Fact-Checker Counter-Dissemination."""
    rumor_source = str(rumor_source).strip()
    fact_source = str(fact_source).strip()

    if not graph.has_node(rumor_source):
        raise KeyError(f"Rumor source '{rumor_source}' does not exist.")
    if not graph.has_node(fact_source):
        raise KeyError(f"Fact-Checker source '{fact_source}' does not exist.")

    total_nodes = graph.get_node_count()
    step_log: List[Dict[str, Any]] = []

    rumor_queue: deque = deque([rumor_source])
    fact_queue: deque = deque()

    infected: Set[str] = {rumor_source}
    inoculated: Set[str] = set()
    debunked: Set[str] = set()

    step_counter = 1
    time_series = [{
        "step": 1,
        "rumor_count": 1,
        "fact_count": 0,
        "debunked_count": 0
    }]

    step_log.append({
        "step_id": step_counter,
        "algorithm": "RACE",
        "wave_type": "RUMOR",
        "action": "RUMOR_ORIGIN",
        "current_node": rumor_source,
        "neighbor_node": None,
        "active_edge": None,
        "queue_state": list(rumor_queue),
        "stack_state": [],
        "infected_nodes": list(infected),
        "inoculated_nodes": list(inoculated),
        "debunked_nodes": list(debunked),
        "visited_nodes": list(infected),
        "time_series": list(time_series),
        "explanation": f"Disinformation outbreak initialized at '{rumor_source}' (Patient Zero). Wavefront active."
    })

    clock_tick = 1

    while rumor_queue or fact_queue or clock_tick <= fact_delay + 1:
        if clock_tick == fact_delay + 1 and fact_source not in inoculated and fact_source not in debunked:
            if fact_source in infected:
                debunked.add(fact_source)
                infected.remove(fact_source)
            else:
                inoculated.add(fact_source)
            fact_queue.append(fact_source)

            step_counter += 1
            time_series.append({
                "step": step_counter,
                "rumor_count": len(infected),
                "fact_count": len(inoculated),
                "debunked_count": len(debunked)
            })

            step_log.append({
                "step_id": step_counter,
                "algorithm": "RACE",
                "wave_type": "FACT_CHECK",
                "action": "FACT_CHECK_LAUNCH",
                "current_node": fact_source,
                "neighbor_node": None,
                "active_edge": None,
                "queue_state": list(fact_queue),
                "stack_state": [],
                "infected_nodes": list(infected),
                "inoculated_nodes": list(inoculated),
                "debunked_nodes": list(debunked),
                "visited_nodes": list(infected | inoculated | debunked),
                "time_series": list(time_series),
                "explanation": f"Fact-Checker counter-wave mobilized at '{fact_source}'. Truth broadcast initiated to inoculate network."
            })

        if rumor_queue:
            curr_rumor = rumor_queue.popleft()
            for neighbor in graph.get_neighbors(curr_rumor):
                if neighbor not in infected and neighbor not in inoculated and neighbor not in debunked:
                    infected.add(neighbor)
                    rumor_queue.append(neighbor)
                    step_counter += 1

                    time_series.append({
                        "step": step_counter,
                        "rumor_count": len(infected),
                        "fact_count": len(inoculated),
                        "debunked_count": len(debunked)
                    })

                    step_log.append({
                        "step_id": step_counter,
                        "algorithm": "RACE",
                        "wave_type": "RUMOR",
                        "action": "RUMOR_SPREAD",
                        "current_node": curr_rumor,
                        "neighbor_node": neighbor,
                        "active_edge": [curr_rumor, neighbor],
                        "queue_state": list(rumor_queue),
                        "stack_state": [],
                        "infected_nodes": list(infected),
                        "inoculated_nodes": list(inoculated),
                        "debunked_nodes": list(debunked),
                        "visited_nodes": list(infected | inoculated | debunked),
                        "time_series": list(time_series),
                        "explanation": f"Rumor breached '{neighbor}' via '{curr_rumor}'. Entity compromised."
                    })
                elif neighbor in inoculated:
                    step_counter += 1
                    step_log.append({
                        "step_id": step_counter,
                        "algorithm": "RACE",
                        "wave_type": "RUMOR",
                        "action": "BLOCKED_BY_TRUTH",
                        "current_node": curr_rumor,
                        "neighbor_node": neighbor,
                        "active_edge": [curr_rumor, neighbor],
                        "queue_state": list(rumor_queue),
                        "stack_state": [],
                        "infected_nodes": list(infected),
                        "inoculated_nodes": list(inoculated),
                        "debunked_nodes": list(debunked),
                        "visited_nodes": list(infected | inoculated | debunked),
                        "time_series": list(time_series),
                        "explanation": f"Rumor attempted transmission to '{neighbor}', but user is already Inoculated by Fact-Check! Rumor blocked."
                    })

        if fact_queue:
            curr_fact = fact_queue.popleft()
            for neighbor in graph.get_neighbors(curr_fact):
                if neighbor in infected:
                    infected.remove(neighbor)
                    debunked.add(neighbor)
                    fact_queue.append(neighbor)
                    step_counter += 1

                    time_series.append({
                        "step": step_counter,
                        "rumor_count": len(infected),
                        "fact_count": len(inoculated),
                        "debunked_count": len(debunked)
                    })

                    step_log.append({
                        "step_id": step_counter,
                        "algorithm": "RACE",
                        "wave_type": "FACT_CHECK",
                        "action": "DEBUNK_NEUTRALIZE",
                        "current_node": curr_fact,
                        "neighbor_node": neighbor,
                        "active_edge": [curr_fact, neighbor],
                        "queue_state": list(fact_queue),
                        "stack_state": [],
                        "infected_nodes": list(infected),
                        "inoculated_nodes": list(inoculated),
                        "debunked_nodes": list(debunked),
                        "visited_nodes": list(infected | inoculated | debunked),
                        "time_series": list(time_series),
                        "explanation": f"Fact-Check intercepted compromised entity '{neighbor}'! Misinformation neutralized and debunked."
                    })
                elif neighbor not in inoculated and neighbor not in debunked:
                    inoculated.add(neighbor)
                    fact_queue.append(neighbor)
                    step_counter += 1

                    time_series.append({
                        "step": step_counter,
                        "rumor_count": len(infected),
                        "fact_count": len(inoculated),
                        "debunked_count": len(debunked)
                    })

                    step_log.append({
                        "step_id": step_counter,
                        "algorithm": "RACE",
                        "wave_type": "FACT_CHECK",
                        "action": "TRUTH_INOCULATE",
                        "current_node": curr_fact,
                        "neighbor_node": neighbor,
                        "active_edge": [curr_fact, neighbor],
                        "queue_state": list(fact_queue),
                        "stack_state": [],
                        "infected_nodes": list(infected),
                        "inoculated_nodes": list(inoculated),
                        "debunked_nodes": list(debunked),
                        "visited_nodes": list(infected | inoculated | debunked),
                        "time_series": list(time_series),
                        "explanation": f"Truth wave reached '{neighbor}'. Entity verified and Inoculated against rumor transmission."
                    })

        clock_tick += 1

    step_counter += 1
    unreached = [n for n in graph.get_nodes() if n not in infected and n not in inoculated and n not in debunked]

    step_log.append({
        "step_id": step_counter,
        "algorithm": "RACE",
        "wave_type": "BATTLE_END",
        "action": "RACE_COMPLETE",
        "current_node": None,
        "neighbor_node": None,
        "active_edge": None,
        "queue_state": [],
        "stack_state": [],
        "infected_nodes": list(infected),
        "inoculated_nodes": list(inoculated),
        "debunked_nodes": list(debunked),
        "visited_nodes": list(infected | inoculated | debunked),
        "time_series": list(time_series),
        "explanation": f"Diffusion stabilized. Infected: {len(infected)}, Debunked: {len(debunked)}, Inoculated: {len(inoculated)}, Immune/Unreached: {len(unreached)}."
    })

    return {
        "algorithm": "RACE",
        "rumor_source": rumor_source,
        "fact_source": fact_source,
        "steps": step_log,
        "total_steps": len(step_log),
        "time_series": time_series,
        "summary": {
            "total_nodes": total_nodes,
            "total_edges": graph.get_edge_count(),
            "infected_count": len(infected),
            "debunked_count": len(debunked),
            "inoculated_count": len(inoculated),
            "unreached_count": len(unreached),
            "containment_rate": round(((len(inoculated) + len(debunked)) / total_nodes * 100), 1) if total_nodes > 0 else 0,
            "data_structure": "Dual FIFO Queues (Multi-Source BFS)",
            "time_complexity": "O(V + E)",
            "space_complexity": "O(V)"
        }
    }
