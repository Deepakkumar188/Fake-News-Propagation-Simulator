"""Real-World Social Network Topologies & Case Study Scenarios.

Provides realistic social media misinformation scenarios:
1. Deepfake Financial Market Panic (HFT Bots, Traders, Fact-Checkers)
2. Polarized Political Echo Chambers (Partisan groups linked by Swing Voters)
3. Medical Misinformation & Miracle Cure Cascade (WhatsApp groups, Doctors)
4. Coordinated Botnet Astroturfing Campaign (Central operative and bots)
5. Viral WhatsApp Linear Forwarding Chain (One-way private forward hops)
6. Segmented Closed Communities (Disconnected campuses/clubs)
7. Barabási-Albert Scale-Free Network Generator (Preferential Attachment)
8. Watts-Strogatz Small-World Network Generator (High Clustering & Shortcuts)
"""

import random
from typing import Dict, Any, List
from core.graph import Graph


def get_preset_network(preset_id: str) -> Graph:
    """Factory function returning a Graph initialized with a preset topology."""
    preset_id = preset_id.lower().strip()
    
    if preset_id in ("financial_panic", "market"):
        return create_financial_panic_network()
    elif preset_id in ("election_echo", "echo_chamber", "clusters"):
        return create_election_echo_network()
    elif preset_id in ("health_rumor", "medical"):
        return create_health_rumor_network()
    elif preset_id in ("botnet_campaign", "star", "botnet", "influencer"):
        return create_botnet_network()
    elif preset_id in ("whatsapp_chain", "linear", "chain"):
        return create_whatsapp_chain_network()
    elif preset_id in ("cyclic", "ring"):
        return create_cyclic_network()
    elif preset_id in ("disconnected", "campus"):
        return create_disconnected_network()
    elif preset_id in ("scale_free", "barabasi"):
        return generate_scale_free_network()
    elif preset_id in ("small_world", "watts"):
        return generate_small_world_network()
    else:
        return create_default_network()


def create_financial_panic_network() -> Graph:
    """Real-World Case 1: Deepfake Financial Panic & Algo Trading Bots."""
    g = Graph(is_directed=False)

    users = [
        ("Deepfake_Seed", "Deepfake Tweet (Origin)", "Bot", 0.05),
        ("Crypto_Whale", "Crypto Influencer (5M)", "Influencer", 0.25),
        ("HFT_Algo_1", "HFT Scraping Bot A", "Bot", 0.05),
        ("HFT_Algo_2", "HFT Scraping Bot B", "Bot", 0.05),
        ("DayTrader_Forum", "Day Trader Discord Group", "Standard User", 0.40),
        ("Retail_Investor_X", "Retail Investor", "Standard User", 0.50),
        ("Market_Journalist", "Financial News Anchor", "Journalist", 0.80),
        ("WallSt_Fund", "Hedge Fund Desk", "Standard User", 0.65),
        ("SEC_FactCheck", "SEC Official Fact-Checker", "Fact Checker", 0.95)
    ]
    for uid, label, role, skep in users:
        g.add_node(uid, label=label, role=role, skepticism=skep)

    edges = [
        ("Deepfake_Seed", "Crypto_Whale"),
        ("Deepfake_Seed", "HFT_Algo_1"),
        ("Deepfake_Seed", "HFT_Algo_2"),
        ("HFT_Algo_1", "DayTrader_Forum"),
        ("HFT_Algo_2", "WallSt_Fund"),
        ("Crypto_Whale", "Retail_Investor_X"),
        ("DayTrader_Forum", "Retail_Investor_X"),
        ("DayTrader_Forum", "Market_Journalist"),
        ("Market_Journalist", "SEC_FactCheck"),
        ("WallSt_Fund", "SEC_FactCheck")
    ]
    for u, v in edges:
        g.add_edge(u, v)

    return g


