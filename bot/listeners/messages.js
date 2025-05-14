const { detectIntent } = require('../logic/intent');

async function handleMessage({ message, say }) {
  try {
    const { intent, entities } = await detectIntent(message.text);
    
    let response;
    switch(intent) {
      case 'property_search':
        response = `Searching ${entities.location} for ${entities.bedrooms || ''}BR properties...`;
        break;
      case 'property_detail':
        response = `Fetching details for property #${entities.propertyId}...`;
        break;
      default:
        response = "I'll need to check that for you...";
    }

    await say(response);
  } catch (error) {
    console.error('Error processing message:', error);
    await say("Oops! I encountered an error.");
  }
}

module.exports = handleMessage;