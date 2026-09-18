import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// Ensure dist directory exists before serving
if (!fs.existsSync(DIST_DIR)) {
  console.warn('⚠️  "dist" directory not found. Please run "npm run build" first.');
}

// Enable CORS & Security Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static assets with caching
app.use(
  express.static(DIST_DIR, {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, filePath) => {
      // Don't cache HTML to ensure instant updates
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }
    },
  })
);

// Fallback SPA routing for React (all routes serve index.html)
app.use((req, res) => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).send('Application is building. Please run "npm run build" and restart the server.');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Global Trades Node.js server running on port ${PORT}`);
  console.log(`👉 Access URL: http://localhost:${PORT}`);
});