def create_election_echo_network() -> Graph:
    """Real-World Case 2: Polarized Political Echo Chambers & Swing Voters."""
    g = Graph(is_directed=False)

    g.add_node("Partisan_Alpha_Lead", "Partisan Media Alpha (Seed)", "Influencer", skepticism=0.20)
    g.add_node("Alpha_Activist_1", "Alpha Supporter #1", "Standard User", skepticism=0.30)
    g.add_node("Alpha_Activist_2", "Alpha Supporter #2", "Standard User", skepticism=0.35)
    g.add_node("Alpha_Discussion", "Alpha Discussion Forum", "Standard User", skepticism=0.40)

    g.add_edge("Partisan_Alpha_Lead", "Alpha_Activist_1")
    g.add_edge("Partisan_Alpha_Lead", "Alpha_Activist_2")
    g.add_edge("Alpha_Activist_1", "Alpha_Activist_2")
    g.add_edge("Alpha_Activist_2", "Alpha_Discussion")
    g.add_edge("Alpha_Activist_1", "Alpha_Discussion")

    g.add_node("Swing_Voter_Bridge", "Undecided Swing Voter (Bridge)", "Standard User", skepticism=0.65)
    g.add_edge("Alpha_Discussion", "Swing_Voter_Bridge")

    g.add_node("Partisan_Beta_Lead", "Partisan Media Beta", "Influencer", skepticism=0.20)
    g.add_node("Beta_Activist_1", "Beta Supporter #1", "Standard User", skepticism=0.30)
    g.add_node("Beta_Activist_2", "Beta Supporter #2", "Standard User", skepticism=0.35)
    g.add_node("Beta_Discussion", "Beta Discussion Forum", "Standard User", skepticism=0.40)

    g.add_edge("Swing_Voter_Bridge", "Beta_Discussion")
    g.add_edge("Beta_Discussion", "Beta_Activist_1")
    g.add_edge("Beta_Discussion", "Beta_Activist_2")
    g.add_edge("Beta_Activist_1", "Beta_Activist_2")
    g.add_edge("Beta_Activist_2", "Partisan_Beta_Lead")

    g.add_node("Election_FactChecker", "Independent Fact-Checker", "Fact Checker", skepticism=0.92)
    g.add_edge("Swing_Voter_Bridge", "Election_FactChecker")

    return g


def create_health_rumor_network() -> Graph:
    """Real-World Case 3: Medical Misinformation & Miracle Cure Cascade."""
    g = Graph(is_directed=False)

    users = [
        ("Fake_Guru", "Unverified Wellness Guru (Seed)", "Influencer", 0.15),
        ("WhatsApp_MomGroup", "School Parents WhatsApp Group", "Standard User", 0.45),
        ("Neighborhood_Admin", "Residential Community Admin", "Standard User", 0.50),
        ("Family_Elder_Chat", "Family Elders WhatsApp Group", "Standard User", 0.35),
        ("TikTok_Vlogger", "Lifestyle Video Creator", "Standard User", 0.40),
        ("HighSchool_Student", "Teen Student Account", "Standard User", 0.40),
        ("Local_Physician", "Family Doctor (MD)", "Fact Checker", 0.90),
        ("PublicHealth_Agency", "Hospital Public Health Desk", "Fact Checker", 0.95)
    ]
    for uid, label, role, skep in users:
        g.add_node(uid, label=label, role=role, skepticism=skep)

    edges = [
        ("Fake_Guru", "WhatsApp_MomGroup"),
        ("Fake_Guru", "TikTok_Vlogger"),
        ("WhatsApp_MomGroup", "Neighborhood_Admin"),
        ("WhatsApp_MomGroup", "Family_Elder_Chat"),
        ("TikTok_Vlogger", "HighSchool_Student"),
        ("Neighborhood_Admin", "Local_Physician"),
        ("Family_Elder_Chat", "Local_Physician"),
        ("Local_Physician", "PublicHealth_Agency")
    ]
    for u, v in edges:
        g.add_edge(u, v)

    return g


def create_botnet_network() -> Graph:
    """Real-World Case 4: Coordinated Botnet Astroturfing (Star Topology)."""
    g = Graph(is_directed=False)

    g.add_node("Celebrity", "Disinformation Operative (Seed)", "Influencer", skepticism=0.10)
    for i in range(1, 9):
        bot_id = f"Follower_{i}"
        g.add_node(bot_id, label=f"Coordinated Bot #{i}", role="Bot", skepticism=0.05)
        g.add_edge("Celebrity", bot_id)

    return g


def create_whatsapp_chain_network() -> Graph:
    """Real-World Case 5: 6-Hop Viral WhatsApp Forwarding Chain (Directed)."""
    g = Graph(is_directed=True)
    chain = [
        ("Origin_A", "Anonymous Audio Clip (Seed)", "Bot", 0.10),
        ("User_B", "Family WhatsApp Chat", "Standard User", 0.35),
        ("User_C", "College Alumni Group", "Standard User", 0.45),
        ("User_D", "Work Office Chat", "Standard User", 0.55),
        ("User_E", "Housing Society Group", "Standard User", 0.60),
        ("User_F", "Local Store Group", "Standard User", 0.50)
    ]
    for uid, label, role, skep in chain:
        g.add_node(uid, label=label, role=role, skepticism=skep)

    for i in range(len(chain) - 1):
        g.add_edge(chain[i][0], chain[i + 1][0])

    return g


