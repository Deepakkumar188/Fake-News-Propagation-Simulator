/**
 * Main Application Controller for INFOCASCADE.
 * Handles UI interactions, API endpoints, visualization canvas,
 * Dual-Theme toggle, Real-World Case Studies, Complex Network Generators,
 * PageRank Super-Spreader Sizing, AI Virality Slider, and Forensic Dossier Export.
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
    const viralitySlider = document.getElementById('virality-slider');
    const viralityVal = document.getElementById('virality-val');

    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const btnNext = document.getElementById('btn-step-next');
    const btnPrev = document.getElementById('btn-step-prev');
    const btnReset = document.getElementById('btn-reset');
    const btnCompare = document.getElementById('btn-compare');

    const btnTogglePagerank = document.getElementById('btn-toggle-pagerank');
    const btnExportDossier = document.getElementById('btn-export-dossier');

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

    // Dossier Modal DOM References
    const dossierModal = document.getElementById('dossier-modal');
    const btnCloseDossier = document.getElementById('btn-close-dossier');
    const btnPrintDossier = document.getElementById('btn-print-dossier');
    const btnDownloadJson = document.getElementById('btn-download-json');

    let isPageRankActive = false;
    let cachedCentrality = null;

    // 3. Real-World Case Study Catalog & Generators
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
        scale_free: {
            title: "⚡ Gen: Scale-Free Network (Barabási-Albert)",
            desc: "Dynamically generated preferential attachment graph. Power-law hub nodes act as viral super-spreaders."
        },
        small_world: {
            title: "⚡ Gen: Small-World Network (Watts-Strogatz)",
            desc: "Dynamically generated graph exhibiting high clustering and short path lengths (Six Degrees of Separation effect)."
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

        if (!sourceSelect.value && nodeIds.length > 0) {
            sourceSelect.value = nodeIds[0];
        }

        const factNode = nodeIds.find(id => id.toLowerCase().includes('fact') || id.toLowerCase().includes('sec') || id.toLowerCase().includes('physician') || id.toLowerCase().includes('agency'));
        if (factNode) {
            factSourceSelect.value = factNode;
        } else if (nodeIds.length > 1) {
            factSourceSelect.selectedIndex = nodeIds.length - 1;
        }

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

    // 7. API Service Call: Fetch Simulation with Virality Parameter
    async function requestSimulation() {
        const graphData = networkVis.getGraphData();
        const source = sourceSelect.value;
        const algorithm = algorithmSelect.value;
        const virality = viralitySlider ? parseFloat(viralitySlider.value) / 100.0 : 0.75;

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
                algorithm: algorithm,
                virality: virality
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

    // 8. Super-Spreader & PageRank Centrality Handler
    async function togglePageRankCentrality() {
        isPageRankActive = !isPageRankActive;
        btnTogglePagerank.classList.toggle('active', isPageRankActive);

        if (!isPageRankActive) {
            networkVis.applyPageRankSizing({}, false);
            return;
        }

        const graphData = networkVis.getGraphData();
        try {
            const response = await fetch('/api/analytics/centrality', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ graph: graphData })
            });

            const data = await response.json();
            if (response.ok) {
                cachedCentrality = data;
                networkVis.applyPageRankSizing(data.pagerank_scores, true);
                
                const topSpreader = data.top_super_spreaders && data.top_super_spreaders.length > 0 ? data.top_super_spreaders[0] : null;
                if (topSpreader) {
                    const expl = document.getElementById('step-explanation-text');
                    expl.innerHTML = `<span class="terminal-prefix">&gt;&gt; [SUPER-SPREADER AUDIT]</span> Identified <strong>${topSpreader.id}</strong> (${topSpreader.role}) as primary topological vector. PageRank: <strong>${topSpreader.pagerank}</strong>, Degree: <strong>${topSpreader.degree}</strong>, Influence: <strong>${topSpreader.influence_index}</strong>. Node dimensions dynamically scaled.`;
                }
            } else {
                alert(`Centrality calculation failed: ${data.error}`);
            }
        } catch (err) {
            console.error('Centrality error:', err);
        }
    }

    // 9. API Service Call: Load Preset Topology & Update Briefing
    async function loadPresetTopology(presetId) {
        if (!presetId) return;

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
                if (isPageRankActive) {
                    await togglePageRankCentrality(); // Refresh PageRank sizes
                    isPageRankActive = true;
                    btnTogglePagerank.classList.add('active');
                }
                await requestSimulation();
            } else {
                alert(`Failed to load preset: ${graphData.error}`);
            }
        } catch (error) {
            console.error('Preset loading error:', error);
        }
    }

    // 10. API Service Call: Comparative Traversal
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
                document.getElementById('comp-bfs-steps').textContent = comparison.bfs.total_steps;
                document.getElementById('comp-dfs-steps').textContent = comparison.dfs.total_steps;

                document.getElementById('comp-bfs-memory').textContent = `Max Buffer: ${comparison.bfs.max_queue_size} entities`;
                document.getElementById('comp-dfs-memory').textContent = `Max Register: ${comparison.dfs.max_stack_size} entities`;

                document.getElementById('comp-bfs-order').textContent = comparison.bfs.traversal_order.join(' ➔ ');
                document.getElementById('comp-dfs-order').textContent = comparison.dfs.traversal_order.join(' ➔ ');

                const obsList = document.getElementById('comparison-observations-list');
                obsList.innerHTML = '';
                comparison.observations.forEach(obs => {
                    const li = document.createElement('li');
                    li.textContent = obs;
                    obsList.appendChild(li);
                });

                switchTab('tab-comparison');
            } else {
                alert(`Comparison error: ${comparison.error}`);
            }
        } catch (error) {
            console.error('Comparison error:', error);
        }
    }

    // 11. Tab Switching Logic
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

    // 12. Forensic Intelligence Dossier Export Logic (Feature 4)
    async function openForensicDossier() {
        if (!simCtrl.lastResult) {
            alert('Please run or load a simulation before generating an incident report.');
            return;
        }

        const sim = simCtrl.lastResult;
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        const randId = Math.floor(1000 + Math.random() * 9000);

        // Fill Metadata
        document.getElementById('dossier-timestamp').textContent = `${dateStr} // ${timeStr} UTC`;
        document.getElementById('dossier-id').textContent = `CAS-${randId}-INC`;
        document.getElementById('dossier-case-tag').textContent = `INCIDENT #CAS-${randId}`;
        
        const presetKey = presetSelect.value;
        const caseName = caseStudyCatalog[presetKey] ? caseStudyCatalog[presetKey].title : 'Custom Synthesized Topology';
        document.getElementById('dossier-topology').textContent = caseName;
        document.getElementById('dossier-algorithm').textContent = sim.algorithm === 'RACE' ? 'Multi-Source Dual Traversal (Truth vs Rumor)' : `${sim.algorithm} (Unidirectional Diffusion)`;
        document.getElementById('dossier-source').textContent = sim.source || sim.rumor_source || 'Unknown';
        document.getElementById('dossier-virality').textContent = `${viralitySlider ? viralitySlider.value : 75}% Persuasion Coefficient`;

        // Summary Tiles
        const summary = sim.summary || {};
        document.getElementById('dossier-total-v').textContent = summary.total_nodes || 0;
        document.getElementById('dossier-compromised-v').textContent = summary.infected_count || 0;
        document.getElementById('dossier-resisted-v').textContent = summary.resisted_count || 0;
        document.getElementById('dossier-unreached-v').textContent = summary.unreached_count || 0;
        document.getElementById('dossier-depth-v').textContent = summary.max_depth || 0;
        document.getElementById('dossier-reach-v').textContent = `${summary.reach_percentage || 0}%`;

        // Fetch Centrality for Dossier Ranking Table
        const graphData = networkVis.getGraphData();
        const spreadersTbody = document.getElementById('dossier-spreaders-tbody');
        spreadersTbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Calculating PageRank eigenvalues...</td></tr>';

        try {
            const resp = await fetch('/api/analytics/centrality', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ graph: graphData })
            });
            const centData = await resp.json();
            if (resp.ok) {
                cachedCentrality = centData;
                spreadersTbody.innerHTML = '';
                (centData.all_nodes || []).slice(0, 7).forEach((node, idx) => {
                    const tr = document.createElement('tr');
                    const rankBadge = idx === 0 ? '👑 #1' : (idx === 1 ? '⭐ #2' : (idx === 2 ? '🔹 #3' : `#${idx + 1}`));
                    tr.innerHTML = `
                        <td><strong>${rankBadge}</strong></td>
                        <td><code>${node.id}</code></td>
                        <td><span class="dossier-role-tag">${node.role}</span></td>
                        <td>${node.degree}</td>
                        <td>${node.pagerank.toFixed(4)}</td>
                        <td><span class="dossier-score-badge ${node.influence_index > 65 ? 'score-high' : ''}">${node.influence_index}</span></td>
                    `;
                    spreadersTbody.appendChild(tr);
                });
            }
        } catch (err) {
            console.error('Dossier centrality error:', err);
        }

        // Timeline Table
        const timelineTbody = document.getElementById('dossier-timeline-tbody');
        timelineTbody.innerHTML = '';
        const displaySteps = (sim.steps || []).slice(0, 30); // Display up to first 30 pivotal steps
        displaySteps.forEach(step => {
            const tr = document.createElement('tr');
            const vec = step.active_edge ? `${step.active_edge[0]} ➔ ${step.active_edge[1]}` : (step.current_node ? step.current_node : 'N/A');
            const mem = step.queue_state ? `Queue[${step.queue_state.length}]: [${step.queue_state.join(', ')}]` : (step.stack_state ? `Stack[${step.stack_state.length}]: [${step.stack_state.join(', ')}]` : '-');
            
            tr.innerHTML = `
                <td>#${step.step_id}</td>
                <td><span class="dossier-action-tag action-${step.action.toLowerCase()}">${step.action}</span></td>
                <td><code>${vec}</code></td>
                <td class="font-mono text-muted">${mem}</td>
                <td class="dossier-desc-cell">${step.explanation}</td>
            `;
            timelineTbody.appendChild(tr);
        });

        dossierModal.style.display = 'flex';
    }

    function closeForensicDossier() {
        dossierModal.style.display = 'none';
    }

    function downloadIncidentJSON() {
        if (!simCtrl.lastResult) return;
        const reportData = {
            export_timestamp: new Date().toISOString(),
            incident_id: document.getElementById('dossier-id').textContent,
            topology: document.getElementById('dossier-topology').textContent,
            algorithm: simCtrl.lastResult.algorithm,
            virality_setting: viralitySlider ? viralitySlider.value : 75,
            summary: simCtrl.lastResult.summary,
            super_spreaders: cachedCentrality ? cachedCentrality.all_nodes : [],
            timeline: simCtrl.lastResult.steps
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `INFOCASCADE_Incident_Dossier_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }

    if (btnExportDossier) {
        btnExportDossier.addEventListener('click', openForensicDossier);
    }

    if (btnCloseDossier) {
        btnCloseDossier.addEventListener('click', closeForensicDossier);
    }

    if (btnPrintDossier) {
        btnPrintDossier.addEventListener('click', () => window.print());
    }

    if (btnDownloadJson) {
        btnDownloadJson.addEventListener('click', downloadIncidentJSON);
    }

    // 13. Event Listeners for Controls
    btnStart.addEventListener('click', () => simCtrl.play());
    btnPause.addEventListener('click', () => simCtrl.pause());
    btnNext.addEventListener('click', () => simCtrl.stepForward());
    btnPrev.addEventListener('click', () => simCtrl.stepBackward());
    btnReset.addEventListener('click', () => simCtrl.reset());
    btnCompare.addEventListener('click', () => runComparison());

    if (btnTogglePagerank) {
        btnTogglePagerank.addEventListener('click', togglePageRankCentrality);
    }

    speedSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        speedVal.textContent = `${val} ms`;
        simCtrl.setSpeed(val);
    });

    if (viralitySlider) {
        viralitySlider.addEventListener('input', (e) => {
            const val = e.target.value;
            viralityVal.textContent = `${val}%`;
            requestSimulation();
        });
    }

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

    // 14. Graph Editing Listeners
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

    // 15. Initial Boot: Apply saved theme and load Case 1 (Financial Panic)
    initTheme();
    loadPresetTopology('financial_panic');
});
