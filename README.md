# Fake News Propagation Simulator

An interactive simulation and visualization platform modeling the diffusion of misinformation across social networks using fundamental Graph Data Structures and Graph Traversal Algorithms (**Breadth-First Search** and **Depth-First Search**).

---

## 1. Project Overview & Motivation

* **Domain:** Social Network Analysis & Algorithmic Diffusion Dynamics
* **Core DSA Concepts:** Graph Theory, Adjacency Lists, Breadth-First Search (BFS), Depth-First Search (DFS), FIFO Queue (`collections.deque`), LIFO Stack, Visited Sets, Cycle Trapping, and Connected Components.
* **Core Insight:** In a networked society, information (or misinformation) does not spread randomly; it cascades along network edges.
  - **BFS** models **viral mass broadcast** (level-by-level concentric rings).
  - **DFS** models **targeted whisper chains** (deep penetration into a single branch before backtracking).

---

## 2. System Architecture & Features

```
+-----------------------------------------------------------------------------------------+
|                                    BROWSER CLIENT                                       |
|  [ vis.js Network Canvas ]  <--->  [ Simulation Controller ]  <--->  [ Queue/Stack Vis ] |
|            ^                                     ^                                      |
+------------|-------------------------------------|--------------------------------------+
             | (User Interactions)                 | (HTTP REST JSON Stream)
             v                                     v
+-----------------------------------------------------------------------------------------+
|                                  FLASK BACKEND ENGINE                                   |
|   /api/simulate (BFS/DFS)  |  /api/compare (Side-by-Side)  |  /api/preset/<id> (Catalog) |
|                                          |                                              |
|                                          v                                              |
|                      [ core/graph.py : Adjacency List ]                                 |
|                      [ core/algorithms.py : Step Recorder ]                             |
+-----------------------------------------------------------------------------------------+
```

### Key Features
1. **Interactive Network Canvas:** Force-directed node layout (vis.js), draggable users, dynamic edge links.
2. **Step-by-Step Time-Travel Playback:** Play, Pause, Step Next, Step Prev, Speed Slider (150ms - 1800ms), and Reset.
3. **Live Data Structure Inspector:** Visible physical representation of the **FIFO Queue** (with FRONT and REAR pointers) or **LIFO Stack** (with TOP pointer) pushing and popping elements in real time.
4. **Pedagogical Step Explanations:** Real-time plain-English commentary for every atomic step (Enqueue, Dequeue, Visit, Cycle Skip, Backtrack).
5. **Pre-Configured Educational Topologies:**
   - *Viral Influencer (Star Topology)*: Demonstrates immediate BFS fan-out.
   - *Echo Chambers & Bridge*: Shows information bottlenecking between polarized communities.
   - *Linear Whisper Chain*: Shows where BFS and DFS produce identical sequences.
   - *Cyclic Gossip Ring*: Demonstrates cycle prevention and cross-edges.
   - *Disconnected Communities*: Demonstrates unreached vertices and isolated subgraphs.
6. **BFS vs DFS Comparative Analysis:** Side-by-side metric table showing total steps, peak queue width vs peak stack depth, shortest-hop accuracy, and traversal orders.
7. **Graph Editor:** Add users, assign social roles (Influencer, Journalist, Fact-Checker, Bot), connect edges, delete nodes.

---

## 3. Directory Structure

```
fake_news_simulator/
├── core/
│   ├── __init__.py
│   ├── graph.py             # Adjacency List Graph representation & graph metrics
│   ├── algorithms.py        # BFS, DFS simulation engines with micro-step logging
│   └── presets.py           # Pre-built benchmark social topologies
├── static/
│   ├── css/
│   │   └── style.css        # High-contrast modern academic dark theme
│   └── js/
│       ├── network.js       # vis.js graph visualizer & state styler
│       ├── data_structures.js # Visualizer for FIFO Queue and LIFO Stack
│       ├── simulation.js    # Simulation playback state machine
│       └── app.js           # UI dispatcher & API bridge
├── templates/
│   └── index.html           # Single-page simulation dashboard
├── tests/
│   ├── test_graph.py        # 7 unit tests for Graph methods
│   └── test_algorithms.py   # 6 unit tests for BFS, DFS, cycles, disconnected
├── app.py                   # Flask server entrypoint (port 5000)
├── requirements.txt         # Minimal dependency: Flask>=3.0.0
└── README.md                # Project documentation & run guide
```

---

## 4. Algorithmic Complexity Analysis

### Time Complexity: $\mathcal{O}(V + E)$
- **Vertex Operations:** Every reachable vertex is enqueued/pushed once and dequeued/popped once: $\mathcal{O}(V)$.
- **Edge Operations:** For an Adjacency List, each edge $(u, v)$ is traversed when inspecting $\text{Adj}[u]$:
  $$\sum_{u \in V} \text{deg}(u) \le 2E \implies \mathcal{O}(E)$$
  Total time is strictly bounded by $\mathcal{O}(V + E)$.

### Space Complexity: $\mathcal{O}(V)$
- **Adjacency List:** $\mathcal{O}(V + E)$
- **Auxiliary Traversal Memory:** $\mathcal{O}(V)$ for the `queue` (BFS) or `stack` (DFS), plus $\mathcal{O}(V)$ for the `visited` set and `levels` dictionary.

---

## 5. Setup and Execution (Windows & VS Code)

### Prerequisites
- Python 3.10+ installed
- Web browser (Chrome, Edge, Firefox)

### Step 1: Open in VS Code
Open the project directory in VS Code:
```powershell
cd "C:\Users\Deepak Kumar\.gemini\antigravity\scratch\fake_news_simulator"
code .
```

### Step 2: (Optional) Create & Activate Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### Step 3: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step 4: Run the Unit Test Suite
Verify that all 13 core DSA tests pass:
```powershell
python -m unittest discover tests
```

### Step 5: Start the Application Server
```powershell
python app.py
```
Output:
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

### Step 6: Open in Browser
Open your browser and navigate to:
```
http://127.0.0.1:5000
```
