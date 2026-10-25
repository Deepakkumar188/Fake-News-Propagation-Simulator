/**
 * Live Data Structure Visualizer for Queue (FIFO) and Stack (LIFO).
 * Renders an interactive, cyber-styled memory register.
 */

class DataStructureVisualizer {
    constructor(containerId, titleId, badgeId) {
        this.container = document.getElementById(containerId);
        this.titleElement = document.getElementById(titleId);
        this.badgeElement = document.getElementById(badgeId);
    }

    render(algorithm, items) {
        if (!this.container) return;

        if (algorithm === 'BFS') {
            if (this.titleElement) this.titleElement.textContent = 'Active Memory Buffer: FIFO Queue';
            if (this.badgeElement) this.badgeElement.textContent = 'FIFO QUEUE';
            this.renderQueue(items || []);
        } else {
            if (this.titleElement) this.titleElement.textContent = 'Active Branch Register: LIFO Stack';
            if (this.badgeElement) this.badgeElement.textContent = 'LIFO STACK';
            this.renderStack(items || []);
        }
    }

    renderQueue(queueItems) {
        if (!queueItems || queueItems.length === 0) {
            this.container.innerHTML = '<div class="buffer-idle-msg">Queue Buffer is empty (no pending nodes).</div>';
            return;
        }

        let html = '<div class="queue-rail">';
        html += '<span class="buffer-pointer ptr-head">HEAD ➔</span>';

        queueItems.forEach((item, index) => {
            const isFront = index === 0;
            html += `<div class="ds-slot ${isFront ? 'ds-slot-active' : ''}" title="Queue Pos: ${index}">${item}</div>`;
        });

        html += '<span class="buffer-pointer ptr-tail">➔ TAIL</span>';
        html += '</div>';

        this.container.innerHTML = html;
    }

    renderStack(stackItems) {
        if (!stackItems || stackItems.length === 0) {
            this.container.innerHTML = '<div class="buffer-idle-msg">Stack Register is empty (no pending branches).</div>';
            return;
        }

        let html = '<div class="queue-rail">';
        html += '<span class="buffer-pointer ptr-tail">BOTTOM</span>';

        stackItems.forEach((item, index) => {
            const isTop = index === stackItems.length - 1;
            html += `<div class="ds-slot ${isTop ? 'ds-slot-active' : ''}" title="Stack Depth: ${index}">${item}</div>`;
        });

        html += '<span class="buffer-pointer ptr-head">➔ TOP</span>';
        html += '</div>';

        this.container.innerHTML = html;
    }

    clear() {
        if (this.container) {
            this.container.innerHTML = '<div class="buffer-idle-msg">Buffer idle. Initialize simulation to monitor memory allocations.</div>';
        }
    }
}
