const express = require('express');
const router = express.Router();
const { mockNomads } = require('../data/mockData');

// GET /api/users — active nomads
router.get('/', (req, res) => {
  const { openToCollaborate, skill } = req.query;
  let nomads = [...mockNomads];

  if (openToCollaborate === 'true') {
    nomads = nomads.filter(n => n.isOpenToCollaborate);
  }
  if (skill) {
    nomads = nomads.filter(n =>
      n.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  res.json({ count: nomads.length, nomads });
});

// GET /api/users/:id — user profile
router.get('/:id', (req, res) => {
  const nomad = mockNomads.find(n => n.id === req.params.id);
  if (!nomad) return res.status(404).json({ error: 'User not found' });
  res.json(nomad);
});

module.exports = router;
