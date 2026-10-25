"""Unit tests for BFS, DFS, Race, SIR, Centrality, Containment, and Community Detection."""

import unittest
from core.graph import Graph
from core.algorithms import (
    simulate_bfs,
    simulate_dfs,
    simulate_sir,
    compare_algorithms,
    simulate_race,
    compute_pagerank,
    compute_centrality,
    calculate_optimal_containment,
    detect_communities
)
from core.presets import (
    create_linear_chain_network,
    create_star_network,
    create_cyclic_network,
    create_disconnected_network,
    create_financial_panic_network,
    create_election_echo_network,
    generate_scale_free_network,
    generate_small_world_network
)


class TestAlgorithms(unittest.TestCase):
    def test_linear_chain_bfs_and_dfs(self):
        g = create_linear_chain_network()
        bfs = simulate_bfs(g, "Origin_A")
        dfs = simulate_dfs(g, "Origin_A")
        
        expected = ["Origin_A", "User_B", "User_C", "User_D", "User_E", "User_F"]
        self.assertEqual(bfs["traversal_order"], expected)
        self.assertEqual(dfs["traversal_order"], expected)
        self.assertEqual(len(bfs["unreached_nodes"]), 0)

    def test_star_network_bfs_levels(self):
        g = create_star_network()
        bfs = simulate_bfs(g, "Celebrity")
        self.assertEqual(bfs["levels"]["Celebrity"], 0)
        for i in range(1, 9):
            self.assertEqual(bfs["levels"][f"Follower_{i}"], 1)
        self.assertEqual(bfs["summary"]["max_depth"], 1)
        self.assertEqual(bfs["summary"]["infected_count"], 9)

    def test_cyclic_network_termination(self):
        g = create_cyclic_network()
        bfs = simulate_bfs(g, "Peer_1")
        dfs = simulate_dfs(g, "Peer_1")
        
        self.assertEqual(len(bfs["reached_nodes"]), 6)
        self.assertEqual(len(dfs["reached_nodes"]), 6)
        skip_actions = [s for s in bfs["steps"] if s["action"] == "SKIP_VISITED"]
        self.assertGreater(len(skip_actions), 0)

    def test_disconnected_network_unreached(self):
        g = create_disconnected_network()
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

    def test_race_simulation(self):
        g = create_financial_panic_network()
        race = simulate_race(g, "Deepfake_Seed", "SEC_FactCheck", fact_delay=1)
        self.assertEqual(race["algorithm"], "RACE")
        self.assertGreater(len(race["steps"]), 0)
        self.assertIn("containment_rate", race["summary"])
        self.assertGreater(len(race["time_series"]), 0)

    def test_centrality_and_super_spreader_detection(self):
        g = create_star_network()
        centrality = compute_centrality(g)
        self.assertIn("top_super_spreaders", centrality)
        self.assertIn("pagerank_scores", centrality)
        top_spreader = centrality["top_super_spreaders"][0]
        self.assertEqual(top_spreader["id"], "Celebrity")
        self.assertGreater(top_spreader["influence_index"], 50.0)

    def test_ai_skepticism_resistance(self):
        g = create_financial_panic_network()
        bfs = simulate_bfs(g, "Deepfake_Seed", virality=0.35)
        self.assertIn("resisted_nodes", bfs)
        self.assertGreater(len(bfs["resisted_nodes"]), 0)
        resisted_actions = [s for s in bfs["steps"] if s["action"] == "RESISTED_SKEPTIC"]
        self.assertGreater(len(resisted_actions), 0)

    def test_barabasi_albert_scale_free_network(self):
        g = generate_scale_free_network(num_nodes=15, m_attach=2)
        self.assertEqual(g.get_node_count(), 15)
        self.assertGreaterEqual(g.get_edge_count(), 14)
        degrees = g.get_degrees()
        max_deg = max(d["total"] for d in degrees.values())
        self.assertGreaterEqual(max_deg, 3)

    def test_watts_strogatz_small_world_network(self):
        g = generate_small_world_network(num_nodes=15, k=4, beta=0.3)
        self.assertEqual(g.get_node_count(), 15)
        self.assertGreaterEqual(g.get_edge_count(), 15)

    def test_sir_epidemic_simulation(self):
        g = create_financial_panic_network()
        sir = simulate_sir(g, "Deepfake_Seed", virality=0.8, recovery_rate=0.4, max_epochs=15)
        self.assertEqual(sir["algorithm"], "SIR")
        self.assertGreater(len(sir["steps"]), 0)
        self.assertIn("attack_rate", sir["summary"])
        self.assertIn("recovered_count", sir["summary"])
        self.assertGreater(len(sir["time_series"]), 0)

    def test_calculate_optimal_containment(self):
        g = create_election_echo_network()
        # In echo chambers, the Swing_Voter_Bridge connects the two communities!
        cuts = calculate_optimal_containment(g, "Partisan_Alpha_Lead", budget=2)
        self.assertIn("optimal_edge_cuts", cuts)
        self.assertIn("optimal_node_cuts", cuts)
        self.assertIn("recommendation", cuts)
        self.assertGreater(len(cuts["optimal_edge_cuts"]), 0)

    def test_detect_communities(self):
        g = create_election_echo_network()
        comm = detect_communities(g)
        self.assertIn("total_communities", comm)
        self.assertIn("node_communities", comm)
        self.assertGreaterEqual(comm["total_communities"], 2)


if __name__ == "__main__":
    unittest.main()
