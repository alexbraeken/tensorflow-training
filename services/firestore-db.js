const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore();

async function getCache(key) {
  const doc = await db.collection('cache').doc(key).get();
  return doc.exists ? doc.data().value : null;
}

async function setCache(key, value, ttl = 3600) {
  await db.collection('cache').doc(key).set({
    value,
    expires: Date.now() + ttl * 1000
  });
}

module.exports = { getCache, setCache };