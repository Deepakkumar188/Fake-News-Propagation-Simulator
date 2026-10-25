"""Breadth-First Search (BFS) and Depth-First Search (DFS) Traversal Engines.

This module executes graph traversals on social networks to simulate fake news
propagation. It records fine-grained, pedagogical event logs that can be
replayed step-by-step in the frontend visualization.
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


def simulate_bfs(graph: Graph, source: str) -> Dict[str, Any]:
    """Simulate Fake News Propagation using Breadth-First Search (BFS).
    
    BFS propagates level-by-level using a FIFO Queue. It simulates a broadcast
    wavefront where all immediate contacts receive the rumor before it spreads
    to second-degree connections.
    
    Args:
        graph: The Graph instance.
        source: Node ID where the fake news originates ('Patient Zero').
        
    Returns:
        Dict containing the complete step log, final metrics, and summary.
    """
    source = str(source).strip()
    if not graph.has_node(source):
        raise KeyError(f"Source user '{source}' does not exist in the network.")

    total_nodes = graph.get_node_count()
    step_log: List[Dict[str, Any]] = []
    traversal_order: List[str] = []
    
    # Core BFS Data Structures
    queue: deque = deque([source])
    visited: Set[str] = {source}
    levels: Dict[str, int] = {source: 0}
    parents: Dict[str, Optional[str]] = {source: None}
    
    step_counter = 1

    # Initial Step: Source starts the rumor
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
        "levels": dict(levels),
        "parents": dict(parents),
        "traversal_order": list(traversal_order),
        "explanation": f"Fake news originates at '{source}' (Level 0). '{source}' is added to visited set and pushed into the FIFO Queue.",
        "stats": _generate_stats(total_nodes, len(visited), levels)
    })

    while queue:
        # Dequeue the front element
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
            "levels": dict(levels),
            "parents": dict(parents),
            "traversal_order": list(traversal_order),
            "explanation": f"Dequeued '{curr}' from front of Queue (Propagation Level {curr_level}). Now inspecting its social connections.",
            "stats": _generate_stats(total_nodes, len(visited), levels)
        })

        neighbors = graph.get_neighbors(curr)
        
        if not neighbors:
            step_counter += 1
            step_log.append({
                "step_id": step_counter,
                "algorithm": "BFS",
                "action": "NO_NEIGHBORS",
                "current_node": curr,
                "neighbor_node": None,
                "active_edge": None,
                "queue_state": list(queue),
                "stack_state": [],
                "visited_nodes": list(visited),
                "levels": dict(levels),
                "parents": dict(parents),
                "traversal_order": list(traversal_order),
                "explanation": f"'{curr}' has no outgoing connections. Propagation stops along this branch.",
                "stats": _generate_stats(total_nodes, len(visited), levels)
            })

        for neighbor in neighbors:
            step_counter += 1
            active_edge = [curr, neighbor]

            if neighbor not in visited:
                # Discovered an uninfected user
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
                    "levels": dict(levels),
                    "parents": dict(parents),
                    "traversal_order": list(traversal_order),
                    "explanation": f"Propagated from '{curr}' to '{neighbor}'. '{neighbor}' receives the rumor at Level {curr_level + 1} and is ENQUEUED.",
                    "stats": _generate_stats(total_nodes, len(visited), levels)
                })
            else:
                # Cycle or alternative already-infected path
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
                    "levels": dict(levels),
                    "parents": dict(parents),
                    "traversal_order": list(traversal_order),
                    "explanation": f"Connection '{curr}' -> '{neighbor}' inspected, but '{neighbor}' already received the news earlier (Cycle/Cross edge). Skipped to prevent redundant forwarding.",
                    "stats": _generate_stats(total_nodes, len(visited), levels)
                })

    # Final completion step
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
        "levels": dict(levels),
        "parents": dict(parents),
        "traversal_order": list(traversal_order),
        "explanation": f"Queue is empty! BFS propagation complete. Reached {len(visited)}/{total_nodes} users across {max(levels.values())} levels.",
        "stats": _generate_stats(total_nodes, len(visited), levels)
    })

    return {
        "algorithm": "BFS",
        "source": source,
        "steps": step_log,
        "total_steps": len(step_log),
        "traversal_order": traversal_order,
        "reached_nodes": list(visited),
        "unreached_nodes": unreached,
        "levels": levels,
        "parents": parents,
        "summary": {
            "total_nodes": total_nodes,
            "total_edges": graph.get_edge_count(),
            "infected_count": len(visited),
            "unreached_count": len(unreached),
            "reach_percentage": round((len(visited) / total_nodes * 100), 1) if total_nodes > 0 else 0,
            "max_depth": max(levels.values()) if levels else 0,
            "data_structure": "FIFO Queue (collections.deque)",
            "time_complexity": "O(V + E)",
            "space_complexity": "O(V)"
        }
    }


def simulate_dfs(graph: Graph, source: str) -> Dict[str, Any]:
    """Simulate Fake News Propagation using Depth-First Search (DFS).
    
    DFS explores a single whisper chain as deeply as possible before backtracking.
    It uses an explicit LIFO Stack to simulate private, multi-hop rumor forwards.
    
    Args:
        graph: The Graph instance.
        source: Node ID where the fake news originates ('Patient Zero').
        
    Returns:
        Dict containing the complete step log, final metrics, and summary.
    """
    source = str(source).strip()
    if not graph.has_node(source):
        raise KeyError(f"Source user '{source}' does not exist in the network.")

    total_nodes = graph.get_node_count()
    step_log: List[Dict[str, Any]] = []
    traversal_order: List[str] = []
    
    # Core DFS Data Structures
    stack: List[str] = [source]
    visited: Set[str] = set()
    levels: Dict[str, int] = {source: 0}
    parents: Dict[str, Optional[str]] = {source: None}
    
    step_counter = 1

    # Initial Step: Source pushed to stack
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
        "levels": dict(levels),
        "parents": dict(parents),
        "traversal_order": list(traversal_order),
        "explanation": f"Fake news originates at '{source}'. '{source}' is pushed onto the LIFO Stack as the starting point of the whisper chain.",
        "stats": _generate_stats(total_nodes, len(visited), levels)
    })

    while stack:
        curr = stack.pop()
        step_counter += 1

        if curr not in visited:
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
                "levels": dict(levels),
                "parents": dict(parents),
                "traversal_order": list(traversal_order),
                "explanation": f"Popped '{curr}' from top of Stack. User '{curr}' is marked infected and added to traversal order.",
                "stats": _generate_stats(total_nodes, len(visited), levels)
            })

            neighbors = graph.get_neighbors(curr)

            # In standard iterative DFS, we push neighbors in reverse order so the
            # first neighbor is popped and explored first.
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
                    "levels": dict(levels),
                    "parents": dict(parents),
                    "traversal_order": list(traversal_order),
                    "explanation": f"All outgoing connections of '{curr}' are already infected or absent. Backtracking to explore earlier branches in the Stack.",
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
                        "levels": dict(levels),
                        "parents": dict(parents),
                        "traversal_order": list(traversal_order),
                        "explanation": f"Whisper passed along connection '{curr}' -> '{neighbor}'. '{neighbor}' PUSHED onto top of Stack.",
                        "stats": _generate_stats(total_nodes, len(visited), levels)
                    })
        else:
            # Node was already visited via another path
            step_log.append({
                "step_id": step_counter,
                "algorithm": "DFS",
                "action": "SKIP_VISITED",
                "current_node": curr,
                "neighbor_node": None,
                "active_edge": None,
                "queue_state": [],
                "stack_state": list(stack),
                "visited_nodes": list(visited),
                "levels": dict(levels),
                "parents": dict(parents),
                "traversal_order": list(traversal_order),
                "explanation": f"Popped '{curr}' from top of Stack, but '{curr}' was already infected via a deeper path. Discarded.",
                "stats": _generate_stats(total_nodes, len(visited), levels)
            })

    # Final completion step
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
        "levels": dict(levels),
        "parents": dict(parents),
        "traversal_order": list(traversal_order),
        "explanation": f"Stack is empty! DFS propagation complete. Reached {len(visited)}/{total_nodes} users.",
        "stats": _generate_stats(total_nodes, len(visited), levels)
    })

    return {
        "algorithm": "DFS",
        "source": source,
        "steps": step_log,
        "total_steps": len(step_log),
        "traversal_order": traversal_order,
        "reached_nodes": list(visited),
        "unreached_nodes": unreached,
        "levels": levels,
        "parents": parents,
        "summary": {
            "total_nodes": total_nodes,
            "total_edges": graph.get_edge_count(),
            "infected_count": len(visited),
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

    # Maximum memory footprint during execution
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
    """Simulate a dual-wave race: Rumor Propagation vs. Fact-Checker Counter-Dissemination.
    
    Uses Multi-Source Simultaneous BFS. The Rumor starts immediately from `rumor_source`.
    After a realistic lag (`fact_delay`), the Fact-Checker launches the truth wave from `fact_source`.
    
    Nodes reached by Truth first are 'Inoculated' (Immune).
    Nodes reached by Rumor first are 'Infected'.
    If Truth later reaches an Infected node, it 'Debunks / Neutralizes' the misinformation!
    """
    rumor_source = str(rumor_source).strip()
    fact_source = str(fact_source).strip()

    if not graph.has_node(rumor_source):
        raise KeyError(f"Rumor source '{rumor_source}' does not exist.")
    if not graph.has_node(fact_source):
        raise KeyError(f"Fact-Checker source '{fact_source}' does not exist.")

    total_nodes = graph.get_node_count()
    step_log: List[Dict[str, Any]] = []

    # Queues for Rumor and Fact-Check waves
    rumor_queue: deque = deque([rumor_source])
    fact_queue: deque = deque()

    # States
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

    # Step 1: Rumor Origin Launch
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
        # Check if Fact-Checker activates at this clock tick
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

        # Process one step of Rumor Wave
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

        # Process one step of Fact-Checker Wave
        if fact_queue:
            curr_fact = fact_queue.popleft()
            for neighbor in graph.get_neighbors(curr_fact):
                if neighbor in infected:
                    # Debunk / Neutralize infected node!
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
                    # Inoculate healthy node
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

    # Final wrap-up
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
