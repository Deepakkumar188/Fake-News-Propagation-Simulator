"""Real-World Social Network Topologies & Case Study Scenarios.

Provides realistic social media misinformation scenarios:
1. Deepfake Financial Market Panic (HFT Bots, Traders, Fact-Checkers)
2. Polarized Political Echo Chambers (Partisan groups linked by Swing Voters)
3. Medical Misinformation & Miracle Cure Cascade (WhatsApp groups, Doctors)
4. Coordinated Botnet Astroturfing Campaign (Central operative and bots)
5. Viral WhatsApp Linear Forwarding Chain (One-way private forward hops)
6. Segmented Closed Communities (Disconnected campuses/clubs)
"""

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
    else:
        return create_default_network()


def create_financial_panic_network() -> Graph:
    """Real-World Case 1: Deepfake Financial Panic & Algo Trading Bots."""
    g = Graph(is_directed=False)

    users = [
        ("Deepfake_Seed", "Deepfake Tweet (Origin)", "Bot"),
        ("Crypto_Whale", "Crypto Influencer (5M)", "Influencer"),
        ("HFT_Algo_1", "HFT Scraping Bot A", "Bot"),
        ("HFT_Algo_2", "HFT Scraping Bot B", "Bot"),
        ("DayTrader_Forum", "Day Trader Discord Group", "Standard User"),
        ("Retail_Investor_X", "Retail Investor", "Standard User"),
        ("Market_Journalist", "Financial News Anchor", "Journalist"),
        ("WallSt_Fund", "Hedge Fund Desk", "Standard User"),
        ("SEC_FactCheck", "SEC Official Fact-Checker", "Fact Checker")
    ]
    for uid, label, role in users:
        g.add_node(uid, label=label, role=role)

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

    # Chamber A (Community Alpha)
    g.add_node("Partisan_Alpha_Lead", "Partisan Media Alpha (Seed)", "Influencer")
    g.add_node("Alpha_Activist_1", "Alpha Supporter #1", "Standard User")
    g.add_node("Alpha_Activist_2", "Alpha Supporter #2", "Standard User")
    g.add_node("Alpha_Discussion", "Alpha Discussion Forum", "Standard User")

    g.add_edge("Partisan_Alpha_Lead", "Alpha_Activist_1")
    g.add_edge("Partisan_Alpha_Lead", "Alpha_Activist_2")
    g.add_edge("Alpha_Activist_1", "Alpha_Activist_2")
    g.add_edge("Alpha_Activist_2", "Alpha_Discussion")
    g.add_edge("Alpha_Activist_1", "Alpha_Discussion")

    # Bridge Node (Undecided Swing Voter)
    g.add_node("Swing_Voter_Bridge", "Undecided Swing Voter (Bridge)", "Standard User")
    g.add_edge("Alpha_Discussion", "Swing_Voter_Bridge")

    # Chamber B (Community Beta)
    g.add_node("Partisan_Beta_Lead", "Partisan Media Beta", "Influencer")
    g.add_node("Beta_Activist_1", "Beta Supporter #1", "Standard User")
    g.add_node("Beta_Activist_2", "Beta Supporter #2", "Standard User")
    g.add_node("Beta_Discussion", "Beta Discussion Forum", "Standard User")

    g.add_edge("Swing_Voter_Bridge", "Beta_Discussion")
    g.add_edge("Beta_Discussion", "Beta_Activist_1")
    g.add_edge("Beta_Discussion", "Beta_Activist_2")
    g.add_edge("Beta_Activist_1", "Beta_Activist_2")
    g.add_edge("Beta_Activist_2", "Partisan_Beta_Lead")

    # Independent Fact Checker
    g.add_node("Election_FactChecker", "Independent Fact-Checker", "Fact Checker")
    g.add_edge("Swing_Voter_Bridge", "Election_FactChecker")

    return g


