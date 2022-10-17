
require("dotenv").config();
const { createClient } = require('redis');

    let hostname = process.env.REDIS_HOSTNAME;
    let port = process.env.REDIS_PORT;
    let password = process.env.REDIS_PASSWORD ;


const client = createClient({
    url: `redis://default:${password}@${hostname}:${port}`
 });


client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

module.exports = client
