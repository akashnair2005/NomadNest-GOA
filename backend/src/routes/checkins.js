const express = require('express');
const router = express.Router();
const { mockNomads, workspaces } = require('../data/mockData');

// In-memory store for demo (use Firestore in production)
const activeCheckins = new Map();

// Seed with mock data
mockNomads.forEach(n => {
  if (n.currentLocation) {
    activeCheckins.set(n.id, {
      userId: n.id,
      displayName: n.displayName,
      skills: n.skills,
      workspaceId: n.currentLocation,
      workspaceName: n.currentLocationName,
      status: n.status,
      isOpenToCollaborate: n.isOpenToCollaborate,
      lookingFor: n.lookingFor,
      checkedInAt: new Date(Date.now() - Math.random() * 3 * 60 * 60 * 1000).toISOString(),
      country: n.country,
    });
  }
});

// GET /api/checkins — all active check-ins
router.get('/', (req, res) => {
  const { workspaceId } = req.query;
  let checkins = Array.from(activeCheckins.values());

  if (workspaceId) {
    checkins = checkins.filter(c => c.workspaceId === workspaceId);
  }

  res.json({
    count: checkins.length,
    checkins,
    lastUpdated: new Date().toISOString(),
  });
});

// POST /api/checkins — check in to a workspace
router.post('/', (req, res) => {
  const { userId, displayName, skills, workspaceId, status, isOpenToCollaborate, lookingFor } = req.body;

  if (!userId || !workspaceId) {
    return res.status(400).json({ error: 'userId and workspaceId are required' });
  }

  const workspace = workspaces.find(w => w.id === workspaceId);
  if (!workspace) return res.status(404).json({ error: 'Workspace not found' });

  const checkin = {
    userId,
    displayName: displayName || 'Anonymous Nomad',
    skills: skills || [],
    workspaceId,
    workspaceName: workspace.name,
    status: status || 'working',
    isOpenToCollaborate: isOpenToCollaborate || false,
    lookingFor: lookingFor || null,
    checkedInAt: new Date().toISOString(),
  };

  activeCheckins.set(userId, checkin);

  res.json({
    success: true,
    checkin,
    message: `You're checked in at ${workspace.name}! 👋`,
  });
});

// DELETE /api/checkins/:userId — check out
router.delete('/:userId', (req, res) => {
  const { userId } = req.params;

  if (!activeCheckins.has(userId)) {
    return res.status(404).json({ error: 'No active check-in found' });
  }

  const checkin = activeCheckins.get(userId);
  activeCheckins.delete(userId);

  const duration = Math.round((Date.now() - new Date(checkin.checkedInAt).getTime()) / 60000);

  res.json({
    success: true,
    message: `Checked out from ${checkin.workspaceName}. You worked for ${duration} minutes!`,
    sessionMinutes: duration,
  });
});

// PATCH /api/checkins/:userId — update status
router.patch('/:userId', (req, res) => {
  const { userId } = req.params;
  const { status, isOpenToCollaborate, lookingFor } = req.body;

  if (!activeCheckins.has(userId)) {
    return res.status(404).json({ error: 'No active check-in found' });
  }

  const existing = activeCheckins.get(userId);
  const updated = {
    ...existing,
    ...(status && { status }),
    ...(isOpenToCollaborate !== undefined && { isOpenToCollaborate }),
    ...(lookingFor !== undefined && { lookingFor }),
  };

  activeCheckins.set(userId, updated);
  res.json({ success: true, checkin: updated });
});

module.exports = router;
