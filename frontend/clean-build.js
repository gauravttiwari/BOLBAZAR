const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '.next');

function cleanNextBuild() {
  console.log('🧹 Cleaning .next directory...');
  
  if (fs.existsSync(nextDir)) {
    try {
      fs.rmSync(nextDir, { recursive: true, force: true });
      console.log('✅ .next directory cleaned successfully');
    } catch (error) {
      console.error('❌ Error cleaning .next:', error.message);
      process.exit(1);
    }
  } else {
    console.log('ℹ️  .next directory does not exist (already clean)');
  }
}

cleanNextBuild();
