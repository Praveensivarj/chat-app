const fs = require('fs');
const path = require('path');

const dirs = [
  'src/config',
  'src/controllers',
  'src/routes',
  'src/middleware',
  'src/models',
  'src/services',
  'src/helpers',
  'src/validators',
  'src/types',
  'src/sockets',
  'src/infrastructure/database',
  'src/infrastructure/redis',
  'src/infrastructure/storage',
  'src/errors',
  'src/docs',
  'migrations',
  'seeders',
  'scripts',
  'tests/unit',
  'tests/integration',
  'tests/websocket',
  'keys'
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

console.log('Directories scaffolded successfully.');
