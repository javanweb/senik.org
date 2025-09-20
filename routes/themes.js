
const express = require('express');
const router = express.Router();
const Themes = require('../models/themes');

// GET all themes
router.get('/', async (req, res) => {
  try {
    const themes = await Themes.getAll();
    res.json(themes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one theme
router.get('/:id', async (req, res) => {
  try {
    const theme = await Themes.getById(req.params.id);
    if (theme) {
      res.json(theme);
    } else {
      res.status(404).json({ message: 'Theme not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a theme
router.post('/', async (req, res) => {
  try {
    const newTheme = await Themes.create(req.body);
    res.status(201).json(newTheme[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a theme
router.put('/:id', async (req, res) => {
  try {
    const updatedTheme = await Themes.update(req.params.id, req.body);
    if (updatedTheme[0]) {
      res.json(updatedTheme[0]);
    } else {
      res.status(404).json({ message: 'Theme not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a theme
router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await Themes.delete(req.params.id);
    if (deletedCount > 0) {
      res.json({ message: 'Theme deleted' });
    } else {
      res.status(404).json({ message: 'Theme not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
