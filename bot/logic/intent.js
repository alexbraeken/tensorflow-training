const { predictIntent } = require('../../services/vertex-ai');
const { getCache, setCache } = require('../../services/firestore-db');

// Enhanced with entity extraction
async function detectIntent(text) {
  // Check cache first
  const cached = await getCache(text);
  if (cached) return cached;

  // Predict with Vertex AI
  const { intent, confidence } = await predictIntent(text);

  // Extract entities
  const entities = {
    bedrooms: text.match(/\d+(?=BR)/i)?.[0],
    propertyId: text.match(/#(\d+)/)?.[1],
    location: text.match(/in\s+(\w+)/i)?.[1]
  };

  const result = { intent, confidence, entities };

  // Cache result (1 hour TTL)
  await setCache(text, result, 3600);
  return result;
}

module.exports = { detectIntent };