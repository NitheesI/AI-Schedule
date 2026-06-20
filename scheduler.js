// --- Task Scheduler Logic ---
const taskForm = document.getElementById('taskForm');
const dashTaskList = document.getElementById('dashTaskList');
const notificationLogs = document.getElementById('notificationLogs');

// Helper: get tasks from localStorage
function getSavedTasks() {
    try {
        return JSON.parse(localStorage.getItem('clockwork_tasks') || '[]');
    } catch (e) {
        return [];
    }
}

// Helper: save tasks to localStorage
function saveTasks(taskArray) {
    localStorage.setItem('clockwork_tasks', JSON.stringify(taskArray));
}

// Helper: format time from 24h "HH:MM" to 12h "h:MM AM/PM"
function formatTime(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
}

// Helper: add a log entry to the SMS transceiver
function addLog(message) {
    if (!notificationLogs) return;
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { hour12: false });
    const logLine = document.createElement('div');
    logLine.className = 'text-green-400';
    logLine.textContent = `[${timestamp}] ${message}`;
    notificationLogs.appendChild(logLine);
    notificationLogs.scrollTop = notificationLogs.scrollHeight;
}

// Helper: render a single task card in the schedule list
function renderTaskCard(task, index) {
    const card = document.createElement('div');
    card.className = 'flex items-center justify-between bg-white border-4 border-black rounded-md p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';

    card.innerHTML = `
        <div class="flex-1">
            <span class="font-extrabold text-black">${task.label}</span>
            <span class="ml-2 text-xs font-bold bg-orange-400 text-black px-2 py-0.5 rounded-full border-2 border-black">${formatTime(task.time)}</span>
        </div>
        <button class="delete-task-btn ml-3 bg-red-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-full border-2 border-black hover:bg-red-700 transition-all" data-index="${index}">&times;</button>
    `;

    // Delete handler
    card.querySelector('.delete-task-btn').addEventListener('click', () => {
        const allTasks = getSavedTasks();
        const removed = allTasks.splice(index, 1)[0];
        saveTasks(allTasks);
        addLog(`TASK REMOVED: "${removed.label}" at ${formatTime(removed.time)}`);
        renderAllTasks();
    });

    return card;
}

// Render all tasks from localStorage into the dashboard list
function renderAllTasks() {
    if (!dashTaskList) return;
    const allTasks = getSavedTasks();

    dashTaskList.innerHTML = '';

    if (allTasks.length === 0) {
        dashTaskList.innerHTML = '<p class="text-gray-600 font-bold text-center py-12">No tasks scheduled yet. Add one above!</p>';
        return;
    }

    // Sort by time
    allTasks.sort((a, b) => a.time.localeCompare(b.time));
    saveTasks(allTasks); // persist sorted order

    allTasks.forEach((task, i) => {
        dashTaskList.appendChild(renderTaskCard(task, i));
    });
}

// Handle form submission
if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const labelInput = document.getElementById('taskLabel');
        const timeInput = document.getElementById('taskTime');

        const label = labelInput.value.trim();
        const time = timeInput.value;

        if (!label || !time) return;

        const newTask = { label, time, notified: false, createdAt: new Date().toISOString() };
        const allTasks = getSavedTasks();
        allTasks.push(newTask);
        saveTasks(allTasks);

        addLog(`TASK SCHEDULED: "${label}" → trigger at ${formatTime(time)}`);

        // Show toast
        const toastContainer = document.getElementById('toastContainer');
        if (toastContainer) {
            const toast = document.createElement('div');
            toast.className = 'pointer-events-auto bg-orange-500 text-black font-extrabold px-5 py-3 rounded-md border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce';
            toast.textContent = `✓ "${label}" scheduled at ${formatTime(time)}`;
            toastContainer.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        renderAllTasks();

        // Reset form
        labelInput.value = '';
        timeInput.value = '';
    });
}

// Initial render on page load
renderAllTasks();

// --- Notification Engine ---
setInterval(() => {
    const now = new Date();
    const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const allTasks = getSavedTasks();
    let updated = false;

    allTasks.forEach(task => {
        if (task.time === currentHHMM && !task.notified) {
            // Trigger browser alert
            alert(`⏰ CLOCKWORK ALERT: It's time for "${task.label}"!`);
            
            // Add to SMS logs
            addLog(`SMS SENT: Reminder for "${task.label}" delivered.`);
            
            // Mark as notified so it doesn't alert again this minute
            task.notified = true;
            updated = true;
        }
    });

    if (updated) {
        saveTasks(allTasks);
    }
}, 1000);
