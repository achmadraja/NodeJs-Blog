require('dotenv').config(); // Load environment variables from .env
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri); // No need for deprecated options

async function connect() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Connection failed:", err);
    } finally {
        await client.close();
    }
}

connect();