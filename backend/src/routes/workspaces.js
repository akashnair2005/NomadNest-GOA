const express = require('express');
const router = express.Router();
const { workspaces } = require('../data/mockData');

// GET /api/workspaces — list all workspaces with optional filters
router.get('/', (req, res) => {
  const { area, type, minWifi, noiseLevel, hasBackup, bestFor } = req.query;

  let filtered = [...workspaces];

  if (area) filtered = filtered.filter(w => w.area.toLowerCase() === area.toLowerCase());
  if (type) filtered = filtered.filter(w => w.type === type);
  if (minWifi) filtered = filtered.filter(w => w.wifiScore >= parseFloat(minWifi));
  if (noiseLevel) filtered = filtered.filter(w => w.noiseLevel === noiseLevel);
  if (hasBackup === 'true') filtered = filtered.filter(w => w.hasBackupPower);
  if (bestFor) filtered = filtered.filter(w => w.bestFor.includes(bestFor));

  // Add live occupancy percentage
  const enriched = filtered.map(w => ({
    ...w,
    occupancyPercent: Math.round((w.currentOccupancy / w.maxCapacity) * 100),
    spotsLeft: w.maxCapacity - w.currentOccupancy,
    isQuiet: w.noiseLevelScore <= 3,
    isLowOccupancy: (w.currentOccupancy / w.maxCapacity) < 0.5,
  }));

  res.json({
    count: enriched.length,
    workspaces: enriched,
    lastUpdated: new Date().toISOString(),
  });
});

// GET /api/workspaces/:id — single workspace detail
router.get('/:id', (req, res) => {
  const workspace = workspaces.find(w => w.id === req.params.id);
  if (!workspace) {
    return res.status(404).json({ error: 'Workspace not found' });
  }

  // Simulate hourly noise/occupancy data for heatmap
  const hourlyData = Array.from({ length: 14 }, (_, i) => ({
    hour: i + 7,
    label: `${i + 7}:00`,
    occupancy: Math.round(workspace.maxCapacity * (0.3 + Math.random() * 0.5)),
    noiseScore: Math.round(workspace.noiseLevelScore + (Math.random() * 2 - 1)),
    wifiSpeed: Math.round(parseFloat(workspace.wifiSpeed) * (0.85 + Math.random() * 0.2)),
  }));

  res.json({
    ...workspace,
    occupancyPercent: Math.round((workspace.currentOccupancy / workspace.maxCapacity) * 100),
    spotsLeft: workspace.maxCapacity - workspace.currentOccupancy,
    hourlyData,
  });
});

// POST /api/workspaces/:id/report — submit WiFi/occupancy report
router.post('/:id/report', (req, res) => {
  const workspace = workspaces.find(w => w.id === req.params.id);
  if (!workspace) return res.status(404).json({ error: 'Workspace not found' });

  const { wifiSpeed, noiseLevel, occupancyEstimate, powerAvailable, reportedBy } = req.body;

  // In production, save to Firestore
  const report = {
    workspaceId: req.params.id,
    reportedBy: reportedBy || 'anonymous',
    wifiSpeed,
    noiseLevel,
    occupancyEstimate,
    powerAvailable,
    timestamp: new Date().toISOString(),
    reportId: `rep_${Date.now()}`,
  };

  console.log('[REPORT]', report);

  res.json({
    success: true,
    message: 'Thanks for the update! Your report helps the community.',
    reportId: report.reportId,
  });
});

// POST /api/workspaces/:id/negotiate — request membership negotiation
router.post('/:id/negotiate', (req, res) => {
  const workspace = workspaces.find(w => w.id === req.params.id);
  if (!workspace) return res.status(404).json({ error: 'Workspace not found' });

  const { userName, userEmail, duration, budget, message } = req.body;

  // In production, send email and save to Firestore
  res.json({
    success: true,
    message: `Your negotiation request for ${workspace.name} has been submitted. They typically respond within 24 hours.`,
    requestId: `neg_${Date.now()}`,
  });
});

module.exports = router;
