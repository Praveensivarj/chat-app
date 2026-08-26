"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const args = process.argv.slice(2);
const command = args[0];
if (!command) {
    // Run all seeders
    console.log('Running all seeders...');
    (0, child_process_1.execSync)('npx sequelize-cli db:seed:all', { stdio: 'inherit' });
}
else {
    // Create a new seeder
    console.log(`Creating seeder: ${command}`);
    (0, child_process_1.execSync)(`npx sequelize-cli seed:generate --name ${command}`, { stdio: 'inherit' });
}
