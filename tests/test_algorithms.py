"""Unit tests for BFS, DFS, and Comparative Traversal Algorithms."""

import unittest
from core.graph import Graph
from core.algorithms import simulate_bfs, simulate_dfs, compare_algorithms
from core.presets import (
    create_linear_chain_network,
    create_star_network,
    create_cyclic_network,
    create_disconnected_network
)


class TestAlgorithms(unittest.TestCase):
    def test_linear_chain_bfs_and_dfs(self):
        g = create_linear_chain_network()
        # In a directed linear chain A -> B -> C -> D -> E -> F,
        # BFS and DFS must produce the exact same traversal order!
        bfs = simulate_bfs(g, "Origin_A")
        dfs = simulate_dfs(g, "Origin_A")
        
        expected = ["Origin_A", "User_B", "User_C", "User_D", "User_E", "User_F"]
        self.assertEqual(bfs["traversal_order"], expected)
        self.assertEqual(dfs["traversal_order"], expected)
        self.assertEqual(len(bfs["unreached_nodes"]), 0)

    def test_star_network_bfs_levels(self):
        g = create_star_network()
        bfs = simulate_bfs(g, "Celebrity")
        # Celebrity at level 0, all followers at level 1
        self.assertEqual(bfs["levels"]["Celebrity"], 0)
        for i in range(1, 9):
            self.assertEqual(bfs["levels"][f"Follower_{i}"], 1)
        self.assertEqual(bfs["summary"]["max_depth"], 1)
        self.assertEqual(bfs["summary"]["infected_count"], 9)

    def test_cyclic_network_termination(self):
        g = create_cyclic_network()
        # Should terminate cleanly without infinite recursion or loop
        bfs = simulate_bfs(g, "Peer_1")
        dfs = simulate_dfs(g, "Peer_1")
        
        self.assertEqual(len(bfs["reached_nodes"]), 6)
        self.assertEqual(len(dfs["reached_nodes"]), 6)
        # Verify skip_visited actions occurred
        skip_actions = [s for s in bfs["steps"] if s["action"] == "SKIP_VISITED"]
        self.assertGreater(len(skip_actions), 0)

    def test_disconnected_network_unreached(self):
        g = create_disconnected_network()
        # Starting from Alpha_1 should reach only Alpha nodes (4 nodes),
        # while Beta (3 nodes) and Isolated (1 node) remain unreached.
        bfs = simulate_bfs(g, "Alpha_1")
        
        self.assertEqual(bfs["summary"]["infected_count"], 4)
        self.assertEqual(bfs["summary"]["unreached_count"], 4)
        self.assertIn("Isolated_User", bfs["unreached_nodes"])
        self.assertIn("Beta_1", bfs["unreached_nodes"])

    def test_invalid_source_node(self):
        g = Graph()
        g.add_node("Alice")
        with self.assertRaises(KeyError):
            simulate_bfs(g, "NonExistentUser")
        with self.assertRaises(KeyError):
            simulate_dfs(g, "NonExistentUser")

    def test_comparison_runner(self):
        g = create_star_network()
        comp = compare_algorithms(g, "Celebrity")
        self.assertIn("bfs", comp)
        self.assertIn("dfs", comp)
        self.assertEqual(comp["bfs"]["reached_count"], comp["dfs"]["reached_count"])


if __name__ == "__main__":
    unittest.main()
