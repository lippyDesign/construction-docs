const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');

const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

// add cache as a possible function to mongoose
mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  return this; // return this would make this function chainable
}

mongoose.Query.prototype.exec = async function() {
  // if developer does not want to cache
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const k = Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name });
  const key = JSON.stringify(k);
  // see if we have a value for 'key' in redis
  const cacheValue = await client.hget(this.hashKey, key);
  // If we do, return that key
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    // at this point doc could be a single record (JS object) or a collection of records (array of JS objects)
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d)) // if array, iterate over it and make model for every object
      : new this.model(doc) ; // if object, simply return the model for that object
  }
  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);

  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10); // 'EX' is seconds until expire

  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};