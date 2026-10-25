# INFOCASCADE // Fake News Propagation & Network Diffusion Simulator
**Enterprise v2.8** | Real-Time Misinformation Diffusion, Counter-Disinformation Defense & Network Forensics Platform

[![Tests](https://img.shields.io/badge/Unit%20Tests-18%20Passing-10b981?style=flat-square)](tests/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-00f2fe?style=flat-square)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0%2B-f43f5e?style=flat-square)](https://flask.palletsprojects.com/)
[![Complexity](https://img.shields.io/badge/Complexity-%CE%9F(V%20%2B%20E)-8b5cf6?style=flat-square)](#algorithmic-complexity-analysis)

---

## 1. Project Overview & Core Insight

**INFOCASCADE** models how misinformation, rumors, and truth propagate through modern social networks using fundamental Graph Theory, Data Structures, and Algorithmic Dynamics.

* **Mass Viral Diffusion (BFS):** Models omnidirectional broadcast wavefronts radiating hop-by-hop across concentric levels using a **FIFO Queue** (`collections.deque`), guaranteeing minimum hop distance.
* **Targeted Whisper Cascades (DFS):** Models deep personal echo chains plunging into downstream branches using a **LIFO Stack** before backtracking upon encountering cycle traps or dead-ends.
* **Dual-Wave Counter Defense (Race Mode):** Simulates real-time multi-source races between rumor propagation and verification bureau counter-evidence.
* **Super-Spreader PageRank Centrality:** Power-iteration eigenvector influence calculation with damping factor $\alpha = 0.85$ to detect and visually scale critical transmission hubs.
* **AI Skepticism Thresholds:** Entity-level skepticism modeling where nodes resist infection if node skepticism exceeds rumor virality ($S_u > V$).

---

## 2. Advanced Feature Suite

### 👑 1. Super-Spreader Detection (PageRank & Centrality Analysis)
- Computes **PageRank** ($\alpha = 0.85$, 35 power iterations) and normalized degree connectivity for every entity.
- Generates an **Influence / Vulnerability Index** $(0 - 100)$.
- **Dynamic Node Sizing:** High-influence accounts dynamically scale from $18\text{px}$ up to $44\text{px}$ with glowing amber borders on the interactive canvas.

### 🧬 2. AI Susceptibility & Skepticism Threshold Modeling
- Interactive **Rumor Virality Slider** ($10\% - 100\%$).
- Nodes possess individual skepticism indices $[0.0, 1.0]$.
- When virality falls below an entity's skepticism, propagation is rejected, logging a `RESISTED_SKEPTIC` defense event and turning the entity into an amber shield node.

### ⚡ 3. Dynamic Complex Network Generators
- **Barabási–Albert Scale-Free Generator:** Dynamically creates power-law degree networks with preferential attachment (rich-get-richer dynamics), demonstrating how targeting hubs collapses cascades.
- **Watts–Strogatz Small-World Generator:** Synthesizes networks with high clustering coefficients and short path lengths (Six Degrees of Separation effect).

### 📄 4. One-Click Forensic Intelligence Dossier Export
- Generates an executive, printable incident audit report with a single click.
- Features **Classification Banner**, **Executive Statistics Grid**, **Top Super-Spreader Table**, and **Step-by-Step Chronological Vector Trace**.
- Clean `@media print` layout engineered for physical paper and PDF generation.
- **Export JSON Evidence:** Downloadable structured telemetry log.

### 🌓 5. Dual-Theme Interface & Live Temporal S-Curve
- Seamless instant toggle between **Cyber-Intelligence Dark Mode** and **Crisp Light Mode**.
- Integrated **Chart.js** real-time temporal diffusion curve (S-Curve) plotting infected, inoculated, and debunked entities over time.

---

## 3. System Architecture

```
+-----------------------------------------------------------------------------------------+
|                                    BROWSER CLIENT                                       |
|  [ vis.js Network Canvas ]  <--->  [ Simulation Controller ]  <--->  [ Chart.js S-Curve ]|
|  [ PageRank Node Sizer ]   <--->  [ FIFO / LIFO Buffers ]    <--->  [ Printable Dossier ]|
+--------------------------------------------|--------------------------------------------+
                                             | (REST JSON API)
                                             v
+-----------------------------------------------------------------------------------------+
|                                  FLASK BACKEND ENGINE                                   |
|   /api/simulate (BFS/DFS + Virality)  |  /api/simulate/race (Multi-Source Defense)      |
|   /api/analytics/centrality (PageRank)|  /api/presets (Case Studies & Complex Gen)      |
|                                            |                                            |
|                                            v                                            |
|                        [ core/graph.py : Adjacency List ]                               |
|                        [ core/algorithms.py : Traversal & Centrality ]                  |
|                        [ core/presets.py : Topologies & Complex Graphs ]                |
+-----------------------------------------------------------------------------------------+
```

---

## 4. Algorithmic Complexity

| Component | Time Complexity | Auxiliary Space Complexity | Data Structure |
| :--- | :--- | :--- | :--- |
| **BFS Traversal** | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | FIFO Queue (`collections.deque`) |
| **DFS Traversal** | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | LIFO Stack (`list`) |
| **Race Traversal** | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | Dual FIFO Wavefronts |
| **PageRank Power Iteration** | $\mathcal{O}(k \cdot (V + E))$ | $\mathcal{O}(V)$ | Vector Float Register ($k = 35$) |
| **Graph Adjacency Storage** | $\mathcal{O}(1)$ edge lookup | $\mathcal{O}(V + E)$ | Sparse Hash Map of Hash Sets |

---

## 5. Directory Structure

```
fake_news_simulator/
├── core/
│   ├── __init__.py
│   ├── graph.py             # Sparse Adjacency List graph representation
│   ├── algorithms.py        # BFS, DFS, Race, PageRank & Centrality algorithms
│   └── presets.py           # Real-world case studies & complex network generators
├── static/
│   ├── css/
│   │   └── style.css        # Dual-theme cyber styles & @media print stylesheet
│   └── js/
│       ├── network.js       # vis.js graph manager & PageRank dynamic sizer
│       ├── data_structures.js # FIFO Queue & LIFO Stack physical memory visualizer
│       ├── simulation.js    # Simulation playback state machine & S-Curve Chart.js
│       └── app.js           # UI dispatcher, Virality slider & Dossier modal
├── templates/
│   └── index.html           # Command deck, network canvas & forensic dossier modal
├── tests/
│   ├── test_graph.py        # 7 unit tests for graph structures
│   └── test_algorithms.py   # 11 unit tests for BFS, DFS, Race, PageRank, and Generators
├── app.py                   # Flask REST server
├── requirements.txt         # Minimal dependency: Flask>=3.0.0
└── README.md                # Documentation & quickstart guide
```

---

## 6. Quickstart Guide

### Prerequisites
- Python 3.10 or higher
- Modern web browser (Chrome, Edge, Firefox, Safari)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Deepakkumar188/Fake-News-Propagation-Simulator.git
   cd Fake-News-Propagation-Simulator
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Execute Unit Tests (18 passing):**
   ```bash
   python -m unittest discover tests
   ```

4. **Launch the Simulation Dashboard:**
   ```bash
   python app.py
   ```

5. **Open in Browser:**
   Navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000).

---

## 7. Real-World Case Studies Included

1. **Case 1: Deepfake Financial Market Panic:** Algorithmic trading bots scrape synthetic videos and panic-dump assets before SEC verification.
2. **Case 2: Polarized Political Echo Chambers:** Disinformation trapped in partisan clusters bridged by undecided swing voters.
3. **Case 3: Medical Misinformation:** Unverified cures in private chat groups intercepted by certified physicians.
4. **Case 4: Coordinated Botnet Astroturfing:** Central operative detonating a star cluster of automated bot accounts simultaneously.
5. **Case 5: Viral WhatsApp Forwarding Chain:** Linear whisper forward vector showing identical BFS and DFS sequence.
6. **Case 6: Cyclic Rumor Ring with Cross-Ties:** Interconnected community testing cycle detection and loop immunity.
7. **Case 7: Segmented Closed Communities:** Disconnected subgraphs demonstrating network insulation and unreached components.
8. **⚡ Scale-Free Network (Barabási-Albert):** Power-law hub network generated using preferential attachment.
9. **⚡ Small-World Network (Watts-Strogatz):** High clustering and short characteristic path length network.
