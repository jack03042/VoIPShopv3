const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const cors = require('cors');

// Enable CORS for your front-end domain
const corsOptions = {
  origin: ['https://www.voipshop.co.za', 'https://voipshop.co.za'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// Now, your existing routes will respect the CORS settings.

// Correctly position the Paystack key route before static file serving and catch-all
app.get('/paystack-key', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ key: process.env.PAYSTACK_PUBLIC_KEY });
});

// Serve static files from the 'docs' directory instead of 'public'
app.use(express.static('docs'));

// Send the main index.html file in response to any route not handled above
// Update the path here as well to 'docs/index.html'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(express.static(path.join(__dirname, 'docs')));
