/**
 * Main Application Controller for INFOCASCADE.
 * Handles UI interactions, API endpoints, visualization canvas,
 * Dual-Theme toggle, Real-World Case Studies, Complex Network Generators,
 * PageRank Super-Spreader Sizing, AI Virality Slider, Forensic Dossier Export,
 * Community Detection (Echo Chambers), AI Auto-Firewall, and Interactive Node Deep-Inspection.
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
    const btnDetectCommunities = document.getElementById('btn-detect-communities');
    const btnToggleSound = document.getElementById('btn-toggle-sound');
    const soundIcon = document.getElementById('sound-icon');
    const soundText = document.getElementById('sound-text');

    const btnAddNode = document.getElementById('btn-add-node');
    const newNodeInput = document.getElementById('new-node-id');
    const newNodeRole = document.getElementById('new-node-role');
    const btnDeleteNode = document.getElementById('btn-delete-node');
    const btnQuarantineNode = document.getElementById('btn-quarantine-node');
    const btnAutoContainment = document.getElementById('btn-auto-containment');

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

    // Node Inspector Drawer DOM References
    const inspectorModal = document.getElementById('entity-inspector-modal');
    const btnCloseInspector = document.getElementById('btn-close-inspector');
    const inspEntityId = document.getElementById('insp-entity-id');
    const inspRoleBadge = document.getElementById('insp-role-badge');
    const inspDegree = document.getElementById('insp-degree');
    const inspPagerank = document.getElementById('insp-pagerank');
    const inspRisk = document.getElementById('insp-risk');
    const inspSkepSlider = document.getElementById('insp-skep-slider');
    const inspSkepVal = document.getElementById('insp-skep-val');
    const inspRoleSelect = document.getElementById('insp-role-select');
    const btnSaveInspector = document.getElementById('btn-save-inspector');
    const btnInspInfect = document.getElementById('btn-insp-infect');
    const btnInspInoculate = document.getElementById('btn-insp-inoculate');
    const btnInspQuarantine = document.getElementById('btn-insp-quarantine');

    // AI NLP Headline Audit DOM References
    const headlineInput = document.getElementById('headline-input');
    const btnAnalyzeHeadline = document.getElementById('btn-analyze-headline');
    const headlineReportTray = document.getElementById('headline-report-tray');
    const aiVerdictTag = document.getElementById('ai-verdict-tag');
    const aiCredScore = document.getElementById('ai-cred-score');
    const aiPredVirality = document.getElementById('ai-pred-virality');
    const btnDismissAiReport = document.getElementById('btn-dismiss-ai-report');
    const aiFlagsList = document.getElementById('ai-flags-list');

    let isPageRankActive = false;
    let isCommunityActive = false;
    let cachedCentrality = null;
    let cachedCommunities = null;
    let currentlyInspectedNodeId = null;

    // 3. Real-World Case Study Catalog & Complex Generators
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

    // 5. Sound FX Synthesizer Initializer & Toggle
    function initSoundUI() {
        if (!window.audioEngine) return;
        const isMuted = window.audioEngine.isMuted();
        soundIcon.textContent = isMuted ? '🔇' : '🔊';
        soundText.textContent = isMuted ? 'Sound: OFF' : 'Sound: ON';
        btnToggleSound.classList.toggle('active', !isMuted);
    }

    if (btnToggleSound) {
        btnToggleSound.addEventListener('click', () => {
            if (!window.audioEngine) return;
            const muted = window.audioEngine.toggleMute();
            soundIcon.textContent = muted ? '🔇' : '🔊';
            soundText.textContent = muted ? 'Sound: OFF' : 'Sound: ON';
            btnToggleSound.classList.toggle('active', !muted);
            if (!muted) window.audioEngine.playClick();
        });
    }

    // 6. Helper to populate dropdown menus from current graph
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

    // 7. Handle Algorithm Mode Switching
    function updateAlgorithmModeUI() {
        const isRace = algorithmSelect.value === 'RACE';
        if (factSourcePod) {
            factSourcePod.style.display = isRace ? 'flex' : 'none';
        }
    }

    // 8. API Service Call: Fetch Simulation (BFS, DFS, SIR, RACE)
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

    // 9. Super-Spreader & PageRank Centrality Handler
    async function togglePageRankCentrality() {
        isPageRankActive = !isPageRankActive;
        btnTogglePagerank.classList.toggle('active', isPageRankActive);
        if (window.audioEngine) window.audioEngine.playClick();

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

    // 10. Community Detection (Echo Chambers) Handler
    async function toggleCommunityDetection() {
        isCommunityActive = !isCommunityActive;
        btnDetectCommunities.classList.toggle('active', isCommunityActive);
        if (window.audioEngine) window.audioEngine.playClick();

        if (!isCommunityActive) {
            networkVis.applyCommunityColors(null, false);
            return;
        }

        const graphData = networkVis.getGraphData();
        try {
            const response = await fetch('/api/analytics/communities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ graph: graphData })
            });

            const data = await response.json();
            if (response.ok) {
                cachedCommunities = data;
                networkVis.applyCommunityColors(data, true);

                const expl = document.getElementById('step-explanation-text');
                expl.innerHTML = `<span class="terminal-prefix">&gt;&gt; [COMMUNITY MODULARITY AUDIT]</span> Identified <strong>${data.total_communities} polarized echo chambers</strong>. <strong>${data.bridge_nodes.length} bridge nodes</strong> detected serving as inter-cluster transmission vectors.`;
            } else {
                alert(`Community detection failed: ${data.error}`);
            }
        } catch (err) {
            console.error('Community detection error:', err);
        }
    }

    // 11. AI Auto-Firewall / Min-Cut Handler
    async function runAutoContainment() {
        if (window.audioEngine) window.audioEngine.playClick();
        const graphData = networkVis.getGraphData();
        const source = sourceSelect.value;

        if (!source) {
            alert('Please select an active rumor origin seed first.');
            return;
        }

        try {
            const response = await fetch('/api/defense/optimal-cut', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    graph: graphData,
                    source: source,
                    budget: 2
                })
            });

            const data = await response.json();
            if (response.ok) {
                const cuts = data.optimal_edge_cuts || [];
                if (cuts.length === 0) {
                    alert(`🛡️ AI Auto-Firewall Analysis:\n\n${data.recommendation}`);
                    return;
                }

                const topCut = cuts[0];
                const confirmMsg = `🛡️ AI AUTO-FIREWALL OPTIMAL CONTAINMENT RECOMMENDATION:\n\n${data.recommendation}\n\nSevering transmission vector '${topCut.from}' ➔ '${topCut.to}' immediately prevents diffusion to ${topCut.saved_count} entities.\n\nExecute firewall vector cut now?`;
                
                if (confirm(confirmMsg)) {
                    networkVis.removeEdge(topCut.from, topCut.to);
                    if (window.audioEngine) window.audioEngine.playShield();
                    alert(`Vector cut executed! Re-running simulation to observe cascade containment.`);
                    await requestSimulation();
                }
            } else {
                alert(`Auto-Containment failed: ${data.error}`);
            }
        } catch (err) {
            console.error('Auto containment error:', err);
        }
    }

    // 12. Interactive Node Deep-Inspector
    function openNodeInspector(nodeId) {
        if (!nodeId) return;
        currentlyInspectedNodeId = nodeId;
        if (window.audioEngine) window.audioEngine.playClick();

        const node = networkVis.getNodeData(nodeId);
        if (!node) return;

        const graphData = networkVis.getGraphData();
        const connectedEdges = (graphData.edges || []).filter(e => e.from === nodeId || e.to === nodeId);
        const deg = connectedEdges.length;

        inspEntityId.textContent = nodeId;
        inspRoleBadge.textContent = (node.role || 'STANDARD USER').toUpperCase();
        inspRoleSelect.value = node.role || 'Standard User';
        inspDegree.textContent = deg;

        const skep = node.skepticism !== undefined ? node.skepticism : 0.45;
        inspSkepSlider.value = Math.round(skep * 100);
        inspSkepVal.textContent = `${Math.round(skep * 100)}%`;

        let prScore = 0.1;
        if (cachedCentrality && cachedCentrality.pagerank_scores) {
            prScore = cachedCentrality.pagerank_scores[nodeId] || 0.1;
        }
        inspPagerank.textContent = prScore.toFixed(3);
        inspRisk.textContent = prScore > 0.7 ? 'HIGH RISK' : (prScore > 0.4 ? 'MEDIUM' : 'LOW');
        inspRisk.className = `insp-v ${prScore > 0.7 ? 'text-rose' : (prScore > 0.4 ? 'text-amber' : 'text-emerald')}`;

        inspectorModal.style.display = 'flex';
    }

    function closeNodeInspector() {
        inspectorModal.style.display = 'none';
        currentlyInspectedNodeId = null;
    }

    inspSkepSlider.addEventListener('input', (e) => {
        inspSkepVal.textContent = `${e.target.value}%`;
    });

    btnSaveInspector.addEventListener('click', () => {
        if (!currentlyInspectedNodeId) return;
        const newSkep = parseFloat(inspSkepSlider.value) / 100.0;
        const newRole = inspRoleSelect.value;

        networkVis.updateNodeMetadata(currentlyInspectedNodeId, {
            skepticism: newSkep,
            role: newRole
        });

        if (window.audioEngine) window.audioEngine.playTruth();
        closeNodeInspector();
        requestSimulation();
    });

    btnInspInfect.addEventListener('click', () => {
        if (!currentlyInspectedNodeId) return;
        networkVis.setNodeState(currentlyInspectedNodeId, 'infected');
        if (window.audioEngine) window.audioEngine.playInfect();
        closeNodeInspector();
    });

    btnInspInoculate.addEventListener('click', () => {
        if (!currentlyInspectedNodeId) return;
        networkVis.setNodeState(currentlyInspectedNodeId, 'inoculated');
        if (window.audioEngine) window.audioEngine.playTruth();
        closeNodeInspector();
    });

    btnInspQuarantine.addEventListener('click', () => {
        if (!currentlyInspectedNodeId) return;
        networkVis.quarantineNode(currentlyInspectedNodeId);
        if (window.audioEngine) window.audioEngine.playShield();
        closeNodeInspector();
        requestSimulation();
    });

    if (btnCloseInspector) btnCloseInspector.addEventListener('click', closeNodeInspector);
    networkVis.setOnNodeClick(nodeId => openNodeInspector(nodeId));

    // 13. API Service Call: Load Preset Topology & Update Briefing
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
                    await togglePageRankCentrality();
                    isPageRankActive = true;
                    btnTogglePagerank.classList.add('active');
                }
                if (isCommunityActive) {
                    await toggleCommunityDetection();
                    isCommunityActive = true;
                    btnDetectCommunities.classList.add('active');
                }
                await requestSimulation();
            } else {
                alert(`Failed to load preset: ${graphData.error}`);
            }
        } catch (error) {
            console.error('Preset loading error:', error);
        }
    }

    // 14. API Service Call: Comparative Traversal
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

    // 15. Tab Switching Logic
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

    // 16. Forensic Intelligence Dossier Export Logic
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

        document.getElementById('dossier-timestamp').textContent = `${dateStr} // ${timeStr} UTC`;
        document.getElementById('dossier-id').textContent = `CAS-${randId}-INC`;
        document.getElementById('dossier-case-tag').textContent = `INCIDENT #CAS-${randId}`;
        
        const presetKey = presetSelect.value;
        const caseName = caseStudyCatalog[presetKey] ? caseStudyCatalog[presetKey].title : 'Custom Synthesized Topology';
        document.getElementById('dossier-topology').textContent = caseName;
        document.getElementById('dossier-algorithm').textContent = sim.algorithm === 'RACE' ? 'Multi-Source Dual Traversal (Truth vs Rumor)' : (sim.algorithm === 'SIR' ? 'SIR Epidemic Compartmental Model' : `${sim.algorithm} (Unidirectional Diffusion)`);
        document.getElementById('dossier-source').textContent = sim.source || sim.rumor_source || 'Unknown';
        document.getElementById('dossier-virality').textContent = `${viralitySlider ? viralitySlider.value : 75}% Persuasion Coefficient`;

        const summary = sim.summary || {};
        document.getElementById('dossier-total-v').textContent = summary.total_nodes || 0;
        document.getElementById('dossier-compromised-v').textContent = summary.infected_count || summary.ever_infected_count || 0;
        document.getElementById('dossier-resisted-v').textContent = summary.resisted_count || summary.recovered_count || 0;
        document.getElementById('dossier-unreached-v').textContent = summary.unreached_count || summary.susceptible_count || 0;
        document.getElementById('dossier-depth-v').textContent = summary.max_depth || summary.total_steps || 0;
        document.getElementById('dossier-reach-v').textContent = `${summary.reach_percentage || summary.attack_rate || 0}%`;

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

        const timelineTbody = document.getElementById('dossier-timeline-tbody');
        timelineTbody.innerHTML = '';
        const displaySteps = (sim.steps || []).slice(0, 30);
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
            communities: cachedCommunities ? cachedCommunities.communities : {},
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

    if (btnExportDossier) btnExportDossier.addEventListener('click', openForensicDossier);
    if (btnCloseDossier) btnCloseDossier.addEventListener('click', closeForensicDossier);
    if (btnPrintDossier) btnPrintDossier.addEventListener('click', () => window.print());
    if (btnDownloadJson) btnDownloadJson.addEventListener('click', downloadIncidentJSON);

    // 17. Event Listeners for Controls
    btnStart.addEventListener('click', () => simCtrl.play());
    btnPause.addEventListener('click', () => simCtrl.pause());
    btnNext.addEventListener('click', () => simCtrl.stepForward());
    btnPrev.addEventListener('click', () => simCtrl.stepBackward());
    btnReset.addEventListener('click', () => simCtrl.reset());
    btnCompare.addEventListener('click', () => runComparison());

    if (btnTogglePagerank) btnTogglePagerank.addEventListener('click', togglePageRankCentrality);
    if (btnDetectCommunities) btnDetectCommunities.addEventListener('click', toggleCommunityDetection);
    if (btnAutoContainment) btnAutoContainment.addEventListener('click', runAutoContainment);

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

    // 17.5 AI Headline Credibility Audit Engine
    async function runHeadlineCredibilityAudit() {
        const headline = (headlineInput.value || '').trim();
        if (!headline) {
            alert('Please enter or paste a news headline to audit.');
            headlineInput.focus();
            return;
        }

        btnAnalyzeHeadline.disabled = true;
        btnAnalyzeHeadline.innerHTML = '<span class="icon">⏳</span> Auditing NLP...';

        try {
            const resp = await fetch('/api/ai/analyze-headline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ headline: headline })
            });
            const data = await resp.json();
            if (!resp.ok) {
                alert(data.error || 'Failed to analyze headline credibility.');
                return;
            }

            // Render verdict badge and metrics
            aiVerdictTag.textContent = data.verdict;
            aiVerdictTag.className = `verdict-tag verdict-${data.status_class}`;
            aiCredScore.textContent = `${data.credibility_score}%`;
            const viralityPct = Math.round(data.predicted_virality * 100);
            aiPredVirality.textContent = `${viralityPct}%`;

            // Render red flag cues
            aiFlagsList.innerHTML = '';
            if (data.red_flags && data.red_flags.length > 0) {
                data.red_flags.forEach(flag => {
                    const chip = document.createElement('span');
                    chip.className = 'ai-flag-chip';
                    chip.innerHTML = `⚠️ ${flag}`;
                    aiFlagsList.appendChild(chip);
                });
            }
            if (data.counter_narrative) {
                const counter = document.createElement('div');
                counter.className = 'ai-counter-narrative';
                counter.innerHTML = `🛡️ <strong>AI Counter-Fact Verification:</strong> ${data.counter_narrative}`;
                aiFlagsList.appendChild(counter);
            }

            headlineReportTray.style.display = 'flex';

            // Auto-calibrate Virality Slider according to AI predicted virality
            if (viralitySlider) {
                viralitySlider.value = viralityPct;
                if (viralityVal) viralityVal.textContent = `${viralityPct}%`;
            }

            // Play alert / audit chime
            if (window.soundFX && soundFX.playAlert) {
                soundFX.playAlert();
            }

            // Annotate source node with audited headline
            const currentSource = sourceSelect.value;
            if (currentSource && networkVis && networkVis.nodesDataSet) {
                const existing = networkVis.nodesDataSet.get(currentSource);
                if (existing) {
                    networkVis.nodesDataSet.update({
                        id: currentSource,
                        title: `Entity: ${currentSource}\nRole: ${existing.role}\n🚨 INJECTED HEADLINE:\n"${data.headline}"\nAI Credibility: ${data.credibility_score}%\nVirality Index: ${viralityPct}%`
                    });
                }
            }

            // Trigger fresh simulation cascade with AI calibrated parameters
            requestSimulation();

        } catch (err) {
            console.error('AI headline audit failure:', err);
            alert('Failed to connect to AI NLP credibility audit engine.');
        } finally {
            btnAnalyzeHeadline.disabled = false;
            btnAnalyzeHeadline.innerHTML = '<span class="icon">🔍</span> Audit &amp; Inject';
        }
    }

    if (btnAnalyzeHeadline) {
        btnAnalyzeHeadline.addEventListener('click', runHeadlineCredibilityAudit);
    }
    if (headlineInput) {
        headlineInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                runHeadlineCredibilityAudit();
            }
        });
    }
    if (btnDismissAiReport) {
        btnDismissAiReport.addEventListener('click', () => {
            headlineReportTray.style.display = 'none';
        });
    }

    // 18. Graph Editing Listeners
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

    // 19. Initial Boot
    initTheme();
    initSoundUI();
    loadPresetTopology('financial_panic');
});
