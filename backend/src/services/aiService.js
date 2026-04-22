const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Match workspaces to user's work style using Claude
 */
async function matchWorkspaces(userProfile, workspaces) {
  const prompt = `You are NomadNest AI, an expert coworking space matcher for digital nomads in Goa, India.

USER PROFILE:
- Work Style: ${userProfile.workStyle} (deep-focus / calls / creative / mixed)
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Preferred Hours: ${userProfile.preferredHours || 'flexible'}
- Must-haves: ${userProfile.mustHaves?.join(', ') || 'reliable WiFi'}
- Budget: ${userProfile.budget || 'any'}
- Current mood/need: ${userProfile.mood || 'productive session'}

AVAILABLE WORKSPACES IN GOA:
${JSON.stringify(workspaces.map(w => ({
  id: w.id,
  name: w.name,
  area: w.area,
  type: w.type,
  wifiScore: w.wifiScore,
  noiseLevel: w.noiseLevel,
  powerSockets: w.powerSockets,
  amenities: w.amenities,
  currentOccupancy: w.currentOccupancy,
  pricePerDay: w.pricePerDay,
  vibes: w.vibes,
  bestFor: w.bestFor,
})), null, 2)}

Analyze the user's needs and return a JSON response (ONLY JSON, no markdown) with this exact structure:
{
  "recommendations": [
    {
      "workspaceId": "string",
      "score": 95,
      "matchReason": "2-3 sentence explanation of why this is perfect for them",
      "bestTimeToGo": "morning / afternoon / evening",
      "proTip": "One insider tip specific to this space",
      "warningIfAny": "Any caveat or thing to watch out for, or null"
    }
  ],
  "personalizedMessage": "A warm, encouraging 1-2 sentence message addressing their work style and goals today",
  "alternativeSuggestion": "If none are perfect, suggest what to look for or try"
}

Return top 3-5 workspace matches ordered by relevance score. Be specific, not generic.`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = response.content[0].text.trim();
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in AI response');
    
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('[AI] matchWorkspaces error:', err.message);
    // Return graceful fallback
    return {
      recommendations: workspaces.slice(0, 3).map((w, i) => ({
        workspaceId: w.id,
        score: 85 - i * 10,
        matchReason: `${w.name} is a great option for ${userProfile.workStyle} work with a WiFi score of ${w.wifiScore}/10.`,
        bestTimeToGo: 'morning',
        proTip: 'Arrive early to grab the best spot.',
        warningIfAny: null,
      })),
      personalizedMessage: "Here are some great spots for your work session in Goa today!",
      alternativeSuggestion: "Try exploring cafés in Assagao or Anjuna for quieter spots.",
    };
  }
}

/**
 * Generate weekly meetup suggestions
 */
async function generateMeetupSuggestion(nomads, workspaces) {
  const skills = [...new Set(nomads.flatMap(n => n.skills || []))];
  const areas = [...new Set(nomads.map(n => n.currentArea).filter(Boolean))];

  const prompt = `You are NomadNest AI organizing a meetup for digital nomads in Goa.

CURRENT NOMAD COMMUNITY:
- Total active nomads: ${nomads.length}
- Skills present: ${skills.join(', ')}
- Areas they're in: ${areas.join(', ')}

AVAILABLE VENUES:
${workspaces.filter(w => w.hostsMeetups).map(w => `- ${w.name} (${w.area}), capacity: ${w.meetupCapacity}, has projector: ${w.hasProjector}`).join('\n')}

Generate a creative, specific meetup suggestion as JSON (ONLY JSON):
{
  "title": "Catchy meetup name",
  "theme": "What the meetup is about",
  "suggestedVenue": "venue name",
  "suggestedDay": "This Saturday / Next Wednesday / etc",
  "suggestedTime": "6:00 PM",
  "format": "Lightning talks / Workshop / Casual networking / Skill swap",
  "description": "2-3 sentence exciting description",
  "icebreaker": "A fun icebreaker activity idea",
  "expectedTurnout": 12
}`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = response.content[0].text.trim();
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (err) {
    console.error('[AI] generateMeetup error:', err.message);
    return null;
  }
}

/**
 * Generate collaboration opportunity message
 */
async function generateCollaboMessage(seeker, availableNomads) {
  const prompt = `A digital nomad in Goa is looking for collaborators.

SEEKER:
- Skills: ${seeker.skills?.join(', ')}
- Looking for: ${seeker.lookingFor}
- Project description: ${seeker.projectDescription || 'Not specified'}

AVAILABLE NOMADS (open to collaborate):
${availableNomads.slice(0, 5).map(n => `- ${n.displayName}: ${n.skills?.join(', ')} at ${n.currentLocation}`).join('\n')}

Write a short, warm, specific connection message (2-3 sentences) suggesting who they should reach out to and why. Be conversational, not robotic. Return plain text only.`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });
    return response.content[0].text.trim();
  } catch (err) {
    return "Check out the nomads currently online — there are some great potential collaborators nearby!";
  }
}

module.exports = { matchWorkspaces, generateMeetupSuggestion, generateCollaboMessage };
