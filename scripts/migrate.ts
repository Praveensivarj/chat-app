import { execSync } from 'child_process';
import path from 'path';

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  // Run all migrations
  console.log('Running all pending migrations...');
  execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
} else {
  // Create a new migration
  console.log(`Creating migration: ${command}`);
  execSync(`npx sequelize-cli migration:generate --name ${command}`, { stdio: 'inherit' });
}
