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
      console.warn('⚠️  Could not clean .next directory (files may be locked):', error.message);
      console.log('ℹ️  Continuing anyway...');
    }
  } else {
    console.log('ℹ️  .next directory does not exist (already clean)');
  }
}

cleanNextBuild();
