const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let tasks = [];

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const newTask = req.body.task;
  if (newTask) {
    tasks.push(newTask);
    res.status(201).json({ message: 'Task added successfully', task: newTask });
  } else {
    res.status(400).json({ message: 'Task content cannot be empty' });
  }
});

app.put('/tasks', (req, res) => {
  const { oldTask, newTask } = req.body;
  const index = tasks.indexOf(oldTask);

  if (index !== -1 && newTask) {
    tasks[index] = newTask;
    console.log('Task updated:', oldTask, 'to', newTask); // Log the updated task
    res.json({ message: 'Task updated successfully', oldTask, newTask });
  } else {
    res.status(400).json({ message: 'Task not found or new task content is empty' });
  }
});

app.delete('/tasks', (req, res) => {
  const taskToDelete = req.body.task;
  tasks = tasks.filter(t => t !== taskToDelete);
  res.json({ message: 'Task deleted successfully' });
});

app.get('/', (req, res) => {
  res.send('Todo backend server is running.');
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
