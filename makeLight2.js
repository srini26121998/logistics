const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Backgrounds
  { from: /bg-\[\#121622\]/g, to: 'bg-white' },
  { from: /bg-black/g, to: 'bg-white' },
  { from: /bg-zinc-900/g, to: 'bg-zinc-100' },
  { from: /bg-zinc-950/g, to: 'bg-white' },
  
  // Specific text colors to fix headings (heuristics)
  { from: /text-white font-bold/g, to: 'text-slate-900 font-bold' },
  { from: /text-white font-extrabold/g, to: 'text-slate-900 font-extrabold' },
  { from: /text-white font-semibold/g, to: 'text-slate-900 font-semibold' },
  { from: /text-3xl font-bold text-white/g, to: 'text-3xl font-bold text-slate-900' },
  { from: /text-4xl font-bold text-white/g, to: 'text-4xl font-bold text-slate-900' },
  { from: /text-xl font-bold text-white/g, to: 'text-xl font-bold text-slate-900' },
  { from: /text-2xl font-bold text-white/g, to: 'text-2xl font-bold text-slate-900' },
  { from: /text-white tracking-tight/g, to: 'text-slate-900 tracking-tight' },
  { from: /text-white mb-/g, to: 'text-slate-900 mb-' },
  { from: /text-white tracking-tighter/g, to: 'text-slate-900 tracking-tighter' },
  { from: /text-white flex/g, to: 'text-slate-900 flex' },
  { from: /text-white placeholder-slate-500/g, to: 'text-slate-900 placeholder-slate-400' },
  { from: /text-slate-200/g, to: 'text-slate-800' },
  { from: /text-slate-300/g, to: 'text-slate-700' },
  { from: /text-slate-400/g, to: 'text-slate-600' },
  
  // Borders
  { from: /border-slate-800/g, to: 'border-slate-200' },
  { from: /border-slate-700/g, to: 'border-slate-300' },
  { from: /border-slate-600/g, to: 'border-slate-400' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Let's also do a regex replace for text-white where it's likely a heading/text color
  // We'll replace text-white if there is NO bg-indigo or bg-blue in the same line
  let lines = content.split('\n');
  lines = lines.map(line => {
    if (line.includes('text-white')) {
      if (!line.includes('bg-indigo') && !line.includes('bg-blue') && !line.includes('bg-brand') && !line.includes('bg-slate-800')) {
        // Safe to replace text-white with text-slate-900
        return line.replace(/text-white/g, 'text-slate-900');
      }
    }
    return line;
  });
  content = lines.join('\n');

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
