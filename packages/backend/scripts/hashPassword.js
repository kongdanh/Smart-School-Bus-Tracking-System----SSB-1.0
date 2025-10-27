// backend/scripts/hashPassword.js
const bcrypt = require('bcryptjs');

async function hashPassword(plainPassword) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(plainPassword, salt);
    
    console.log('====================================');
    console.log('Plain Password:', plainPassword);
    console.log('Hashed Password:', hashed);
    console.log('====================================');
    console.log('\nCopy SQL để update vào database:');
    console.log(`UPDATE user SET password = '${hashed}' WHERE userCode = 'QL001';`);
    console.log('====================================');
    
    return hashed;
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

// Test hash password
const passwordToHash = process.argv[2] || '123456';
hashPassword(passwordToHash);