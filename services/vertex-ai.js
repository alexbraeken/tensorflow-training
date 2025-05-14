const { PredictionServiceClient } = require('@google-cloud/aiplatform');
const client = new PredictionServiceClient();

async function predictIntent(text) {
  const endpoint = `projects/YOUR_PROJECT/locations/us-central1/endpoints/YOUR_ENDPOINT_ID`;

  // Format input to match your model's requirements
  const instance = {
    text,
    features: [
      text.includes('BR') ? 1 : 0,
      text.includes('#') ? 1 : 0,
      text.includes('$') ? 1 : 0,
      text.split(' ').length / 10
    ]
  };

  const [response] = await client.predict({
    endpoint,
    instances: [instance],
  });

  // Map to your intent classes
  const intents = ['property_search', 'property_detail'];
  const prediction = response.predictions[0];
  
  return {
    intent: intents[prediction.classes[0]],
    confidence: prediction.scores[0]
  };
}

module.exports = { predictIntent };