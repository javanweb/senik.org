
const express = require('express');
const router = express.Router();
const Users = require('../models/users');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await Users.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one user
router.get('/:id', async (req, res) => {
  try {
    const user = await Users.getById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a user
router.post('/', async (req, res) => {
  try {
    // Note: In a real app, you would hash the password before saving
    const newUser = await Users.create(req.body);
    res.status(201).json(newUser[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a user
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await Users.update(req.params.id, req.body);
    if (updatedUser[0]) {
      res.json(updatedUser[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a user
router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await Users.delete(req.params.id);
    if (deletedCount > 0) {
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
