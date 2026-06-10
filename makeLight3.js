const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { from: /text-emerald-400/g, to: 'text-emerald-600' },
  { from: /text-rose-400/g, to: 'text-rose-600' },
  { from: /text-amber-400/g, to: 'text-amber-600' },
  { from: /text-blue-400/g, to: 'text-blue-600' },
  { from: /text-red-400/g, to: 'text-red-600' },
  { from: /text-indigo-400/g, to: 'text-indigo-600' },
  { from: /text-rose-300/g, to: 'text-rose-600' },
  { from: /text-blue-300/g, to: 'text-blue-600' },
  { from: /text-emerald-300/g, to: 'text-emerald-600' },
  { from: /text-amber-300/g, to: 'text-amber-600' },
  { from: /bg-white\/20/g, to: 'bg-black/5' },
  { from: /border-white\/5/g, to: 'border-black/5' },
  { from: /bg-white\/10/g, to: 'bg-black/5' },
  { from: /bg-white\/5/g, to: 'bg-black/5' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }

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
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      processFile(fullPath);
    }
  }
}

walkDir(srcDir);
