/**
 * Utility script to generate bcrypt password hash for admin
 * Usage: node utils/hashPassword.js YourPassword
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
    console.log('❌ Please provide a password!');
    console.log('Usage: node utils/hashPassword.js YourPassword');
    process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.log('❌ Error hashing password:', err);
        process.exit(1);
    }
    
    console.log('\n🔐 Password Hashing Successful!\n');
    console.log('Original Password:', password);
    console.log('Hashed Password:', hash);
    console.log('\n📝 Copy this hash to your .env file as MASTER_ADMIN_PASSWORD_HASH\n');
});
