import { execSync } from 'child_process';

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  // Run all seeders
  console.log('Running all seeders...');
  execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit' });
} else {
  // Create a new seeder
  console.log(`Creating seeder: ${command}`);
  execSync(`npx sequelize-cli seed:generate --name ${command}`, { stdio: 'inherit' });
}
