
const express = require('express');
const router = express.Router();
const Content = require('../models/content');

// This route will handle requests for different content types
// e.g., /api/content/heroes?site_id=1, /api/content/about_us?site_id=1

router.get('/:contentType', async (req, res) => {
  const { contentType } = req.params;
  const { site_id } = req.query;

  if (!site_id) {
    return res.status(400).json({ message: 'site_id query parameter is required' });
  }

  if (Content[contentType]) {
    try {
      const data = await Content[contentType].getAllBySite(site_id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.status(404).json({ message: `Content type '${contentType}' not found` });
  }
});

router.post('/:contentType', async (req, res) => {
  const { contentType } = req.params;

  if (Content[contentType]) {
    try {
      const newData = await Content[contentType].create(req.body);
      res.status(201).json(newData[0]);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(404).json({ message: `Content type '${contentType}' not found` });
  }
});

router.put('/:contentType/:id', async (req, res) => {
  const { contentType, id } = req.params;

  if (Content[contentType]) {
    try {
      const updatedData = await Content[contentType].update(id, req.body);
      if (updatedData[0]) {
        res.json(updatedData[0]);
      } else {
        res.status(404).json({ message: 'Content item not found' });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(404).json({ message: `Content type '${contentType}' not found` });
  }
});

router.delete('/:contentType/:id', async (req, res) => {
  const { contentType, id } = req.params;

  if (Content[contentType]) {
    try {
      const deletedCount = await Content[contentType].delete(id);
      if (deletedCount > 0) {
        res.json({ message: 'Content item deleted' });
      } else {
        res.status(404).json({ message: 'Content item not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.status(404).json({ message: `Content type '${contentType}' not found` });
  }
});


module.exports = router;
