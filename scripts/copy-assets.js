const fs = require('fs');

fs.mkdirSync('dist/docs', { recursive: true });
fs.copyFileSync('src/docs/swagger.json', 'dist/docs/swagger.json');

console.log('swagger.json copied to dist/docs');
