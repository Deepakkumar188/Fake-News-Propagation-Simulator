/**
 * Network Graph Visualization Manager using Vis.js.
 * Enhanced with Neon-Cyber styling, particle-inspired nodes, and dynamic vectors.
 * Supports Dark/Light themes, PageRank Sizing, Community Modularity Shading,
 * and Interactive Node Click Inspection.
 */

class NetworkVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.nodesDataSet = new vis.DataSet([]);
        this.edgesDataSet = new vis.DataSet([]);
        this.network = null;
        this.isDirected = false;
        this.currentTheme = 'dark';
        this.isPageRankMode = false;
        this.isCommunityMode = false;
        this.pageRankScores = {};
        this.communityData = null;
        this.onNodeClickCallback = null;

        // Color palettes for Dark and Light themes
        this.palettes = {
            dark: {
                unvisited: {
                    background: '#162035',
                    border: '#2a3b5c',
                    highlight: { background: '#1e2d4a', border: '#38bdf8' }
                },
                source: {
                    background: '#f43f5e',
                    border: '#be123c',
                    highlight: { background: '#fb7185', border: '#f43f5e' }
                },
                active: {
                    background: '#f59e0b',
                    border: '#b45309',
                    highlight: { background: '#fbbf24', border: '#f59e0b' }
                },
                infected: {
                    background: '#f43f5e',
                    border: '#be123c',
                    highlight: { background: '#fb7185', border: '#f43f5e' }
                },
                resisted: {
                    background: '#d97706',
                    border: '#b45309',
                    highlight: { background: '#f59e0b', border: '#d97706' }
                },
                recovered: {
                    background: '#10b981',
                    border: '#059669',
                    highlight: { background: '#34d399', border: '#10b981' }
                },
                inoculated: {
                    background: '#00f2fe',
                    border: '#0284c7',
                    highlight: { background: '#38bdf8', border: '#00f2fe' }
                },
                debunked: {
                    background: '#8b5cf6',
                    border: '#6d28d9',
                    highlight: { background: '#a78bfa', border: '#8b5cf6' }
                },
                fontColor: '#f8fafc',
                edgeColor: 'rgba(56, 189, 248, 0.25)',
                activeEdgeColor: '#00f2fe'
            },
            light: {
                unvisited: {
                    background: '#94a3b8',
                    border: '#64748b',
                    highlight: { background: '#cbd5e1', border: '#0284c7' }
                },
                source: {
                    background: '#e11d48',
                    border: '#9f1239',
                    highlight: { background: '#f43f5e', border: '#e11d48' }
                },
                active: {
                    background: '#d97706',
                    border: '#92400e',
                    highlight: { background: '#f59e0b', border: '#d97706' }
                },
                infected: {
                    background: '#e11d48',
                    border: '#9f1239',
                    highlight: { background: '#f43f5e', border: '#e11d48' }
                },
                resisted: {
                    background: '#b45309',
                    border: '#78350f',
                    highlight: { background: '#d97706', border: '#b45309' }
                },
                recovered: {
                    background: '#059669',
                    border: '#047857',
                    highlight: { background: '#10b981', border: '#059669' }
                },
                inoculated: {
                    background: '#0284c7',
                    border: '#0369a1',
                    highlight: { background: '#38bdf8', border: '#0284c7' }
                },
                debunked: {
                    background: '#7c3aed',
                    border: '#5b21b6',
                    highlight: { background: '#a78bfa', border: '#7c3aed' }
                },
                fontColor: '#0f172a',
                edgeColor: 'rgba(100, 116, 139, 0.4)',
                activeEdgeColor: '#0284c7'
            }
        };

        this.colors = this.palettes.dark;
        this.initNetwork();
    }

    initNetwork() {
        const data = {
            nodes: this.nodesDataSet,
            edges: this.edgesDataSet
        };

        const options = {
            physics: {
                enabled: true,
                barnesHut: {
                    gravitationalConstant: -3500,
                    centralGravity: 0.35,
                    springLength: 105,
                    springConstant: 0.045,
                    damping: 0.095
                },
                stabilization: { iterations: 180, fit: true }
            },
            nodes: {
                shape: 'dot',
                size: 22,
                font: {
                    color: this.colors.fontColor,
                    face: 'Plus Jakarta Sans, sans-serif',
                    size: 13,
                    bold: { color: this.colors.fontColor }
                },
                borderWidth: 2.5,
                color: this.colors.unvisited,
                shadow: { enabled: true, color: 'rgba(0,0,0,0.5)', size: 8 }
            },
            edges: {
                width: 1.8,
                color: {
                    color: this.colors.edgeColor,
                    highlight: this.colors.activeEdgeColor,
                    hover: this.colors.activeEdgeColor
                },
                arrows: {
                    to: { enabled: this.isDirected, scaleFactor: 0.85 }
                },
                smooth: { type: 'continuous', roundness: 0.4 }
            },
            interaction: {
                hover: true,
                dragNodes: true,
                zoomView: true,
                navigationButtons: false
            }
        };

        this.network = new vis.Network(this.container, data, options);

        // Click on node listener
        this.network.on('click', (params) => {
            if (params.nodes && params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                if (this.onNodeClickCallback) {
                    this.onNodeClickCallback(nodeId);
                }
            }
        });
    }

    setOnNodeClick(callback) {
        this.onNodeClickCallback = callback;
    }

    setTheme(themeName) {
        this.currentTheme = themeName === 'light' ? 'light' : 'dark';
        this.colors = this.palettes[this.currentTheme];

        this.network.setOptions({
            nodes: {
                font: {
                    color: this.colors.fontColor,
                    bold: { color: this.colors.fontColor }
                }
            },
            edges: {
                color: {
                    color: this.colors.edgeColor,
                    highlight: this.colors.activeEdgeColor,
                    hover: this.colors.activeEdgeColor
                }
            }
        });

        const currentNodes = this.nodesDataSet.get();
        const updatedNodes = currentNodes.map(n => {
            let stateColor = this.colors.unvisited;
            if (n.state === 'source') stateColor = this.colors.source;
            else if (n.state === 'active') stateColor = this.colors.active;
            else if (n.state === 'infected') stateColor = this.colors.infected;
            else if (n.state === 'resisted') stateColor = this.colors.resisted;
            else if (n.state === 'recovered') stateColor = this.colors.recovered;
            else if (n.state === 'inoculated') stateColor = this.colors.inoculated;
            else if (n.state === 'debunked') stateColor = this.colors.debunked;

            return {
                id: n.id,
                color: stateColor,
                font: { color: this.colors.fontColor }
            };
        });
        this.nodesDataSet.update(updatedNodes);

        const currentEdges = this.edgesDataSet.get();
        const updatedEdges = currentEdges.map(e => ({
            id: e.id,
            color: { color: e.isActive ? this.colors.activeEdgeColor : this.colors.edgeColor }
        }));
        this.edgesDataSet.update(updatedEdges);
    }

    loadGraph(graphData) {
        this.isDirected = graphData.is_directed || false;
        
        const nodes = (graphData.nodes || []).map(n => {
            const skep = n.skepticism !== undefined ? n.skepticism : 0.45;
            return {
                id: n.id,
                label: n.label || n.id,
                title: `Entity: ${n.id}\nRole: ${n.role || 'Standard User'}\nSkepticism Index: ${Math.round(skep * 100)}%`,
                role: n.role || 'Standard User',
                skepticism: skep,
                state: 'unvisited',
                size: 22,
                color: this.colors.unvisited,
                font: { color: this.colors.fontColor }
            };
        });

        const edges = (graphData.edges || []).map(e => ({
            id: `${e.from}-${e.to}`,
            from: e.from,
            to: e.to,
            isActive: false,
            color: { color: this.colors.edgeColor },
            arrows: this.isDirected ? 'to' : undefined
        }));

        this.nodesDataSet.clear();
        this.edgesDataSet.clear();

        this.nodesDataSet.add(nodes);
        this.edgesDataSet.add(edges);

        this.network.setOptions({
            edges: {
                arrows: { to: { enabled: this.isDirected, scaleFactor: 0.85 } }
            }
        });

        this.network.fit({ animation: { duration: 600, easingFunction: 'easeInOutQuad' } });
    }

    getGraphData() {
        const nodes = this.nodesDataSet.get().map(n => ({
            id: n.id,
            label: n.label,
            role: n.role || 'Standard User',
            skepticism: n.skepticism !== undefined ? n.skepticism : 0.45
        }));

        const edges = this.edgesDataSet.get().map(e => ({
            from: e.from,
            to: e.to
        }));

        return {
            is_directed: this.isDirected,
            nodes: nodes,
            edges: edges
        };
    }

    applyPageRankSizing(pagerankMap, isEnabled = true) {
        this.isPageRankMode = isEnabled;
        this.pageRankScores = pagerankMap || {};

        const currentNodes = this.nodesDataSet.get();
        const updates = currentNodes.map(n => {
            if (!isEnabled) {
                return {
                    id: n.id,
                    size: 22,
                    borderWidth: 2.5
                };
            }
            const pr = this.pageRankScores[n.id] || 0.1;
            const scaledSize = Math.round(18 + pr * 26);
            return {
                id: n.id,
                size: scaledSize,
                borderWidth: pr >= 0.75 ? 4.5 : 2.5
            };
        });
        this.nodesDataSet.update(updates);
    }

    applyCommunityColors(communityData, isEnabled = true) {
        this.isCommunityMode = isEnabled;
        this.communityData = communityData;

        const currentNodes = this.nodesDataSet.get();
        if (!isEnabled || !communityData) {
            this.resetStyles();
            return;
        }

        const palette = [
            { background: '#0284c7', border: '#0369a1' }, // Blue
            { background: '#8b5cf6', border: '#6d28d9' }, // Purple
            { background: '#10b981', border: '#059669' }, // Emerald
            { background: '#f59e0b', border: '#b45309' }, // Amber
            { background: '#ec4899', border: '#be185d' }, // Pink
            { background: '#6366f1', border: '#4338ca' }  // Indigo
        ];

        const nodeComm = communityData.node_communities || {};
        const bridgeSet = new Set((communityData.bridge_nodes || []).map(b => b.node));

        const updates = currentNodes.map(n => {
            const cId = nodeComm[n.id] || 1;
            const colorObj = palette[(cId - 1) % palette.length];
            const isBridge = bridgeSet.has(n.id);

            return {
                id: n.id,
                color: colorObj,
                borderWidth: isBridge ? 5 : 2.5,
                shape: isBridge ? 'diamond' : 'dot',
                size: isBridge ? 28 : 22,
                title: isBridge ? `[BRIDGE BOTTLENECK NODE]\nEntity: ${n.id}\nConnects Communities` : `Entity: ${n.id}\nCommunity #${cId}`
            };
        });
        this.nodesDataSet.update(updates);
    }

    updateNodeMetadata(nodeId, newProps) {
        if (!nodeId || !this.nodesDataSet.get(nodeId)) return false;
        const current = this.nodesDataSet.get(nodeId);
        const skep = newProps.skepticism !== undefined ? newProps.skepticism : current.skepticism;
        const role = newProps.role !== undefined ? newProps.role : current.role;
        const label = newProps.label !== undefined ? newProps.label : current.label;

        this.nodesDataSet.update({
            id: nodeId,
            label: label,
            role: role,
            skepticism: skep,
            title: `Entity: ${nodeId}\nRole: ${role}\nSkepticism Index: ${Math.round(skep * 100)}%`
        });
        return true;
    }

    getNodeData(nodeId) {
        if (!nodeId) return null;
        return this.nodesDataSet.get(nodeId);
    }

    addNode(id, label, role = 'Standard User', skepticism = 0.45) {
        if (!id || this.nodesDataSet.get(id)) return false;
        this.nodesDataSet.add({
            id: id,
            label: label || id,
            title: `Entity: ${id}\nRole: ${role}\nSkepticism Index: ${Math.round(skepticism * 100)}%`,
            role: role,
            skepticism: skepticism,
            state: 'unvisited',
            size: 22,
            color: this.colors.unvisited,
            font: { color: this.colors.fontColor }
        });
        return true;
    }

    deleteNode(id) {
        if (!id || !this.nodesDataSet.get(id)) return false;
        const connectedEdges = this.edgesDataSet.get({
            filter: e => e.from === id || e.to === id
        });
        this.edgesDataSet.remove(connectedEdges.map(e => e.id));
        this.nodesDataSet.remove(id);
        return true;
    }

    quarantineNode(id) {
        if (!id || !this.nodesDataSet.get(id)) return false;
        const connectedEdges = this.edgesDataSet.get({
            filter: e => e.from === id || e.to === id
        });
        this.edgesDataSet.remove(connectedEdges.map(e => e.id));
        this.nodesDataSet.update({
            id: id,
            color: { background: '#f59e0b', border: '#b45309' },
            title: `[QUARANTINED ENTITY - TRANSMISSION SEVERED]\nID: ${id}`,
            shadow: { enabled: true, color: '#f59e0b', size: 16 }
        });
        return true;
    }

    addEdge(from, to) {
        if (!from || !to || from === to) return false;
        if (!this.nodesDataSet.get(from) || !this.nodesDataSet.get(to)) return false;

        const edgeId = `${from}-${to}`;
        const reverseId = `${to}-${from}`;

        if (this.edgesDataSet.get(edgeId)) return false;
        if (!this.isDirected && this.edgesDataSet.get(reverseId)) return false;

        this.edgesDataSet.add({
            id: edgeId,
            from: from,
            to: to,
            isActive: false,
            color: { color: this.colors.edgeColor },
            arrows: this.isDirected ? 'to' : undefined
        });
        return true;
    }

    removeEdge(from, to) {
        const edgeId = `${from}-${to}`;
        const reverseId = `${to}-${from}`;
        const e1 = this.edgesDataSet.get(edgeId);
        const e2 = !this.isDirected ? this.edgesDataSet.get(reverseId) : null;
        if (e1) this.edgesDataSet.remove(e1.id);
        if (e2) this.edgesDataSet.remove(e2.id);
        return e1 || e2;
    }

    setNodeState(nodeId, state) {
        if (!nodeId || !this.colors[state]) return;
        const node = this.nodesDataSet.get(nodeId);
        if (node) {
            let baseSize = 22;
            if (this.isPageRankMode && this.pageRankScores[nodeId]) {
                baseSize = Math.round(18 + this.pageRankScores[nodeId] * 26);
            }
            const activeSize = state === 'active' ? baseSize + 6 : (state === 'source' ? baseSize + 4 : baseSize);

            this.nodesDataSet.update({
                id: nodeId,
                state: state,
                color: this.colors[state],
                size: activeSize,
                shadow: state === 'active' || state === 'source' || state === 'infected' ?
                    { enabled: true, color: this.colors[state].background, size: 14 } :
                    (state === 'resisted' ? { enabled: true, color: '#d97706', size: 12 } :
                    (state === 'recovered' ? { enabled: true, color: '#10b981', size: 12 } :
                    { enabled: true, color: 'rgba(0,0,0,0.5)', size: 8 }))
            });
        }
    }

    setActiveEdge(from, to) {
        const allEdges = this.edgesDataSet.get();
        const updates = allEdges.map(e => {
            const isMatch = (e.from === from && e.to === to) || 
                            (!this.isDirected && e.from === to && e.to === from);
            return {
                id: e.id,
                isActive: isMatch,
                color: isMatch ? { color: this.colors.activeEdgeColor, highlight: this.colors.activeEdgeColor } : { color: this.colors.edgeColor },
                width: isMatch ? 4.0 : 1.8,
                shadow: isMatch ? { enabled: true, color: this.colors.activeEdgeColor, size: 12 } : { enabled: false }
            };
        });
        this.edgesDataSet.update(updates);
    }

    resetStyles() {
        const allNodes = this.nodesDataSet.get().map(n => {
            let baseSize = 22;
            if (this.isPageRankMode && this.pageRankScores[n.id]) {
                baseSize = Math.round(18 + this.pageRankScores[n.id] * 26);
            }
            return {
                id: n.id,
                state: 'unvisited',
                shape: 'dot',
                color: this.colors.unvisited,
                size: baseSize,
                borderWidth: 2.5,
                font: { color: this.colors.fontColor },
                shadow: { enabled: true, color: 'rgba(0,0,0,0.5)', size: 8 }
            };
        });
        this.nodesDataSet.update(allNodes);

        const allEdges = this.edgesDataSet.get().map(e => ({
            id: e.id,
            isActive: false,
            color: { color: this.colors.edgeColor },
            width: 1.8,
            shadow: { enabled: false }
        }));
        this.edgesDataSet.update(allEdges);
    }

    getNodeIds() {
        return this.nodesDataSet.getIds();
    }
}
