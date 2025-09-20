
const express = require('express');
const router = express.Router();
const Widgets = require('../models/widgets');

// GET all widgets
router.get('/', async (req, res) => {
  try {
    const widgets = await Widgets.getAll();
    res.json(widgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one widget
router.get('/:id', async (req, res) => {
  try {
    const widget = await Widgets.getById(req.params.id);
    if (widget) {
      res.json(widget);
    } else {
      res.status(404).json({ message: 'Widget not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a widget
router.post('/', async (req, res) => {
  try {
    const newWidget = await Widgets.create(req.body);
    res.status(201).json(newWidget[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a widget
router.put('/:id', async (req, res) => {
  try {
    const updatedWidget = await Widgets.update(req.params.id, req.body);
    if (updatedWidget[0]) {
      res.json(updatedWidget[0]);
    } else {
      res.status(404).json({ message: 'Widget not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a widget
router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await Widgets.delete(req.params.id);
    if (deletedCount > 0) {
      res.json({ message: 'Widget deleted' });
    } else {
      res.status(404).json({ message: 'Widget not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
