// --- Simulator Modal Logic ---
const simulatorModal = document.getElementById('simulatorModal');
const demoBtn = document.getElementById('demoBtn');
const closeSimulatorBtn = document.getElementById('closeSimulatorBtn');

demoBtn.addEventListener('click', () => {
    simulatorModal.showModal();
});

closeSimulatorBtn.addEventListener('click', () => {
    simulatorModal.close();
});

simulatorModal.addEventListener('click', (e) => {
    if (e.target === simulatorModal) {
        simulatorModal.close();
    }
});

// --- Drag and Drop API Logic ---
const tasks = document.querySelectorAll('.task-item');
const dropZones = document.querySelectorAll('.time-block, #taskList');

tasks.forEach(task => {
    task.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
        setTimeout(() => {
            e.target.classList.add('opacity-50'); // Dim original while dragging
        }, 0);
    });

    task.addEventListener('dragend', (e) => {
        e.target.classList.remove('opacity-50');
    });
});

dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow dropping
        zone.classList.add('bg-orange-100'); // Highlight zone
    });

    zone.addEventListener('dragleave', (e) => {
        zone.classList.remove('bg-orange-100'); // Remove highlight
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('bg-orange-100');
        const id = e.dataTransfer.getData('text/plain');
        const draggableElement = document.getElementById(id);
        if (draggableElement) {
            // e.currentTarget refers to the zone the listener is attached to,
            // guaranteeing it doesn't get nested inside another task card by accident
            e.currentTarget.appendChild(draggableElement);
        }
    });
});
