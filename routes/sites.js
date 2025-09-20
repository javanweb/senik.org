
const express = require('express');
const router = express.Router();
const Sites = require('../models/sites');

// GET all sites
router.get('/', async (req, res) => {
  try {
    const sites = await Sites.getAll();
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one site
router.get('/:id', async (req, res) => {
  try {
    const site = await Sites.getById(req.params.id);
    if (site) {
      res.json(site);
    } else {
      res.status(404).json({ message: 'Site not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET full site details
router.get('/:id/full', async (req, res) => {
  try {
    const site = await Sites.getFullSiteById(req.params.id);
    if (site) {
      res.json(site);
    } else {
      res.status(404).json({ message: 'Site not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a site
router.post('/', async (req, res) => {
  try {
    const newSite = await Sites.create(req.body);
    res.status(201).json(newSite[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a site
router.put('/:id', async (req, res) => {
  try {
    const updatedSite = await Sites.update(req.params.id, req.body);
    if (updatedSite[0]) {
      res.json(updatedSite[0]);
    } else {
      res.status(404).json({ message: 'Site not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a site
router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await Sites.delete(req.params.id);
    if (deletedCount > 0) {
      res.json({ message: 'Site deleted' });
    } else {
      res.status(404).json({ message: 'Site not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
