"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const args = process.argv.slice(2);
const command = args[0];
if (!command) {
    // Run all migrations
    console.log('Running all pending migrations...');
    (0, child_process_1.execSync)('npx sequelize-cli db:migrate', { stdio: 'inherit' });
}
else {
    // Create a new migration
    console.log(`Creating migration: ${command}`);
    (0, child_process_1.execSync)(`npx sequelize-cli migration:generate --name ${command}`, { stdio: 'inherit' });
}
