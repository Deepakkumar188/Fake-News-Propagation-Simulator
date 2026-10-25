"""Flask Application Server for the Fake News Propagation Simulator.

Exposes RESTful endpoints for graph manipulation, algorithmic simulations (BFS/DFS),
and comparative traversal analysis.
"""

import os
from flask import Flask, render_template, request, jsonify
from core.graph import Graph
from core.algorithms import simulate_bfs, simulate_dfs, compare_algorithms, simulate_race
from core.presets import get_preset_network, list_preset_metadata

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
    """Run BFS or DFS on the client-provided graph and return step log.
    
    Expected JSON Payload:
        {
            "graph": { "nodes": [...], "edges": [...], "is_directed": bool },
            "source": "Alice",
            "algorithm": "BFS" | "DFS"
        }
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON payload provided."}), 400

    graph_data = data.get("graph")
    source = data.get("source")
    algorithm = data.get("algorithm", "BFS").upper().strip()

    if not graph_data or not graph_data.get("nodes"):
        return jsonify({"error": "Graph cannot be empty. Please add at least one user."}), 400

    if not source:
        return jsonify({"error": "Please select a valid source user (Patient Zero)."}), 400

    try:
        graph = Graph.from_dict(graph_data)
        
        if not graph.has_node(source):
            return jsonify({"error": f"Source user '{source}' does not exist in the current network."}), 400

        if algorithm == "BFS":
            result = simulate_bfs(graph, source)
        elif algorithm == "DFS":
            result = simulate_dfs(graph, source)
        else:
            return jsonify({"error": f"Unsupported algorithm '{algorithm}'. Must be BFS or DFS."}), 400

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


@app.route("/api/compare", methods=["POST"])
def compare():
    """Run both BFS and DFS side-by-side on the provided graph and return comparisons.
    
    Expected JSON Payload:
        {
            "graph": { "nodes": [...], "edges": [...], "is_directed": bool },
            "source": "Alice"
        }
    """
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
    # Host on 127.0.0.1:5000 for local development and demonstration
    port = int(os.environ.get("PORT", 5000))
    app.run(host="127.0.0.1", port=port, debug=True)
