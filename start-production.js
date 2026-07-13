const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Sudan News Today in production mode (unified Next.js)...\n');

const buildPath = path.join(__dirname, '.next');

if (!fs.existsSync(buildPath)) {
  console.error('❌ Production build not found at .next!');
  console.log('Please run npm run build first.\n');
  process.exit(1);
}

const dev = false;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) {
      console.error('❌ Failed to start custom Next.js server:', err);
      process.exit(1);
    }
    console.log(`✅ Next.js server running on port ${port}`);
  });
}).catch((err) => {
  console.error('❌ Error preparing Next.js application:', err);
  process.exit(1);
});
