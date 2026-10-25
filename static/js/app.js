/**
 * Main Application Controller for INFOCASCADE.
 * Handles UI interactions, API endpoints, visualization canvas,
 * Dual-Theme toggle, Real-World Case Studies, and Truth vs Rumor Race mode.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Visualizers & Simulation Engine
    const networkVis = new NetworkVisualizer('network-canvas');
    const dsVis = new DataStructureVisualizer('ds-visualizer', 'ds-title', 'ds-mode-badge');
    const simCtrl = new SimulationController(networkVis, dsVis);

    // 2. DOM Elements
    const algorithmSelect = document.getElementById('algorithm-select');
    const sourceSelect = document.getElementById('source-select');
    const factSourcePod = document.getElementById('fact-source-pod');
    const factSourceSelect = document.getElementById('fact-source-select');
    const presetSelect = document.getElementById('preset-select');
    const speedSlider = document.getElementById('speed-slider');
    const speedVal = document.getElementById('speed-val');

    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const btnNext = document.getElementById('btn-step-next');
    const btnPrev = document.getElementById('btn-step-prev');
    const btnReset = document.getElementById('btn-reset');
    const btnCompare = document.getElementById('btn-compare');

    const btnAddNode = document.getElementById('btn-add-node');
    const newNodeInput = document.getElementById('new-node-id');
    const newNodeRole = document.getElementById('new-node-role');
    const btnDeleteNode = document.getElementById('btn-delete-node');
    const btnQuarantineNode = document.getElementById('btn-quarantine-node');

    const btnAddEdge = document.getElementById('btn-add-edge');
    const edgeFromSelect = document.getElementById('edge-from-select');
    const edgeToSelect = document.getElementById('edge-to-select');

    const tabButtons = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-pane');

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    const caseTitle = document.getElementById('case-title');
    const caseDesc = document.getElementById('case-desc');

    // 3. Real-World Case Study Catalog
    const caseStudyCatalog = {
        financial_panic: {
            title: "Case 1: Deepfake Financial Market Panic",
            desc: "A synthetic video causes high-frequency trading bots to scrape and panic-sell assets before human SEC fact-checkers intervene."
        },
        election_echo: {
            title: "Case 2: Polarized Political Echo Chambers",
            desc: "Partisan rumors circulate inside polarized community clusters, completely blocked until an undecided swing voter bridges the gap."
        },
        health_rumor: {
            title: "Case 3: Medical Misinformation & Fact-Checkers",
            desc: "An unverified health guru spreads a false cure through parent WhatsApp chats via private forwards until stopped by health officials."
        },
        botnet_campaign: {
            title: "Case 4: Coordinated Botnet Astroturfing (Star)",
            desc: "A single operative triggers a coordinated constellation of automated bots simultaneously (BFS explosion at Level 1)."
        },
        whatsapp_chain: {
            title: "Case 5: Viral WhatsApp Forwarding Chain (Directed)",
            desc: "A linear private messaging chain where information travels strictly person-to-person (BFS and DFS yield identical sequence)."
        },
        cyclic: {
            title: "Case 6: Cyclic Rumor Ring with Cross-Ties",
            desc: "An interconnected peer group with cross-links, showing how visited sets prevent infinite forwarding loops."
        },
        disconnected: {
            title: "Case 7: Segmented Closed Communities",
            desc: "Isolated social clusters with zero external ties, demonstrating how network firewalls keep communities unreached."
        },
        default: {
            title: "Case 8: Mixed Heterogeneous Social Network",
            desc: "A realistic 10-entity network featuring influencers, reporters, algorithmic bots, and independent fact-checkers."
        }
    };

    // 4. Theme Management (Dark / Light)
    function initTheme() {
        const savedTheme = localStorage.getItem('infocascade_theme') || 'dark';
        applyTheme(savedTheme);
    }

    function applyTheme(theme) {
        const isLight = theme === 'light';
        document.body.classList.toggle('light-theme', isLight);

        if (isLight) {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark Mode';
        } else {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light Mode';
        }

        networkVis.setTheme(theme);
        localStorage.setItem('infocascade_theme', theme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isCurrentlyLight = document.body.classList.contains('light-theme');
            applyTheme(isCurrentlyLight ? 'dark' : 'light');
        });
    }

    // 5. Helper to populate dropdown menus from current graph
    function refreshNodeSelectors(selectedSource = null) {
        const nodeIds = networkVis.getNodeIds();
        
        // Populate Rumor Source Select
        sourceSelect.innerHTML = '';
        factSourceSelect.innerHTML = '';

        nodeIds.forEach(id => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = id;
            if (id === selectedSource) opt.selected = true;
            sourceSelect.appendChild(opt);

            const optFact = document.createElement('option');
            optFact.value = id;
            optFact.textContent = id;
            factSourceSelect.appendChild(optFact);
        });

        // Default Rumor Source to first node
        if (!sourceSelect.value && nodeIds.length > 0) {
            sourceSelect.value = nodeIds[0];
        }

        // Auto-select fact checker node if available
        const factNode = nodeIds.find(id => id.toLowerCase().includes('fact') || id.toLowerCase().includes('sec') || id.toLowerCase().includes('physician') || id.toLowerCase().includes('agency'));
        if (factNode) {
            factSourceSelect.value = factNode;
        } else if (nodeIds.length > 1) {
            factSourceSelect.selectedIndex = nodeIds.length - 1;
        }

        // Populate Edge From and To Selects
        edgeFromSelect.innerHTML = '';
        edgeToSelect.innerHTML = '';
        nodeIds.forEach(id => {
            const optFrom = document.createElement('option');
            optFrom.value = id;
            optFrom.textContent = id;
            edgeFromSelect.appendChild(optFrom);

            const optTo = document.createElement('option');
            optTo.value = id;
            optTo.textContent = id;
            edgeToSelect.appendChild(optTo);
        });

        if (edgeToSelect.options.length > 1) {
            edgeToSelect.selectedIndex = 1;
        }
    }

    // 6. Handle Algorithm Mode Switching
    function updateAlgorithmModeUI() {
        const isRace = algorithmSelect.value === 'RACE';
        if (factSourcePod) {
            factSourcePod.style.display = isRace ? 'flex' : 'none';
        }
    }

    // 7. API Service Call: Fetch Simulation
    async function requestSimulation() {
        const graphData = networkVis.getGraphData();
        const source = sourceSelect.value;
        const algorithm = algorithmSelect.value;

        if (!graphData.nodes || graphData.nodes.length === 0) {
            alert('The network graph is currently empty. Please add entities or load a preset scenario.');
            return;
        }

        if (!source) return;

        try {
            let endpoint = '/api/simulate';
            let payload = {
                graph: graphData,
                source: source,
                algorithm: algorithm
            };

            if (algorithm === 'RACE') {
                endpoint = '/api/simulate/race';
                payload = {
                    graph: graphData,
                    rumor_source: source,
                    fact_source: factSourceSelect.value,
                    delay: 1
                };
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (response.ok) {
                simCtrl.loadSimulation(result);
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Simulation request failed:', error);
        }
    }

    // 8. API Service Call: Load Preset Topology & Update Briefing
    async function loadPresetTopology(presetId) {
        if (!presetId) return;

        // Update Briefing Banner
        if (caseStudyCatalog[presetId]) {
            caseTitle.textContent = caseStudyCatalog[presetId].title;
            caseDesc.textContent = caseStudyCatalog[presetId].desc;
        }

        try {
            const response = await fetch(`/api/preset/${presetId}`);
            const graphData = await response.json();
            if (response.ok) {
                networkVis.loadGraph(graphData);
                refreshNodeSelectors();
                updateAlgorithmModeUI();
                await requestSimulation();
            } else {
                alert(`Failed to load preset: ${graphData.error}`);
            }
        } catch (error) {
            console.error('Preset loading error:', error);
        }
    }

    // 9. API Service Call: Comparative Traversal
    async function runComparison() {
        const graphData = networkVis.getGraphData();
        const source = sourceSelect.value;

        if (!source) {
            alert('Please select a valid origin vector first.');
            return;
        }

        try {
            const response = await fetch('/api/compare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    graph: graphData,
                    source: source
                })
            });

            const comparison = await response.json();
            if (response.ok) {
                // Populate comparison table
                document.getElementById('comp-bfs-steps').textContent = comparison.bfs.total_steps;
                document.getElementById('comp-dfs-steps').textContent = comparison.dfs.total_steps;

                document.getElementById('comp-bfs-memory').textContent = `Max Buffer: ${comparison.bfs.max_queue_size} entities`;
                document.getElementById('comp-dfs-memory').textContent = `Max Register: ${comparison.dfs.max_stack_size} entities`;

                document.getElementById('comp-bfs-order').textContent = comparison.bfs.traversal_order.join(' ➔ ');
                document.getElementById('comp-dfs-order').textContent = comparison.dfs.traversal_order.join(' ➔ ');

                // Populate observations
                const obsList = document.getElementById('comparison-observations-list');
                obsList.innerHTML = '';
                comparison.observations.forEach(obs => {
                    const li = document.createElement('li');
                    li.textContent = obs;
                    obsList.appendChild(li);
                });

                // Switch to Comparison Tab
                switchTab('tab-comparison');
            } else {
                alert(`Comparison error: ${comparison.error}`);
            }
        } catch (error) {
            console.error('Comparison error:', error);
        }
    }

    // 10. Tab Switching Logic
    function switchTab(tabId) {
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });

    // 11. Event Listeners for Controls
    btnStart.addEventListener('click', () => simCtrl.play());
    btnPause.addEventListener('click', () => simCtrl.pause());
    btnNext.addEventListener('click', () => simCtrl.stepForward());
    btnPrev.addEventListener('click', () => simCtrl.stepBackward());
    btnReset.addEventListener('click', () => simCtrl.reset());
    btnCompare.addEventListener('click', () => runComparison());

    speedSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        speedVal.textContent = `${val} ms`;
        simCtrl.setSpeed(val);
    });

    algorithmSelect.addEventListener('change', () => {
        updateAlgorithmModeUI();
        requestSimulation();
    });

    sourceSelect.addEventListener('change', () => {
        requestSimulation();
    });

    factSourceSelect.addEventListener('change', () => {
        requestSimulation();
    });

    presetSelect.addEventListener('change', (e) => {
        loadPresetTopology(e.target.value);
    });

    // 12. Graph Editing Listeners
    btnAddNode.addEventListener('click', () => {
        const name = (newNodeInput.value || '').trim();
        const role = newNodeRole.value;
        if (!name) {
            alert('Please enter an entity handle.');
            return;
        }

        const added = networkVis.addNode(name, name, role);
        if (added) {
            newNodeInput.value = '';
            refreshNodeSelectors(sourceSelect.value);
            requestSimulation();
        } else {
            alert(`Entity '${name}' already exists in the network.`);
        }
    });

    btnAddEdge.addEventListener('click', () => {
        const from = edgeFromSelect.value;
        const to = edgeToSelect.value;
        if (!from || !to) return;
        if (from === to) {
            alert('Cannot create self-connection in this diffusion model.');
            return;
        }

        const added = networkVis.addEdge(from, to);
        if (added) {
            requestSimulation();
        } else {
            alert(`Connection between '${from}' and '${to}' already exists.`);
        }
    });

    btnDeleteNode.addEventListener('click', () => {
        const target = sourceSelect.value;
        if (!target) return;
        if (confirm(`Remove entity '${target}' and all its connections from the network?`)) {
            networkVis.deleteNode(target);
            refreshNodeSelectors();
            requestSimulation();
        }
    });

    // Quarantine entity button
    if (btnQuarantineNode) {
        btnQuarantineNode.addEventListener('click', () => {
            const target = sourceSelect.value;
            if (!target) return;
            const success = networkVis.quarantineNode(target);
            if (success) {
                alert(`⚠️ Entity '${target}' has been quarantined! All transmission vectors have been severed. Re-running simulation to observe containment.`);
                requestSimulation();
            }
        });
    }

    // 13. Initial Boot: Apply saved theme and load Case 1 (Financial Panic)
    initTheme();
    loadPresetTopology('financial_panic');
});
