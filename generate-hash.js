const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'Admin123!';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log('=================================');
  console.log('🔑 Mot de passe:', password);
  console.log('📝 Hash généré:');
  console.log(hash);
  console.log('=================================');
  console.log('\nCopiez ce hash et exécutez la requête SQL:');
  console.log(`UPDATE administrateurs SET password_hash = '${hash}' WHERE username = 'admin';`);
}

generateHash();