const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Send the main index.html file in response to any route not handled above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/paystack-key', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ key: process.env.PAYSTACK_PUBLIC_KEY });
});


