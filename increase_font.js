const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');

function increaseFont(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Find fontSize: <number> and increase by 2
  const updatedContent = content.replace(/fontSize:\s*(\d+)/g, (match, p1) => {
    const newSize = parseInt(p1, 10) + 3; // +3 for a noticeable difference for kids
    return `fontSize: ${newSize}`;
  });

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated fonts in ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.js')) {
      increaseFont(fullPath);
    }
  }
}

walkDir(componentsDir);
console.log('Done!');
