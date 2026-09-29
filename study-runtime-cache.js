const crypto = require('node:crypto');

let cacheFactory;
try {
  ({ getCache: cacheFactory } = require('@vercel/functions'));
} catch (_) {
  cacheFactory = null;
}

const PREFIX = 'aitools4kids:official-study:v1:';

function hashParts(parts) {
  return PREFIX + crypto.createHash('sha256').update(JSON.stringify(parts)).digest('hex');
}

async function getStudyCache(parts) {
  if (!cacheFactory) return null;
  try {
    return await cacheFactory().get(hashParts(parts));
  } catch (_) {
    return null;
  }
}

async function setStudyCache(parts, value, ttl = 604800) {
  if (!cacheFactory) return false;
  try {
    await cacheFactory().set(hashParts(parts), value, {
      ttl,
      tags: ['aitools4kids-official-study'],
    });
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = { getStudyCache, setStudyCache };
