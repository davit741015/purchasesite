const express = require('express');
const router = express.Router();

// Simple in-memory users array for demonstration
let users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
];

// Admin page
router.get('/', (req, res) => {
    res.sendFile(require('path').join(__dirname, '../views/admin.html'));
});

// API to get users
router.get('/users', (req, res) => {
    res.json(users);
});

// API to add a user
router.post('/users', express.json(), (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const newUser = { id: users.length + 1, name };
    users.push(newUser);
    res.json(newUser);
});

module.exports = router;
