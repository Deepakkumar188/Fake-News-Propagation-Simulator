/**
 * Network Graph Visualization Manager using Vis.js.
 * Enhanced with Neon-Cyber styling, particle-inspired nodes, and dynamic vectors.
 * Supports dynamic Dark / Light theme switching.
 */

class NetworkVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.nodesDataSet = new vis.DataSet([]);
        this.edgesDataSet = new vis.DataSet([]);
        this.network = null;
        this.isDirected = false;
        this.currentTheme = 'dark';

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
                    background: '#10b981',
                    border: '#047857',
                    highlight: { background: '#34d399', border: '#10b981' }
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
                    background: '#059669',
                    border: '#065f46',
                    highlight: { background: '#10b981', border: '#059669' }
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

        // Repaint all nodes with updated font/theme colors
        const currentNodes = this.nodesDataSet.get();
        const updatedNodes = currentNodes.map(n => {
            let stateColor = this.colors.unvisited;
            if (n.state === 'source') stateColor = this.colors.source;
            else if (n.state === 'active') stateColor = this.colors.active;
            else if (n.state === 'infected') stateColor = this.colors.infected;

            return {
                id: n.id,
                color: stateColor,
                font: { color: this.colors.fontColor }
            };
        });
        this.nodesDataSet.update(updatedNodes);

        // Repaint edges
        const currentEdges = this.edgesDataSet.get();
        const updatedEdges = currentEdges.map(e => ({
            id: e.id,
            color: { color: e.isActive ? this.colors.activeEdgeColor : this.colors.edgeColor }
        }));
        this.edgesDataSet.update(updatedEdges);
    }

    loadGraph(graphData) {
        this.isDirected = graphData.is_directed || false;
        
        const nodes = (graphData.nodes || []).map(n => ({
            id: n.id,
            label: n.label || n.id,
            title: `Entity: ${n.id}\nRole: ${n.role || 'Standard User'}`,
            role: n.role || 'Standard User',
            state: 'unvisited',
            color: this.colors.unvisited,
            font: { color: this.colors.fontColor }
        }));

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
            role: n.role || 'Standard User'
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

    addNode(id, label, role = 'Standard User') {
        if (!id || this.nodesDataSet.get(id)) return false;
        this.nodesDataSet.add({
            id: id,
            label: label || id,
            title: `Entity: ${id}\nRole: ${role}`,
            role: role,
            state: 'unvisited',
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

    setNodeState(nodeId, state) {
        if (!nodeId || !this.colors[state]) return;
        const node = this.nodesDataSet.get(nodeId);
        if (node) {
            this.nodesDataSet.update({
                id: nodeId,
                state: state,
                color: this.colors[state],
                size: state === 'active' ? 28 : (state === 'source' ? 26 : 22),
                shadow: state === 'active' || state === 'source' || state === 'infected' ?
                    { enabled: true, color: this.colors[state].background, size: 14 } :
                    { enabled: true, color: 'rgba(0,0,0,0.5)', size: 8 }
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
        const allNodes = this.nodesDataSet.get().map(n => ({
            id: n.id,
            state: 'unvisited',
            color: this.colors.unvisited,
            size: 22,
            font: { color: this.colors.fontColor },
            shadow: { enabled: true, color: 'rgba(0,0,0,0.5)', size: 8 }
        }));
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
