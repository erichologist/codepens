const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(express.static('.'));

function getDemos(dir, baseDir = '') {
  const demos = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    if (item.isDirectory()) {
      const subPath = path.join(baseDir, item.name);
      const srcPath = path.join(dir, item.name, 'src');
      const directIndexPath = path.join(dir, item.name, 'index.html');
      
      if (fs.existsSync(srcPath) && fs.existsSync(path.join(srcPath, 'index.html'))) {
        demos.push({
          name: item.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          path: path.join(subPath, 'src', 'index.html')
        });
      } else if (fs.existsSync(directIndexPath)) {
        demos.push({
          name: item.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          path: path.join(subPath, 'index.html')
        });
      } else {
        const subDemos = getDemos(path.join(dir, item.name), subPath);
        demos.push(...subDemos);
      }
    }
  }
  return demos;
}

function getCategories() {
  const codepenDir = './codepen';
  const categories = {};
  
  if (!fs.existsSync(codepenDir)) return categories;
  
  const items = fs.readdirSync(codepenDir, { withFileTypes: true });
  
  for (const item of items) {
    if (item.isDirectory()) {
      const demos = getDemos(path.join(codepenDir, item.name), path.join('codepen', item.name));
      if (demos.length > 0) {
        categories[item.name] = demos;
      }
    }
  }
  
  return categories;
}

app.get('/', (req, res) => {
  const categories = getCategories();
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodePen Collection</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      min-height: 100vh;
      color: #fff;
      padding: 2rem;
    }
    h1 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2.5rem;
      background: linear-gradient(90deg, #e94560, #f8a5c2, #00d9ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .categories {
      max-width: 1200px;
      margin: 0 auto;
    }
    .category {
      margin-bottom: 2rem;
    }
    .category h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid rgba(255,255,255,0.2);
      text-transform: capitalize;
    }
    .demos {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    .demo-card {
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 1.25rem;
      transition: all 0.3s ease;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .demo-card:hover {
      transform: translateY(-5px);
      background: rgba(255,255,255,0.15);
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    .demo-card a {
      color: #fff;
      text-decoration: none;
      font-weight: 500;
      display: block;
    }
    .demo-card a:hover {
      color: #00d9ff;
    }
    .count {
      color: rgba(255,255,255,0.6);
      font-size: 0.9rem;
      margin-left: 0.5rem;
    }
  </style>
</head>
<body>
  <h1>CodePen Collection</h1>
  <div class="categories">`;

  for (const [category, demos] of Object.entries(categories).sort()) {
    html += `
    <div class="category">
      <h2>${category.replace(/-/g, ' ')}<span class="count">(${demos.length})</span></h2>
      <div class="demos">`;
    
    for (const demo of demos) {
      html += `
        <div class="demo-card">
          <a href="/${demo.path}" target="_blank">${demo.name}</a>
        </div>`;
    }
    
    html += `
      </div>
    </div>`;
  }

  html += `
  </div>
</body>
</html>`;

  res.set('Cache-Control', 'no-cache');
  res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
