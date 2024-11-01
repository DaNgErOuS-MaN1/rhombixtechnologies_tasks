document.addEventListener('DOMContentLoaded', loadTasksFromBackend);
const addTaskBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const notification = document.getElementById('notification');

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

async function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        showNotification('Please enter a task!', '#e53935', 'center');
        return;
    }

    const li = document.createElement('li');
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    li.appendChild(taskSpan);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTask(taskText, taskSpan, li));
    li.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(taskText, li));
    li.appendChild(deleteBtn);

    taskList.appendChild(li);

    await saveTaskInBackend(taskText);

    taskInput.value = '';
    showNotification('Task added successfully!', '#4caf50', 'right');
}

async function saveTaskInBackend(task) {
    try {
        await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task })
        });
    } catch (error) {
        showNotification('Failed to save task in the backend', '#e53935', 'center');
    }
}

async function editTask(oldTask, taskSpan, li) {
    const newTask = prompt('Edit task:', oldTask);
    if (newTask && newTask.trim() !== '') {
        taskSpan.textContent = newTask;

        try {
            await fetch('http://localhost:3000/tasks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldTask, newTask })
            });
            showNotification('Task edited successfully!', '#4caf50', 'right');
        } catch (error) {
            showNotification('Failed to edit task in backend', '#e53935', 'center');
        }
    } else {
        showNotification('Task content cannot be empty', '#e53935', 'center');
    }
}

async function deleteTask(taskText, li) {
    taskList.removeChild(li);

    try {
        await fetch('http://localhost:3000/tasks', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: taskText })
        });
        showNotification('Task deleted successfully!', '#4caf50', 'right');
    } catch (error) {
        showNotification('Failed to delete task from backend', '#e53935', 'center');
    }
}

async function loadTasksFromBackend() {
    try {
        const response = await fetch('http://localhost:3000/tasks');
        const tasks = await response.json();
        tasks.forEach(task => {
            const li = document.createElement('li');
            const taskSpan = document.createElement('span');
            taskSpan.textContent = task;
            li.appendChild(taskSpan);

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editTask(task, taskSpan, li));
            li.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(task, li));
            li.appendChild(deleteBtn);

            taskList.appendChild(li);
        });
    } catch (error) {
        showNotification('Failed to load tasks from backend', '#e53935', 'center');
    }
}

function showNotification(message, bgColor, position) {
    notification.textContent = message;
    notification.style.backgroundColor = bgColor;
    notification.className = `notification ${position}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}
