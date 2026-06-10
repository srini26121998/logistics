const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Match className="...rounded-2xl...p-4..."
  content = content.replace(/className=(["'])(.*?rounded-[23]xl.*?p-[4-8].*?)\1/g, (match, quote, classes) => {
      if (!classes.includes('card-3d')) {
          return `className=${quote}${classes} card-3d${quote}`;
      }
      return match;
  });

  // Match className={`...rounded-2xl...p-4...`}
  content = content.replace(/className=\{`([^`]*rounded-[23]xl[^`]*p-[4-8][^`]*)`\}/g, (match, classes) => {
      if (!classes.includes('card-3d')) {
          return `className={\`${classes} card-3d\`}`;
      }
      return match;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(srcDir);