def create_health_rumor_network() -> Graph:
    """Real-World Case 3: Medical Misinformation & Miracle Cure Cascade."""
    g = Graph(is_directed=False)

    users = [
        ("Fake_Guru", "Unverified Wellness Guru (Seed)", "Influencer"),
        ("WhatsApp_MomGroup", "School Parents WhatsApp Group", "Standard User"),
        ("Neighborhood_Admin", "Residential Community Admin", "Standard User"),
        ("Family_Elder_Chat", "Family Elders WhatsApp Group", "Standard User"),
        ("TikTok_Vlogger", "Lifestyle Video Creator", "Standard User"),
        ("HighSchool_Student", "Teen Student Account", "Standard User"),
        ("Local_Physician", "Family Doctor (MD)", "Fact Checker"),
        ("PublicHealth_Agency", "Hospital Public Health Desk", "Fact Checker")
    ]
    for uid, label, role in users:
        g.add_node(uid, label=label, role=role)

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

    g.add_node("Celebrity", "Disinformation Operative (Seed)", "Influencer")
    
    for i in range(1, 9):
        bot_id = f"Follower_{i}"
        g.add_node(bot_id, label=f"Coordinated Bot #{i}", role="Bot")
        g.add_edge("Celebrity", bot_id)

    return g


def create_whatsapp_chain_network() -> Graph:
    """Real-World Case 5: 6-Hop Viral WhatsApp Forwarding Chain (Directed)."""
    g = Graph(is_directed=True)
    chain = [
        ("Origin_A", "Anonymous Audio Clip (Seed)", "Bot"),
        ("User_B", "Family WhatsApp Chat", "Standard User"),
        ("User_C", "College Alumni Group", "Standard User"),
        ("User_D", "Work Office Chat", "Standard User"),
        ("User_E", "Housing Society Group", "Standard User"),
        ("User_F", "Local Store Group", "Standard User")
    ]
    for uid, label, role in chain:
        g.add_node(uid, label=label, role=role)

    for i in range(len(chain) - 1):
        g.add_edge(chain[i][0], chain[i + 1][0])

    return g


def create_cyclic_network() -> Graph:
    """Cyclic Gossip Ring with cross-cutting chord edges."""
    g = Graph(is_directed=False)
    ring = [f"Peer_{i}" for i in range(1, 7)]
    for node in ring:
        g.add_node(node, label=node, role="Standard User")

    for i in range(len(ring)):
        g.add_edge(ring[i], ring[(i + 1) % len(ring)])

    # Add cross-chords
    g.add_edge("Peer_1", "Peer_4")
    g.add_edge("Peer_2", "Peer_5")

    return g


def create_disconnected_network() -> Graph:
    """Disconnected graph with two separate subgraphs and an isolated singleton."""
    g = Graph(is_directed=False)
    
    # Campus Alpha (Component 1)
    for i in ["Alpha_1", "Alpha_2", "Alpha_3", "Alpha_4"]:
        g.add_node(i, label=i, role="Standard User")
    g.add_edge("Alpha_1", "Alpha_2")
    g.add_edge("Alpha_2", "Alpha_3")
    g.add_edge("Alpha_3", "Alpha_4")
    g.add_edge("Alpha_4", "Alpha_1")

    # Campus Beta (Component 2 - disconnected from Alpha)
    for i in ["Beta_1", "Beta_2", "Beta_3"]:
        g.add_node(i, label=i, role="Standard User")
    g.add_edge("Beta_1", "Beta_2")
    g.add_edge("Beta_2", "Beta_3")

    # Singleton Node (Totally isolated)
    g.add_node("Isolated_User", label="Isolated (Offline Citizen)", role="Standard User")

    return g


def create_default_network() -> Graph:
    """Default Heterogeneous Network with 10 Real-World Entities."""
    g = Graph(is_directed=False)
    
    users = [
        ("Alice_Influencer", "Alice (Lifestyle Influencer)", "Influencer"),
        ("Bob_Journalist", "Bob (Investigative Reporter)", "Journalist"),
        ("Charlie_Trader", "Charlie (Finance Trader)", "Standard User"),
        ("David_Student", "David (Tech Student)", "Standard User"),
        ("Emma_Parent", "Emma (Community Moderator)", "Standard User"),
        ("Frank_FactCheck", "Frank (Fact-Checking Bureau)", "Fact Checker"),
        ("Grace_Botnet", "Grace (Automated Retweet Bot)", "Bot"),
        ("Henry_Analyst", "Henry (Data Analyst)", "Standard User"),
        ("Ivy_Researcher", "Ivy (Policy Researcher)", "Standard User"),
        ("Jack_Offline", "Jack (Isolated Account)", "Standard User")
    ]
    for uid, label, role in users:
        g.add_node(uid, label=label, role=role)

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
