
const express = require('express');
const router = express.Router();
const Pages = require('../models/pages');

// GET all pages
router.get('/', async (req, res) => {
  try {
    const pages = await Pages.getAll();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one page
router.get('/:id', async (req, res) => {
  try {
    const page = await Pages.getById(req.params.id);
    if (page) {
      res.json(page);
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a page
router.post('/', async (req, res) => {
  try {
    const newPage = await Pages.create(req.body);
    res.status(201).json(newPage[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a page
router.put('/:id', async (req, res) => {
  try {
    const updatedPage = await Pages.update(req.params.id, req.body);
    if (updatedPage[0]) {
      res.json(updatedPage[0]);
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a page
router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await Pages.delete(req.params.id);
    if (deletedCount > 0) {
      res.json({ message: 'Page deleted' });
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
