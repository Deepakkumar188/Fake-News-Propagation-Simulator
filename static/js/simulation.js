/**
 * Step-by-Step Simulation Playback Controller.
 * Cyber-Telemetry edition with real-time vector updates and memory inspection.
 */

class SimulationController {
    constructor(networkVisualizer, dsVisualizer) {
        this.network = networkVisualizer;
        this.dsVis = dsVisualizer;

        this.steps = [];
        this.currentStepIndex = -1;
        this.isPlaying = false;
        this.timer = null;
        this.speed = 600;

        // UI Element References
        this.btnStart = document.getElementById('btn-start');
        this.btnPause = document.getElementById('btn-pause');
        this.btnPrev = document.getElementById('btn-step-prev');
        this.btnNext = document.getElementById('btn-step-next');
        this.btnReset = document.getElementById('btn-reset');

        this.stepBadge = document.getElementById('step-counter-badge');
        this.explanationBox = document.getElementById('step-explanation-text');
        this.progressBar = document.getElementById('progress-bar');
        this.reachPctLabel = document.getElementById('stat-reach-pct');

        this.statTotalNodes = document.getElementById('stat-total-nodes');
        this.statTotalEdges = document.getElementById('stat-total-edges');
        this.statReached = document.getElementById('stat-reached-nodes');
        this.statUnreached = document.getElementById('stat-unreached-nodes');
        this.statCurrentLevel = document.getElementById('stat-current-level');
        this.statMaxDepth = document.getElementById('stat-max-depth');
        this.traversalList = document.getElementById('traversal-sequence-list');
    }

    setSpeed(newSpeed) {
        this.speed = parseInt(newSpeed, 10);
        if (this.isPlaying) {
            this.pause();
            this.play();
        }
    }

    loadSimulation(result) {
        this.pause();
        this.steps = result.steps || [];
        this.currentStepIndex = -1;
        this.algorithm = result.algorithm;
        this.source = result.source;

        // Reset UI metrics
        this.network.resetStyles();
        this.network.setNodeState(this.source, 'source');

        const totalNodes = result.summary.total_nodes;
        const totalEdges = result.summary.total_edges;
        this.statTotalNodes.textContent = totalNodes;
        this.statTotalEdges.textContent = totalEdges;
        this.statReached.textContent = '0';
        this.statUnreached.textContent = totalNodes;
        this.statCurrentLevel.textContent = '0';
        this.statMaxDepth.textContent = '0';
        this.progressBar.style.width = '0%';
        this.reachPctLabel.textContent = '0%';
        this.traversalList.innerHTML = '<span class="pathway-idle">Simulation loaded. Trigger RUN or STEP to propagate.</span>';
        this.stepBadge.textContent = `Step 0 / ${this.steps.length}`;
        this.explanationBox.innerHTML = `<span class="terminal-prefix">&gt;&gt;</span> Dissemination trajectory compiled for <strong>${this.algorithm}</strong> from vector origin <strong>${this.source}</strong> (${this.steps.length} state transitions).`;

        this.updateButtonStates();
    }

    play() {
        if (this.isPlaying || this.steps.length === 0) return;
        if (this.currentStepIndex >= this.steps.length - 1) {
            this.currentStepIndex = -1;
            this.network.resetStyles();
        }

        this.isPlaying = true;
        this.updateButtonStates();

        const tick = () => {
            if (!this.isPlaying) return;
            if (this.currentStepIndex < this.steps.length - 1) {
                this.stepForward();
                this.timer = setTimeout(tick, this.speed);
            } else {
                this.pause();
            }
        };

        this.timer = setTimeout(tick, this.speed);
    }

    pause() {
        this.isPlaying = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.updateButtonStates();
    }

    stepForward() {
        if (this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++;
            this.applyCurrentStep();
        }
        this.updateButtonStates();
    }

