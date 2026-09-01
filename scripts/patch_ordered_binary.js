const fs = require('fs');
const path = require('path');
for (const file of ['node_modules/ordered-binary/dist/index.cjs', 'node_modules/ordered-binary/index.js']) {
  const fullPath = path.resolve(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(
      'position += target.utf8Write(key, position, 0xffffffff)',
      'position += target.utf8Write(key, position)'
    ).replace(
      'position += target.utf8Write(key, position, 0xffffffff);',
      'position += target.utf8Write(key, position);'
    );
    fs.writeFileSync(fullPath, content);
  }
}
