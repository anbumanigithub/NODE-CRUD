const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// In-memory data storage
let users = [
  { id: 1, username: 'user1', password: 'pass1' },
  { id: 2, username: 'user2', password: 'pass2' }
];

let employees = [
  { id: 1, name: 'John Doe', position: 'Developer' },
  { id: 2, name: 'Jane Smith', position: 'Designer' }
];

// Authentication middleware
const authenticateUser = (req, res, next) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// API routes

// Authentication endpoint
app.post('/login', authenticateUser, (req, res) => {
  res.json({ message: 'Authentication successful', user: req.user });
});

// Get list of employees
app.get('/employees', (req, res) => {
  // You can add filters here based on query parameters
  res.json(employees);
});

// Create a new employee
app.post('/employees', (req, res) => {
  const { name, position } = req.body;
  const newEmployee = { id: employees.length + 1, name, position };
  employees.push(newEmployee);
  res.json(newEmployee);
});

// Update an employee
app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { name, position } = req.body;
  const index = employees.findIndex(emp => emp.id == id);

  if (index !== -1) {
    employees[index] = { ...employees[index], name, position };
    res.json(employees[index]);
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

// Delete an employee
app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  employees = employees.filter(emp => emp.id != id);
  res.json({ message: 'Employee deleted successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
