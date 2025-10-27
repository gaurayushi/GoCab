// db/database.js
const mongoose = require('mongoose');

async function connectToDb() {
  const uri = process.env.DB_CONNECT;
  if (!uri) throw new Error('DB_CONNECT is missing. Check your .env file.');

  try {
    await mongoose.connect(uri);
    console.log('Connected to database');
  } catch (err) {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  }
}
module.exports = connectToDb;