    stepBackward() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.applyCurrentStep();
        } else if (this.currentStepIndex === 0) {
            this.currentStepIndex = -1;
            this.network.resetStyles();
            this.network.setNodeState(this.source, 'source');
            this.dsVis.clear();
            this.stepBadge.textContent = `Step 0 / ${this.steps.length}`;
            this.explanationBox.innerHTML = '<span class="terminal-prefix">&gt;&gt;</span> Repositioned to initial origin state.';
        }
        this.updateButtonStates();
    }

    reset() {
        this.pause();
        this.currentStepIndex = -1;
        this.network.resetStyles();
        if (this.source) {
            this.network.setNodeState(this.source, 'source');
        }
        this.dsVis.clear();
        this.statReached.textContent = '0';
        this.statUnreached.textContent = this.statTotalNodes.textContent;
        this.statCurrentLevel.textContent = '0';
        this.progressBar.style.width = '0%';
        this.reachPctLabel.textContent = '0%';
        this.traversalList.innerHTML = '<span class="pathway-idle">Cascade reset to origin.</span>';
        this.stepBadge.textContent = `Step 0 / ${this.steps.length}`;
        this.explanationBox.innerHTML = '<span class="terminal-prefix">&gt;&gt;</span> State reset. Press <strong>Run</strong> or <strong>Next</strong> to begin dissemination.';
        this.updateButtonStates();
    }

    applyCurrentStep() {
        if (this.currentStepIndex < 0 || this.currentStepIndex >= this.steps.length) return;

        const step = this.steps[this.currentStepIndex];

        // 1. Reset network styles and repaint visited
        this.network.resetStyles();

        // Mark all previously infected nodes
        (step.visited_nodes || []).forEach(nodeId => {
            this.network.setNodeState(nodeId, 'infected');
        });

        // Always highlight source
        if (this.source) {
            this.network.setNodeState(this.source, 'source');
        }

        // Highlight current processing node (amber)
        if (step.current_node) {
            this.network.setNodeState(step.current_node, 'active');
        }

        // Highlight newly discovered neighbor (if distinct)
        if (step.neighbor_node && step.action === 'DISCOVER_NEW') {
            this.network.setNodeState(step.neighbor_node, 'active');
        }

        // Highlight active edge (cyan glow)
        if (step.active_edge) {
            this.network.setActiveEdge(step.active_edge[0], step.active_edge[1]);
        }

        // 2. Update Live Data Structure
        if (step.algorithm === 'BFS') {
            this.dsVis.render('BFS', step.queue_state);
        } else {
            this.dsVis.render('DFS', step.stack_state);
        }

        // 3. Update Real-time Statistics
        const stats = step.stats || {};
        this.statTotalNodes.textContent = stats.total_nodes || 0;
        this.statReached.textContent = stats.reached_count || 0;
        this.statUnreached.textContent = stats.unreached_count || 0;
        this.statMaxDepth.textContent = stats.max_propagation_depth || 0;

        const currentLevel = step.levels && step.current_node ? (step.levels[step.current_node] || 0) : 0;
        this.statCurrentLevel.textContent = currentLevel;

        const reachPct = stats.reach_percentage || 0;
        this.progressBar.style.width = `${reachPct}%`;
        this.reachPctLabel.textContent = `${reachPct}%`;

        // 4. Update Traversal Sequence Pathway
        const order = step.traversal_order || [];
        if (order.length === 0) {
            this.traversalList.innerHTML = '<span class="pathway-idle">Cascade originating at seed...</span>';
        } else {
            let pillsHtml = '';
            order.forEach((node, i) => {
                pillsHtml += `<span class="path-chip">${node}</span>`;
                if (i < order.length - 1) {
                    pillsHtml += '<span class="path-arrow">➔</span>';
                }
            });
            this.traversalList.innerHTML = pillsHtml;
        }

        // 5. Update Step Counter & Telemetry Output
        this.stepBadge.textContent = `Step ${step.step_id} / ${this.steps.length}`;
        this.explanationBox.innerHTML = `<span class="terminal-prefix">&gt;&gt; [${step.action}]</span> ${step.explanation}`;
    }

    updateButtonStates() {
        const hasSteps = this.steps.length > 0;
        const isAtEnd = this.currentStepIndex >= this.steps.length - 1;
        const isAtStart = this.currentStepIndex <= -1;

        this.btnStart.disabled = this.isPlaying || !hasSteps;
        this.btnPause.disabled = !this.isPlaying;
        this.btnNext.disabled = this.isPlaying || !hasSteps || isAtEnd;
        this.btnPrev.disabled = this.isPlaying || !hasSteps || isAtStart;
        this.btnReset.disabled = !hasSteps;
    }
}