def create_cyclic_network() -> Graph:
    """Cyclic Gossip Ring with cross-cutting chord edges."""
    g = Graph(is_directed=False)
    ring = [f"Peer_{i}" for i in range(1, 7)]
    for node in ring:
        g.add_node(node, label=node, role="Standard User", skepticism=0.45)

    for i in range(len(ring)):
        g.add_edge(ring[i], ring[(i + 1) % len(ring)])

    g.add_edge("Peer_1", "Peer_4")
    g.add_edge("Peer_2", "Peer_5")

    return g


def create_disconnected_network() -> Graph:
    """Disconnected graph with two separate subgraphs and an isolated singleton."""
    g = Graph(is_directed=False)

    for i in ["Alpha_1", "Alpha_2", "Alpha_3", "Alpha_4"]:
        g.add_node(i, label=i, role="Standard User", skepticism=0.40)
    g.add_edge("Alpha_1", "Alpha_2")
    g.add_edge("Alpha_2", "Alpha_3")
    g.add_edge("Alpha_3", "Alpha_4")
    g.add_edge("Alpha_4", "Alpha_1")

    for i in ["Beta_1", "Beta_2", "Beta_3"]:
        g.add_node(i, label=i, role="Standard User", skepticism=0.50)
    g.add_edge("Beta_1", "Beta_2")
    g.add_edge("Beta_2", "Beta_3")

    g.add_node("Isolated_User", label="Isolated (Offline Citizen)", role="Standard User", skepticism=0.85)

    return g


def create_default_network() -> Graph:
    """Default Heterogeneous Network with 10 Real-World Entities."""
    g = Graph(is_directed=False)
    
    users = [
        ("Alice_Influencer", "Alice (Lifestyle Influencer)", "Influencer", 0.25),
        ("Bob_Journalist", "Bob (Investigative Reporter)", "Journalist", 0.75),
        ("Charlie_Trader", "Charlie (Finance Trader)", "Standard User", 0.45),
        ("David_Student", "David (Tech Student)", "Standard User", 0.40),
        ("Emma_Parent", "Emma (Community Moderator)", "Standard User", 0.50),
        ("Frank_FactCheck", "Frank (Fact-Checking Bureau)", "Fact Checker", 0.90),
        ("Grace_Botnet", "Grace (Automated Retweet Bot)", "Bot", 0.05),
        ("Henry_Analyst", "Henry (Data Analyst)", "Standard User", 0.60),
        ("Ivy_Researcher", "Ivy (Policy Researcher)", "Standard User", 0.70),
        ("Jack_Offline", "Jack (Isolated Account)", "Standard User", 0.80)
    ]
    for uid, label, role, skep in users:
        g.add_node(uid, label=label, role=role, skepticism=skep)

    edges = [
        ("Alice_Influencer", "Bob_Journalist"),
        ("Alice_Influencer", "Charlie_Trader"),
        ("Alice_Influencer", "David_Student"),
        ("Bob_Journalist", "Emma_Parent"),
        ("Bob_Journalist", "Frank_FactCheck"),
        ("Charlie_Trader", "Grace_Botnet"),
        ("David_Student", "Henry_Analyst"),
        ("Emma_Parent", "Ivy_Researcher"),
        ("Frank_FactCheck", "Ivy_Researcher"),
        ("Grace_Botnet", "Henry_Analyst")
    ]
    for u, v in edges:
        g.add_edge(u, v)

    return g


