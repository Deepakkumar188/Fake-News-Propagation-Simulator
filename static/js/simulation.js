/**
 * Step-by-Step Simulation Playback Controller.
 * Dual-Wave (Truth vs Rumor) & S-Curve Time-Series Chart.js integration.
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
        this.chart = null;

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
        this.statInoculated = document.getElementById('stat-inoculated-nodes');
        this.statDebunked = document.getElementById('stat-debunked-nodes');
        this.statUnreached = document.getElementById('stat-unreached-nodes');
        this.traversalList = document.getElementById('traversal-sequence-list');

        this.initChart();
    }

    initChart() {
        const canvas = document.getElementById('diffusionChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [0],
                datasets: [
                    {
                        label: 'Rumor Infected',
                        data: [0],
                        borderColor: '#f43f5e',
                        backgroundColor: 'rgba(244, 63, 94, 0.15)',
                        borderWidth: 2,
                        tension: 0.35,
                        fill: true,
                        pointRadius: 2
                    },
                    {
                        label: 'Fact-Check Inoculated',
                        data: [0],
                        borderColor: '#00f2fe',
                        backgroundColor: 'rgba(0, 242, 254, 0.12)',
                        borderWidth: 2,
                        tension: 0.35,
                        fill: true,
                        pointRadius: 2
                    },
                    {
                        label: 'Neutralized (Debunked)',
                        data: [0],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.12)',
                        borderWidth: 2,
                        tension: 0.35,
                        fill: true,
                        pointRadius: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: {
                        display: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#64748b', font: { size: 10 } }
                    },
                    y: {
                        display: true,
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#64748b', font: { size: 10 }, precision: 0 }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#94a3b8',
                            font: { size: 10, family: 'Plus Jakarta Sans' },
                            boxWidth: 10
                        }
                    }
                }
            }
        });
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
        this.source = result.source || result.rumor_source;
        this.factSource = result.fact_source || null;

        // Reset UI metrics
        this.network.resetStyles();
        if (this.source) {
            this.network.setNodeState(this.source, 'source');
        }
        if (this.factSource) {
            this.network.setNodeState(this.factSource, 'inoculated');
        }

        const totalNodes = result.summary.total_nodes;
        const totalEdges = result.summary.total_edges;
        this.statTotalNodes.textContent = totalNodes;
        this.statTotalEdges.textContent = totalEdges;
        this.statReached.textContent = '0';
        if (this.statInoculated) this.statInoculated.textContent = '0';
        if (this.statDebunked) this.statDebunked.textContent = '0';
        this.statUnreached.textContent = totalNodes;
        this.progressBar.style.width = '0%';
        this.reachPctLabel.textContent = '0%';
        this.traversalList.innerHTML = '<span class="pathway-idle">Simulation loaded. Trigger RUN or STEP to propagate.</span>';
        this.stepBadge.textContent = `Step 0 / ${this.steps.length}`;
        this.explanationBox.innerHTML = `<span class="terminal-prefix">&gt;&gt;</span> Dissemination trajectory compiled for <strong>${this.algorithm}</strong> (${this.steps.length} state transitions). Ready to execute.`;

        // Reset Chart
        if (this.chart) {
            this.chart.data.labels = [0];
            this.chart.data.datasets[0].data = [0];
            this.chart.data.datasets[1].data = [0];
            this.chart.data.datasets[2].data = [0];
            this.chart.update('none');
        }

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
            if (this.source) this.network.setNodeState(this.source, 'source');
            if (this.factSource) this.network.setNodeState(this.factSource, 'inoculated');
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
        if (this.source) this.network.setNodeState(this.source, 'source');
        if (this.factSource) this.network.setNodeState(this.factSource, 'inoculated');
        this.dsVis.clear();
        this.statReached.textContent = '0';
        if (this.statInoculated) this.statInoculated.textContent = '0';
        if (this.statDebunked) this.statDebunked.textContent = '0';
        this.statUnreached.textContent = this.statTotalNodes.textContent;
        this.progressBar.style.width = '0%';
        this.reachPctLabel.textContent = '0%';
        this.traversalList.innerHTML = '<span class="pathway-idle">Cascade reset to origin.</span>';
        this.stepBadge.textContent = `Step 0 / ${this.steps.length}`;
        this.explanationBox.innerHTML = '<span class="terminal-prefix">&gt;&gt;</span> State reset. Press <strong>Run</strong> or <strong>Next</strong> to begin dissemination.';
        
        if (this.chart) {
            this.chart.data.labels = [0];
            this.chart.data.datasets[0].data = [0];
            this.chart.data.datasets[1].data = [0];
            this.chart.data.datasets[2].data = [0];
            this.chart.update('none');
        }

        this.updateButtonStates();
    }

    applyCurrentStep() {
        if (this.currentStepIndex < 0 || this.currentStepIndex >= this.steps.length) return;

        const step = this.steps[this.currentStepIndex];

        // 1. Reset network styles
        this.network.resetStyles();

        // 2. Color nodes based on mode (BFS/DFS vs RACE)
        if (step.algorithm === 'RACE') {
            (step.infected_nodes || []).forEach(n => this.network.setNodeState(n, 'infected'));
            (step.inoculated_nodes || []).forEach(n => this.network.setNodeState(n, 'inoculated'));
            (step.debunked_nodes || []).forEach(n => this.network.setNodeState(n, 'debunked'));
        } else {
            (step.visited_nodes || []).forEach(n => this.network.setNodeState(n, 'infected'));
        }

        // Always highlight primary rumor source
        if (this.source) this.network.setNodeState(this.source, 'source');
        if (this.factSource && step.algorithm === 'RACE') {
            this.network.setNodeState(this.factSource, 'inoculated');
        }

        // Highlight active entity
        if (step.current_node) {
            this.network.setNodeState(step.current_node, 'active');
        }
        if (step.neighbor_node && (step.action === 'DISCOVER_NEW' || step.action === 'RUMOR_SPREAD')) {
            this.network.setNodeState(step.neighbor_node, 'active');
        }

        // Active edge
        if (step.active_edge) {
            this.network.setActiveEdge(step.active_edge[0], step.active_edge[1]);
        }

        // 3. Update Memory Buffer Inspector
        if (step.algorithm === 'BFS' || step.algorithm === 'RACE') {
            this.dsVis.render('BFS', step.queue_state);
        } else {
            this.dsVis.render('DFS', step.stack_state);
        }

        // 4. Update Statistics Counters
        const stats = step.stats || {};
        if (step.algorithm === 'RACE') {
            const infCount = (step.infected_nodes || []).length;
            const inocCount = (step.inoculated_nodes || []).length;
            const debCount = (step.debunked_nodes || []).length;
            const total = parseInt(this.statTotalNodes.textContent, 10) || 1;
            const safeCount = Math.max(0, total - infCount - inocCount - debCount);

            this.statReached.textContent = infCount;
            if (this.statInoculated) this.statInoculated.textContent = inocCount;
            if (this.statDebunked) this.statDebunked.textContent = debCount;
            this.statUnreached.textContent = safeCount;

            const reachPct = Math.round((infCount / total) * 100);
            this.progressBar.style.width = `${reachPct}%`;
            this.reachPctLabel.textContent = `${reachPct}%`;
        } else {
            this.statReached.textContent = stats.reached_count || (step.visited_nodes || []).length;
            this.statUnreached.textContent = stats.unreached_count || 0;
            const reachPct = stats.reach_percentage || 0;
            this.progressBar.style.width = `${reachPct}%`;
            this.reachPctLabel.textContent = `${reachPct}%`;
        }

        // 5. Update Sequence Pathway Chips
        const order = step.traversal_order || step.infected_nodes || [];
        if (order.length === 0) {
            this.traversalList.innerHTML = '<span class="pathway-idle">Cascade originating at seed...</span>';
        } else {
            let pillsHtml = '';
            order.forEach((node, i) => {
                pillsHtml += `<span class="path-chip">${node}</span>`;
                if (i < order.length - 1) pillsHtml += '<span class="path-arrow">➔</span>';
            });
            this.traversalList.innerHTML = pillsHtml;
        }

        // 6. Update S-Curve Chart.js
        if (this.chart) {
            if (step.time_series && step.time_series.length > 0) {
                const labels = step.time_series.map((_, i) => i);
                const rumorData = step.time_series.map(pt => pt.rumor_count);
                const factData = step.time_series.map(pt => pt.fact_count);
                const debunkData = step.time_series.map(pt => pt.debunked_count);

                this.chart.data.labels = labels;
                this.chart.data.datasets[0].data = rumorData;
                this.chart.data.datasets[1].data = factData;
                this.chart.data.datasets[2].data = debunkData;
            } else {
                // BFS/DFS standard infection curve
                const currentVisited = (step.visited_nodes || []).length;
                this.chart.data.labels.push(this.currentStepIndex + 1);
                this.chart.data.datasets[0].data.push(currentVisited);
                this.chart.data.datasets[1].data.push(0);
                this.chart.data.datasets[2].data.push(0);
            }
            this.chart.update('none');
        }

        // 7. Update Step Counter & Telemetry
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
