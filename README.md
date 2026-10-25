# INFOCASCADE // Fake News Propagation & Network Diffusion Simulator
**Enterprise v2.9** | Real-Time Misinformation Diffusion, Counter-Disinformation Defense & Network Forensics Platform

[![Tests](https://img.shields.io/badge/Unit%20Tests-21%20Passing-10b981?style=flat-square)](tests/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-00f2fe?style=flat-square)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0%2B-f43f5e?style=flat-square)](https://flask.palletsprojects.com/)
[![Complexity](https://img.shields.io/badge/Complexity-%CE%9F(V%20%2B%20E)-8b5cf6?style=flat-square)](#algorithmic-complexity-analysis)

---

## 1. Project Overview & Core Insight

**INFOCASCADE** models how misinformation, rumors, and truth propagate through modern social networks using fundamental Graph Theory, Data Structures, and Algorithmic Dynamics.

* **Mass Viral Diffusion (BFS):** Models omnidirectional broadcast wavefronts radiating hop-by-hop across concentric levels using a **FIFO Queue** (`collections.deque`), guaranteeing minimum hop distance.
* **Targeted Whisper Cascades (DFS):** Models deep personal echo chains plunging into downstream branches using a **LIFO Stack** before backtracking upon encountering cycle traps or dead-ends.
* **Dual-Wave Counter Defense (Race Mode):** Simulates real-time multi-source races between rumor propagation and verification bureau counter-evidence.
* **Epidemiology of Information (SIR Model):** Models compartmental diffusion ($S \to I \to R$) where users contract rumors, share them, and eventually recover or gain immunity.
* **Super-Spreader PageRank Centrality:** Power-iteration eigenvector influence calculation with damping factor $\alpha = 0.85$ to detect and visually scale critical transmission hubs.
* **AI Skepticism Thresholds:** Entity-level skepticism modeling where nodes resist infection if node skepticism exceeds rumor virality ($S_u > V$).

---

## 2. Advanced Feature Suite

### 🔬 1. SIR / SIS Epidemic Diffusion Model
- Implements Kermack-McKendrick mathematical epidemiology: Susceptible ($S$) $\to$ Infected ($I$) $\to$ Recovered ($R$).
- Models natural rumor burnout and debunking: nodes actively recover with recovery probability $\gamma$, becoming permanently immune to re-infection.
- Dedicated multi-line Chart.js curves tracking $S$, $I$, and $R$ trajectories across discrete epochs.

### 🛡️ 2. AI Auto-Firewall / Optimal Min-Cut Cascade Blocker
- Graph-theoretic **Minimum Cut / Bridge Disruption** optimizer.
- Analyzes all network vectors to compute the exact minimum-cost cuts that insulate the maximum percentage of downstream entities.
- One-click execution severs optimal bottleneck links and immediately prevents epidemic saturation.

### 🔍 3. Interactive Entity Deep-Inspector
- Click any node on the interactive network canvas to open the **Entity Intel Drawer**.
- Displays real-time In/Out Degree, PageRank influence score, and Cascade Risk rating.
- Live tuning of individual **AI Skepticism Index** ($0\% - 100\%$) and Social Role.
- One-click tactical interventions: **Force Infect**, **Inoculate (Vaccinate)**, or **Sever Incident Vectors**.

### 🧩 4. Automated Community Detection (Echo-Chamber Modularity)
- Uses fast **Label Propagation Algorithm (LPA)** to discover naturally formed partisan clusters.
- Automatic distinct color shading for each echo chamber.
- Specifically isolates and highlights **Bridge Nodes & Bridge Vectors** that connect polarized communities across partisan divides.

### 🔊 5. Cyber-Telemetry Web Audio API Synthesizer
- Programmatic, zero-dependency audio synthesizer creating subtle futuristic acoustic feedback.
- Dedicated synthesized tones for Infection Spread, Truth Inoculation, Defense Shield Resistance, and Entity Recovery.
- Full Mute/Unmute state persistence with `localStorage`.

### 👑 6. Super-Spreader Detection (PageRank & Centrality Analysis)
- Power-iteration PageRank with normalized degree connectivity to compute an Influence / Vulnerability Index ($0 - 100$).
- **Dynamic Node Sizing:** High-influence accounts dynamically scale from $18\text{px}$ up to $44\text{px}$ with glowing amber borders.

### ⚡ 7. Dynamic Complex Network Generators
- **Barabási–Albert Scale-Free Generator:** Generates power-law hub networks via preferential attachment (rich-get-richer dynamics).
- **Watts–Strogatz Small-World Generator:** Synthesizes high-clustering, short characteristic path length topologies (Six Degrees of Separation effect).

### 📄 8. One-Click Forensic Intelligence Dossier Export
- Generates an executive, printable incident audit report with a single click.
- Clean `@media print` layout engineered for physical paper and PDF generation, plus raw JSON evidence export.

---

## 3. Algorithmic Complexity

| Component | Time Complexity | Auxiliary Space Complexity | Data Structure |
| :--- | :--- | :--- | :--- |
| **BFS Traversal** | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | FIFO Queue (`collections.deque`) |
| **DFS Traversal** | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | LIFO Stack (`list`) |
| **Race Traversal** | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | Dual FIFO Wavefronts |
| **SIR Traversal** | $\mathcal{O}(\text{epochs} \cdot (V + E))$ | $\mathcal{O}(V)$ | Compartmental Hash Sets ($S, I, R$) |
| **PageRank Power Iteration** | $\mathcal{O}(k \cdot (V + E))$ | $\mathcal{O}(V)$ | Vector Float Register ($k = 35$) |
| **Optimal Cut Analysis** | $\mathcal{O}(E \cdot (V + E))$ | $\mathcal{O}(V)$ | Candidate BFS Evaluators |
| **Community Detection (LPA)**| $\mathcal{O}(k \cdot (V + E))$ | $\mathcal{O}(V)$ | Label Hash Register ($k = 10$) |
| **Graph Adjacency Storage** | $\mathcal{O}(1)$ edge lookup | $\mathcal{O}(V + E)$ | Sparse Hash Map of Hash Sets |

---

## 4. Directory Structure

```
fake_news_simulator/
├── core/
│   ├── __init__.py
│   ├── graph.py             # Sparse Adjacency List graph representation
│   ├── algorithms.py        # BFS, DFS, Race, SIR, PageRank, Optimal Cut & LPA
│   └── presets.py           # Real-world case studies & complex network generators
├── static/
│   ├── css/
│   │   └── style.css        # Dual-theme cyber styles & @media print stylesheet
│   └── js/
│       ├── audio.js         # Pure Web Audio API futuristic sound synthesizer
│       ├── network.js       # vis.js graph manager, PageRank & community styler
│       ├── data_structures.js # FIFO Queue & LIFO Stack physical memory visualizer
│       ├── simulation.js    # Simulation playback state machine & S-Curve Chart.js
│       └── app.js           # UI dispatcher, Virality slider, Inspector & Dossier
├── templates/
│   └── index.html           # Command deck, network canvas, inspector & dossier modal
├── tests/
│   ├── test_graph.py        # 7 unit tests for graph structures
│   └── test_algorithms.py   # 14 unit tests for BFS, DFS, Race, SIR, Centrality, LPA
├── app.py                   # Flask REST server (port 5000)
├── requirements.txt         # Minimal dependency: Flask>=3.0.0
└── README.md                # Documentation & quickstart guide
```

---

## 5. Quickstart Guide

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

3. **Execute Unit Tests (21 passing):**
   ```bash
   python -m unittest discover tests
   ```

4. **Launch the Simulation Dashboard:**
   ```bash
   python app.py
   ```

5. **Open in Browser:**
   Navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000).
