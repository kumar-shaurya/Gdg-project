let tasks = [];
let nextId = 1;

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const emptyState = document.getElementById("emptyState");

// Add a new task
function addTask(text) {
    if (!text.trim()) return;
    tasks.push({ id: nextId++, text: text.trim(), completed: false });
    taskInput.value = "";
    renderTasks();
    taskInput.focus(); // Keep focus on input for better UX
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    renderTasks();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

// Clear completed tasks
function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    renderTasks();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    tasks.forEach(task => {
        const div = document.createElement("div");
        div.className = "task-item";
        div.innerHTML = `
          <div class="task-left">
            <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${task.id})">
            <span class="task-text ${task.completed ? "completed" : ""}">${escapeHtml(task.text)}</span>
          </div>
          <button class="delete-btn" onclick="deleteTask(${task.id})" title="Delete task">✕</button>
        `;
        taskList.appendChild(div);
    });

    // Update task count
    const activeCount = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${activeCount} task${activeCount !== 1 ? "s" : ""} remaining`;

    // Enable/disable clear button
    const completedCount = tasks.filter(t => t.completed).length;
    clearCompletedBtn.disabled = completedCount === 0;
}

// Event listeners
addTaskBtn.addEventListener("click", () => addTask(taskInput.value));
taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask(taskInput.value);
});
clearCompletedBtn.addEventListener("click", clearCompleted);

// Focus on input when page loads
window.addEventListener("load", () => {
    taskInput.focus();
});

// Initial render
renderTasks();