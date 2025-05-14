const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

async function getSecret(name) {
  const [version] = await client.accessSecretVersion({
    name: `projects/YOUR_PROJECT/secrets/${name}/versions/latest`
  });
  return version.payload.data.toString();
}

module.exports = { getSecret };