def generate_scale_free_network(num_nodes: int = 18, m: int = 2, m_attach: int = None) -> Graph:
    """Generate a realistic Scale-Free Social Graph using Barabási-Albert preferential attachment."""
    if m_attach is not None:
        m = m_attach
    g = Graph(is_directed=False)

    initial = ["Node_1", "Node_2", "Node_3"]
    g.add_node("Node_1", "Influencer_Alpha", "Influencer", skepticism=0.25)
    g.add_node("Node_2", "Journalist_Beta", "Journalist", skepticism=0.75)
    g.add_node("Node_3", "FactChecker_Gamma", "Fact Checker", skepticism=0.90)
    g.add_edge("Node_1", "Node_2")
    g.add_edge("Node_2", "Node_3")
    g.add_edge("Node_3", "Node_1")

    for i in range(4, num_nodes + 1):
        new_id = f"User_{i}"
        role = "Bot" if i % 6 == 0 else "Standard User"
        g.add_node(new_id, new_id, role)

        existing = [n for n in g.get_nodes() if n != new_id]
        total_deg = sum(len(g.get_neighbors(n)) for n in existing)

        targets = set()
        attempts = 0
        while len(targets) < min(m, len(existing)) and attempts < 100:
            attempts += 1
            for node in existing:
                deg = len(g.get_neighbors(node))
                prob = (deg / total_deg) if total_deg > 0 else 0.5
                if random.random() < prob:
                    targets.add(node)
                    if len(targets) >= m:
                        break

        if not targets:
            targets = set(random.sample(existing, min(m, len(existing))))

        for t in targets:
            g.add_edge(new_id, t)

    return g


def generate_small_world_network(num_nodes: int = 18, k: int = 4, beta: float = 0.25) -> Graph:
    """Generate a Small-World Social Graph (Six Degrees of Separation) using Watts-Strogatz model."""
    g = Graph(is_directed=False)
    nodes = [f"Peer_{i}" for i in range(1, num_nodes + 1)]

    for i, node in enumerate(nodes):
        role = "Influencer" if i == 0 else ("Fact Checker" if i == len(nodes) - 1 else "Standard User")
        g.add_node(node, node, role)

    for i in range(num_nodes):
        for j in range(1, k // 2 + 1):
            target = nodes[(i + j) % num_nodes]
            g.add_edge(nodes[i], target)

    for i in range(num_nodes):
        for j in range(1, k // 2 + 1):
            if random.random() < beta:
                old_target = nodes[(i + j) % num_nodes]
                potential = [n for n in nodes if n != nodes[i] and not g.has_edge(nodes[i], n)]
                if potential:
                    new_target = random.choice(potential)
                    g.remove_edge(nodes[i], old_target)
                    g.add_edge(nodes[i], new_target)

    return g


# Aliases for backward compatibility in unit tests
create_star_network = create_botnet_network
create_linear_chain_network = create_whatsapp_chain_network


def list_preset_metadata() -> List[Dict[str, str]]:
    """Return catalog of available preset social networks with case study context."""
    return [
        {
            "id": "financial_panic",
            "name": "Case 1: Deepfake Financial Market Panic",
            "description": "Synthetic deepfake video causes automated trading bots to scrape and dump assets before SEC fact-checkers verify."
        },
        {
            "id": "election_echo",
            "name": "Case 2: Polarized Political Echo Chambers",
            "description": "Rumor is trapped inside Community Alpha until an undecided swing voter bridges the rumor to Community Beta."
        },
        {
            "id": "health_rumor",
            "name": "Case 3: Medical Misinformation & Fact-Checkers",
            "description": "Unverified wellness guru forwards false medical cure through WhatsApp family chains until doctor intercepts."
        },
        {
            "id": "botnet_campaign",
            "name": "Case 4: Coordinated Botnet Astroturfing (Star)",
            "description": "A single operative triggers a swarm of automated bots in a single burst, creating artificial virality."
        },
        {
            "id": "whatsapp_chain",
            "name": "Case 5: Viral WhatsApp Forwarding Chain (Directed)",
            "description": "Strict person-to-person chain showing identical traversal path in BFS and DFS."
        },
        {
            "id": "scale_free",
            "name": "⚡ Gen: Scale-Free Network (Barabási-Albert)",
            "description": "Generates a dynamic power-law social graph with mega-influencers and normal users using preferential attachment."
        },
        {
            "id": "small_world",
            "name": "⚡ Gen: Small-World Network (Watts-Strogatz)",
            "description": "Generates a network displaying high clustering and short path lengths (Six Degrees of Separation)."
        },
        {
            "id": "cyclic",
            "name": "Case 6: Cyclic Rumor Ring with Cross-Ties",
            "description": "Interconnected social ring demonstrating cycle prevention and cross-edge handling."
        },
        {
            "id": "disconnected",
            "name": "Case 7: Segmented Closed Communities",
            "description": "Disjoint social clusters demonstrating unreached nodes and firewall insulation."
        },
        {
            "id": "default",
            "name": "Case 8: Mixed Heterogeneous Social Network",
            "description": "Realistic network with 10 entities, influencers, bots, and verification bureaus."
        }
    ]
