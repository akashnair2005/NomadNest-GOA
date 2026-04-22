const express = require('express');
const router = express.Router();
const { matchWorkspaces, generateMeetupSuggestion, generateCollaboMessage } = require('../services/aiService');
const { workspaces, mockNomads } = require('../data/mockData');

// POST /api/ai/match — AI workspace matching
router.post('/match', async (req, res) => {
  try {
    const { workStyle, skills, preferredHours, mustHaves, budget, mood } = req.body;

    if (!workStyle) {
      return res.status(400).json({ error: 'workStyle is required (deep-focus / calls / creative / mixed)' });
    }

    const userProfile = { workStyle, skills, preferredHours, mustHaves, budget, mood };
    const result = await matchWorkspaces(userProfile, workspaces);

    // Enrich recommendations with full workspace data
    const enriched = {
      ...result,
      recommendations: result.recommendations.map(rec => {
        const workspace = workspaces.find(w => w.id === rec.workspaceId);
        return {
          ...rec,
          workspace: workspace || null,
        };
      }).filter(r => r.workspace !== null),
    };

    res.json(enriched);
  } catch (err) {
    console.error('[AI MATCH]', err);
    res.status(500).json({ error: 'AI matching failed. Please try again.' });
  }
});

// GET /api/ai/meetup — generate weekly meetup suggestion
router.get('/meetup', async (req, res) => {
  try {
    const venueWorkspaces = workspaces.filter(w => w.hostsMeetups);
    const suggestion = await generateMeetupSuggestion(mockNomads, venueWorkspaces);

    if (!suggestion) {
      return res.status(500).json({ error: 'Could not generate meetup suggestion' });
    }

    res.json({
      ...suggestion,
      attendees: mockNomads.length + Math.floor(Math.random() * 10),
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[AI MEETUP]', err);
    res.status(500).json({ error: 'Meetup generation failed' });
  }
});

// POST /api/ai/collab — find collaboration matches
router.post('/collab', async (req, res) => {
  try {
    const { skills, lookingFor, projectDescription } = req.body;
    const openNomads = mockNomads.filter(n => n.isOpenToCollaborate);

    const message = await generateCollaboMessage(
      { skills, lookingFor, projectDescription },
      openNomads
    );

    res.json({
      message,
      openNomads: openNomads.map(n => ({
        id: n.id,
        displayName: n.displayName,
        skills: n.skills,
        lookingFor: n.lookingFor,
        currentLocation: n.currentLocationName,
        status: n.status,
      })),
    });
  } catch (err) {
    console.error('[AI COLLAB]', err);
    res.status(500).json({ error: 'Collab matching failed' });
  }
});

module.exports = router;
