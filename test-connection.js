require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('Environment check:');
  console.log('- MONGO_URI present:', !!process.env.MONGO_URI);
  console.log('- MONGO_URI starts with mongodb+srv://', process.env.MONGO_URI?.startsWith('mongodb+srv://'));
  
  try {
    console.log('\nAttempting MongoDB connection...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast for quick testing
    });
    console.log('✅ Successfully connected to MongoDB!');
    await mongoose.disconnect();
    console.log('Cleanly disconnected.');
  } catch (err) {
    console.error('\n❌ MongoDB connection failed:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    if (err.code) console.error('Error code:', err.code);
    
    // Network error details
    if (err.cause) {
      console.error('\nUnderlying cause:');
      console.error('- Name:', err.cause.name);
      console.error('- Message:', err.cause.message);
      console.error('- Code:', err.cause.code);
    }
    
    console.error('\nCommon solutions:');
    console.error('1. Check if MongoDB Atlas IP whitelist includes your current IP');
    console.error('2. Verify the cluster is active in Atlas dashboard');
    console.error('3. Confirm username and password are correct');
    console.error('4. Ensure your network/firewall allows outbound connections to MongoDB');
  }
}

testConnection()
  .catch(console.error)
  .finally(() => process.exit());