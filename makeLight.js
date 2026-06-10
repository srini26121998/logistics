const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Layout and background colors
  { from: /bg-\[\#0A0A0B\]/g, to: 'bg-slate-50' },
  { from: /bg-slate-950/g, to: 'bg-white' },
  { from: /bg-slate-900/g, to: 'bg-slate-100' },
  { from: /bg-slate-800/g, to: 'bg-slate-200' },
  { from: /bg-slate-700/g, to: 'bg-slate-300' },
  
  // Text colors
  { from: /text-slate-400/g, to: 'text-slate-500' },
  { from: /text-slate-300/g, to: 'text-slate-600' },
  { from: /text-slate-200/g, to: 'text-slate-700' },
  { from: /text-slate-100/g, to: 'text-slate-800' },
  
  // Specifically handled "white" replacement so buttons don't break.
  // Generally, bg-indigo-600 uses text-white. 
  // Let's replace standalone text-white if it's likely a heading/paragraph color.
  // Actually, replacing text-white is risky. Let's look for "hover:text-white" -> "hover:text-slate-900"
  { from: /hover:text-white/g, to: 'hover:text-indigo-600' },
  
  // Borders
  { from: /border-slate-800/g, to: 'border-slate-200' },
  { from: /border-slate-700/g, to: 'border-slate-300' },
  { from: /border-slate-600/g, to: 'border-slate-400' },
  { from: /border-white\/10/g, to: 'border-black/5' },
  { from: /border-white\/20/g, to: 'border-black/10' },

  // Gradients
  { from: /from-slate-950/g, to: 'from-slate-50' },
  { from: /from-slate-900/g, to: 'from-slate-100' },
  { from: /via-slate-900/g, to: 'via-slate-100' },
  { from: /to-slate-900/g, to: 'to-slate-100' },
  { from: /to-slate-950/g, to: 'to-slate-50' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }

  // A couple of manual text-white replacements:
  // If it's a heading `text-white`, we want `text-slate-900`. But if it's inside a button like `bg-indigo-600 text-white`, we keep it.
  // Since we can't easily parse that, we might just leave text-white alone and see how it looks, or replace `text-white` with `text-slate-900` ONLY if it doesn't have a solid colored bg.
  // Actually, let's just do text-white -> text-slate-900 because in dark themes, everything is text-white. Wait, primary buttons are usually text-white in BOTH.
  // I will only replace "text-white" if it's not preceded/followed by bg-indigo, bg-blue, bg-brand etc.
  
  // This regex matches `text-white` not preceded or followed by `bg-indigo` in the same class string.
  // Simpler approach: replace all text-white, then fix buttons. But fixing buttons is hard.
  // Let's replace " text-white" with " text-slate-900".
  
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
