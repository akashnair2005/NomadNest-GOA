const express = require('express');
const router = express.Router();

const meetups = [
  {
    id: "meet_001",
    title: "Build in Public: Goa Edition",
    theme: "Startup / side project showcase",
    venue: "Mapusa Maker Hub",
    venueId: "ws_005",
    date: "This Saturday",
    time: "6:00 PM",
    format: "Lightning talks (5 min each)",
    description: "Share what you're building! 5-minute demos, brutal feedback, and cold Kingfishers after. Nomads and locals both welcome.",
    icebreaker: "Show the most embarrassing line of code you wrote this week",
    expectedTurnout: 22,
    rsvpCount: 14,
    isAiGenerated: true,
    tags: ["startup", "build-in-public", "networking"],
    createdAt: "2024-06-14T10:00:00Z"
  },
  {
    id: "meet_002",
    title: "Sunset Skills Swap",
    theme: "Skill exchange & networking",
    venue: "Assagao Studio",
    venueId: "ws_003",
    date: "Next Wednesday",
    time: "5:30 PM",
    format: "Speed networking + skill trade",
    description: "Bring one skill, leave with three. Devs teach designers, designers teach marketers, marketers teach everyone how to actually ship.",
    icebreaker: "Your worst client story in 30 seconds",
    expectedTurnout: 16,
    rsvpCount: 9,
    isAiGenerated: false,
    tags: ["networking", "skills", "sunset"],
    createdAt: "2024-06-13T14:00:00Z"
  }
];

// GET /api/meetups
router.get('/', (req, res) => {
  res.json({ count: meetups.length, meetups });
});

// POST /api/meetups/:id/rsvp
router.post('/:id/rsvp', (req, res) => {
  const meetup = meetups.find(m => m.id === req.params.id);
  if (!meetup) return res.status(404).json({ error: 'Meetup not found' });

  meetup.rsvpCount += 1;

  res.json({
    success: true,
    message: `You're going to ${meetup.title}! See you there 🎉`,
    meetup,
  });
});

// POST /api/meetups — create new meetup/session
router.post('/', (req, res) => {
  const { title, description, venue, date, time, format, tags, createdBy } = req.body;

  const newMeetup = {
    id: `meet_${Date.now()}`,
    title,
    description,
    venue,
    date,
    time,
    format: format || 'Open session',
    tags: tags || [],
    rsvpCount: 1,
    expectedTurnout: 10,
    isAiGenerated: false,
    createdBy,
    createdAt: new Date().toISOString(),
  };

  meetups.unshift(newMeetup);

  res.status(201).json({
    success: true,
    message: 'Meetup created! It will appear in the community feed.',
    meetup: newMeetup,
  });
});

module.exports = router;
