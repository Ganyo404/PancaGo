const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');

const replacements = [
  { from: /source=\{\{\s*uri:\s*avatarUri\s*\}\}/g, to: 'source={avatarUri}' },
  { from: /source=\{\{\s*uri:\s*av\.image\s*\}\}/g, to: 'source={av.image}' },
  { from: /source=\{\{\s*uri:\s*char\.image\s*\}\}/g, to: 'source={char.image}' },
  { from: /source=\{\{\s*uri:\s*item\.image\s*\}\}/g, to: 'source={item.image}' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  for (const { from, to } of replacements) {
    newContent = newContent.replace(from, to);
  }

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${path.basename(filePath)}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

walkDir(componentsDir);
console.log('Done!');
