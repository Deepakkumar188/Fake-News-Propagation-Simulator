"""Flask Application Server for the Fake News Propagation Simulator.

Exposes RESTful endpoints for graph manipulation, algorithmic simulations (BFS/DFS/SIR),
dual-wave rumor vs truth race, super-spreader centrality analytics, automated firewall containment,
community detection, AI headline credibility NLP analysis, and comparative traversal analysis.
"""

import os
from flask import Flask, render_template, request, jsonify
from core.graph import Graph
from core.algorithms import (
    simulate_bfs,
    simulate_dfs,
    simulate_sir,
    compare_algorithms,
    simulate_race,
    compute_centrality,
    calculate_optimal_containment,
    detect_communities
)
from core.presets import get_preset_network, list_preset_metadata
from core.credibility_analyzer import analyze_news_credibility

app = Flask(__name__, template_folder="templates", static_folder="static")
app.config["SECRET_KEY"] = os.urandom(24)


@app.route("/")
def index():
    """Render the main simulation dashboard."""
    return render_template("index.html")


@app.route("/api/health", methods=["GET"])
def health_check():
    """Healthcheck endpoint."""
    return jsonify({"status": "healthy", "service": "fake-news-propagation-simulator"})


@app.route("/api/presets", methods=["GET"])
def get_presets():
    """Return catalog of available preset social networks."""
    return jsonify(list_preset_metadata())


@app.route("/api/preset/<preset_id>", methods=["GET"])
def load_preset(preset_id):
    """Return graph data for a specific preset topology."""
    try:
        graph = get_preset_network(preset_id)
        return jsonify(graph.to_dict())
    except Exception as e:
        return jsonify({"error": f"Failed to load preset: {str(e)}"}), 400


@app.route("/api/simulate", methods=["POST"])
def simulate():
    """Run BFS, DFS, or SIR on the client-provided graph and return step log.
    
    Expected JSON Payload:
        {
            "graph": { "nodes": [...], "edges": [...], "is_directed": bool },
            "source": "Alice",
            "algorithm": "BFS" | "DFS" | "SIR",
            "virality": 0.75
        }
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON payload provided."}), 400

    graph_data = data.get("graph")
    source = data.get("source")
    algorithm = data.get("algorithm", "BFS").upper().strip()
    try:
        virality = float(data.get("virality", 0.75))
    except (ValueError, TypeError):
        virality = 0.75

    if not graph_data or not graph_data.get("nodes"):
        return jsonify({"error": "Graph cannot be empty. Please add at least one user."}), 400

    if not source:
        return jsonify({"error": "Please select a valid source user (Patient Zero)."}), 400

    try:
        graph = Graph.from_dict(graph_data)
        
        if not graph.has_node(source):
            return jsonify({"error": f"Source user '{source}' does not exist in the current network."}), 400

        if algorithm == "BFS":
            result = simulate_bfs(graph, source, virality=virality)
        elif algorithm == "DFS":
            result = simulate_dfs(graph, source, virality=virality)
        elif algorithm == "SIR":
            result = simulate_sir(graph, source, virality=virality)
        else:
            return jsonify({"error": f"Unsupported algorithm '{algorithm}'. Must be BFS, DFS, or SIR."}), 400

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/simulate/race", methods=["POST"])
def simulate_race_endpoint():
    """Run dual-wave Rumor vs Fact-Checker race on the provided graph."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON payload provided."}), 400

    graph_data = data.get("graph")
    rumor_source = data.get("rumor_source")
    fact_source = data.get("fact_source")
    delay = int(data.get("delay", 1))

    if not graph_data or not graph_data.get("nodes"):
        return jsonify({"error": "Graph cannot be empty."}), 400

    if not rumor_source or not fact_source:
        return jsonify({"error": "Both rumor origin and fact-checker origin are required."}), 400

    try:
        graph = Graph.from_dict(graph_data)
        result = simulate_race(graph, rumor_source, fact_source, delay)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/analytics/centrality", methods=["POST"])
def analyze_centrality():
    """Calculate PageRank and degree centrality for network nodes."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON payload provided."}), 400

    graph_data = data.get("graph", data)
    if not graph_data or not graph_data.get("nodes"):
        return jsonify({"error": "Graph cannot be empty."}), 400

    try:
        graph = Graph.from_dict(graph_data)
        metrics = compute_centrality(graph)
        return jsonify(metrics)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/defense/optimal-cut", methods=["POST"])
def analyze_optimal_cut():
    """Calculate the most impactful edge/node cuts to prevent viral diffusion from source."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON payload provided."}), 400

    graph_data = data.get("graph")
    source = data.get("source")
    budget = int(data.get("budget", 2))

    if not graph_data or not graph_data.get("nodes"):
        return jsonify({"error": "Graph cannot be empty."}), 400

    if not source:
        return jsonify({"error": "Please provide a rumor source."}), 400

    try:
        graph = Graph.from_dict(graph_data)
        cuts = calculate_optimal_containment(graph, source, budget=budget)
        return jsonify(cuts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/analytics/communities", methods=["POST"])
def analyze_communities():
    """Detect echo-chamber communities and bridge nodes connecting them."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON payload provided."}), 400

    graph_data = data.get("graph", data)
    if not graph_data or not graph_data.get("nodes"):
        return jsonify({"error": "Graph cannot be empty."}), 400

    try:
        graph = Graph.from_dict(graph_data)
        res = detect_communities(graph)
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/ai/analyze-headline", methods=["POST"])
def analyze_headline():
    """Analyze a news headline for misinformation linguistic markers and virality."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON payload provided."}), 400

    headline = data.get("headline", "")
    try:
        report = analyze_news_credibility(headline)
        return jsonify(report)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/compare", methods=["POST"])
def compare():
    """Run both BFS and DFS side-by-side on the provided graph and return comparisons."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON payload provided."}), 400

    graph_data = data.get("graph")
    source = data.get("source")

    if not graph_data or not graph_data.get("nodes"):
        return jsonify({"error": "Graph cannot be empty."}), 400

    if not source:
        return jsonify({"error": "Please select a valid source user."}), 400

    try:
        graph = Graph.from_dict(graph_data)
        
        if not graph.has_node(source):
            return jsonify({"error": f"Source user '{source}' does not exist in the network."}), 400

        comparison = compare_algorithms(graph, source)
        return jsonify(comparison)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/graph/validate", methods=["POST"])
def validate_graph():
    """Inspect and return structural properties of the client graph."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON payload provided."}), 400

    try:
        graph = Graph.from_dict(data)
        degrees = graph.get_degrees()
        components = graph.get_connected_components()
        
        return jsonify({
            "valid": True,
            "vertex_count": graph.get_node_count(),
            "edge_count": graph.get_edge_count(),
            "is_directed": graph.is_directed,
            "connected_components_count": len(components),
            "components": components,
            "degrees": degrees
        })
    except Exception as e:
        return jsonify({"valid": False, "error": str(e)}), 400


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="127.0.0.1", port=port, debug=True)
