"""Unit tests for the Graph data structure."""

import unittest
from core.graph import Graph


class TestGraph(unittest.TestCase):
    def setUp(self):
        self.g = Graph(is_directed=False)

    def test_add_and_has_node(self):
        self.assertTrue(self.g.add_node("Alice", "Alice L", "Influencer"))
        self.assertTrue(self.g.has_node("Alice"))
        # Adding same node returns False (updates label/role)
        self.assertFalse(self.g.add_node("Alice", "Alice New"))
        self.assertEqual(self.g.get_node_count(), 1)

    def test_add_and_has_edge_undirected(self):
        self.g.add_node("Alice")
        self.g.add_node("Bob")
        self.assertTrue(self.g.add_edge("Alice", "Bob"))
        self.assertTrue(self.g.has_edge("Alice", "Bob"))
        self.assertTrue(self.g.has_edge("Bob", "Alice"))  # Undirected symmetry
        self.assertEqual(self.g.get_edge_count(), 1)

    def test_add_and_has_edge_directed(self):
        dg = Graph(is_directed=True)
        dg.add_node("Alice")
        dg.add_node("Bob")
        self.assertTrue(dg.add_edge("Alice", "Bob"))
        self.assertTrue(dg.has_edge("Alice", "Bob"))
        self.assertFalse(dg.has_edge("Bob", "Alice"))  # Directed asymmetry
        self.assertEqual(dg.get_edge_count(), 1)

    def test_remove_node(self):
        self.g.add_node("Alice")
        self.g.add_node("Bob")
        self.g.add_edge("Alice", "Bob")
        self.assertTrue(self.g.remove_node("Alice"))
        self.assertFalse(self.g.has_node("Alice"))
        self.assertEqual(self.g.get_neighbors("Bob"), [])
        self.assertEqual(self.g.get_edge_count(), 0)

    def test_remove_edge(self):
        self.g.add_node("Alice")
        self.g.add_node("Bob")
        self.g.add_edge("Alice", "Bob")
        self.assertTrue(self.g.remove_edge("Alice", "Bob"))
        self.assertFalse(self.g.has_edge("Alice", "Bob"))
        self.assertEqual(self.g.get_edge_count(), 0)

    def test_connected_components(self):
        # Component 1
        self.g.add_node("1")
        self.g.add_node("2")
        self.g.add_edge("1", "2")
        # Component 2
        self.g.add_node("3")
        self.g.add_node("4")
        self.g.add_edge("3", "4")
        # Isolated node
        self.g.add_node("5")
        
        comps = self.g.get_connected_components()
        self.assertEqual(len(comps), 3)

    def test_serialization(self):
        self.g.add_node("Alice")
        self.g.add_node("Bob")
        self.g.add_edge("Alice", "Bob")
        d = self.g.to_dict()
        g2 = Graph.from_dict(d)
        self.assertTrue(g2.has_edge("Alice", "Bob"))
        self.assertEqual(g2.get_node_count(), 2)


if __name__ == "__main__":
    unittest.main()
