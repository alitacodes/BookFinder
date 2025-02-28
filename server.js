const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
app.use(cors())

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
// Default route to serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/ai', async (req, res) => {
  const { gemini } = require('./ai');
  console.log(req.body, "====================");
  
  const prompt = req.body.book;
  const response = await gemini(prompt);
  res.json({ response });
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});