const mongoose = require('mongoose');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const match = envFile.match(/MONGODB_URI=(.*)/);
const uri = match ? match[1].trim() : null;

async function testConnection() {
  if (!uri) {
    console.error("No MONGODB_URI found in .env");
    process.exit(1);
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(uri);
    console.log("✅ SUCCESS! Connected to MongoDB Atlas.");
    process.exit(0);
  } catch (error) {
    console.error("❌ FAILED to connect:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();
