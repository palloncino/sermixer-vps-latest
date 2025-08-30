const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle client-side routing by serving index.html for non-static routes
app.get('*', (req, res) => {
  // Check if the request is for a static file
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot', '.json'];
  const ext = path.extname(req.path);
  
  if (staticExtensions.includes(ext)) {
    // For static files, try to serve them directly
    const filePath = path.join(__dirname, 'build', req.path);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  
  // For all other routes, serve index.html with environment variables injected
  const indexPath = path.join(__dirname, 'build', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Inject environment variables into the HTML
  const envScript = `
    <script>
      window.REACT_APP_API_URL = "${process.env.REACT_APP_API_URL || 'http://sermixer.micro-cloud.it:12923/v3.0/api'}";
      window.REACT_APP_BASE_URL = "${process.env.REACT_APP_BASE_URL || 'http://sermixer.micro-cloud.it:12923/v3.0'}";
      window.PUBLIC_URL = "${process.env.PUBLIC_URL || '/v3.0'}";
    </script>
  `;
  
  // Insert the script before the closing </head> tag
  html = html.replace('</head>', `${envScript}\n</head>`);
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Static server running on port ${PORT}`);
  console.log(`Serving files from: ${path.join(__dirname, 'build')}`);
});
