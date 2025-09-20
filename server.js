// To run this server:
// 1. Make sure you have Node.js installed.
// 2. In your terminal, in the project root directory, run: npm install express cors
// 3. Then run: node server.js
// The server will start on http://localhost:3001

const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'db.json');

// Middleware
app.use(cors()); // Allows requests from your frontend

// Increase the limit to handle larger payloads, e.g., for base64 images.
// Setting a high limit to prevent 413 Payload Too Large errors when saving
// site data with many large, base64-encoded images.
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));


// --- API Endpoints ---

// GET /api/site-content
// Reads the current site content from db.json and returns it.
app.get('/api/site-content', async (req, res) => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading site content from db.json:', error);
    res.status(500).json({ message: 'Error reading site content.' });
  }
});

// POST /api/site-content
// Receives new site content in the request body and overwrites db.json.
app.post('/api/site-content', async (req, res) => {
  try {
    const newContent = req.body;

    if (!newContent || Object.keys(newContent).length === 0) {
      return res.status(400).json({ message: 'No content provided.' });
    }
    
    // Write the new content to db.json, formatting it for readability
    await fs.writeFile(DB_PATH, JSON.stringify(newContent, null, 2), 'utf-8');
    
    res.status(200).json({ message: 'Content updated successfully.' });
  } catch (error) {
    console.error('Error updating site content in db.json:', error);
    res.status(500).json({ message: 'Error updating site content.' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});