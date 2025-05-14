const { ModelsClient, EndpointsClient } = require('@google-cloud/aiplatform');

const clients = {
  model: new ModelsClient(),
  endpoint: new EndpointsClient()
};

async function deployModel() {
  // 1. Upload model
  const [model] = await clients.model.uploadModel({
    parent: 'projects/slackbot-ai/locations/us-central1',
    model: {
      displayName: 'slackbot_intent_js',
      artifactUri: 'gs://slackbot-ai-models/intent_model',
      containerSpec: {
        imageUri: 'us-docker.pkg.dev/vertex-ai/prediction/tf2-cpu.2-11:latest'
      }
    }
  });

  // 2. Create endpoint
  const [endpoint] = await clients.endpoint.createEndpoint({
    parent: 'projects/slackbot-ai/locations/us-central1',
    endpoint: {
      displayName: 'slackbot-intent-endpoint'
    }
  });

  // 3. Deploy model to endpoint
  await clients.endpoint.deployModel({
    endpoint: endpoint.name,
    deployedModel: {
      model: model.name,
      displayName: 'slackbot-intent-js'
    },
    trafficSplit: { '0': 100 }
  });

  console.log(`Model deployed to: ${endpoint.name}`);
}

deployModel();