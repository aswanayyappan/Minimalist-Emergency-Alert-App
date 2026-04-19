require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Memory-based Rate Limiting (Prevent requests within 3 seconds)
const lastRequestTimes = new Map();
const RATE_LIMIT_MS = 3000;

// Alert Type Mapping
const ALERT_MAP = {
  POLICE: '🚓 POLICE ALERT',
  AMBULANCE: '🚑 MEDICAL ALERT',
  FIRE: '🚒 FIRE ALERT'
};

/**
 * POST /alert
 * Receives emergency alerts and sends them to a Telegram Bot
 */
app.post('/alert', async (req, res) => {
  try {
    const { type, lat, lon } = req.body;
    const clientIp = req.ip;

    // 1. Basic Rate Limiting check
    const now = Date.now();
    const lastRequest = lastRequestTimes.get(clientIp);
    if (lastRequest && (now - lastRequest < RATE_LIMIT_MS)) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    lastRequestTimes.set(clientIp, now);

    // 2. Validate request body
    if (!ALERT_MAP[type] || lat === undefined || lon === undefined) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const alertLabel = ALERT_MAP[type];

    // 3. Send Text Message
    const messageBody = `<b>${alertLabel}</b>\n\nEmergency detected.\n\nLocation Link:\nhttps://maps.google.com/?q=${lat},${lon}`;
    
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: messageBody,
      parse_mode: 'HTML'
    });

    // 4. Send Real Location Pin
    await axios.post(`https://api.telegram.org/bot${botToken}/sendLocation`, {
      chat_id: chatId,
      latitude: lat,
      longitude: lon
    });

    console.log(`[SUCCESS] ${type} Alert sent to Telegram Chat ${chatId}`);
    return res.status(200).json({ status: 'sent' });

  } catch (error) {
    console.error('[ERROR] Telegram alert failed:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: 'Failed to send Telegram alert' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Emergency Alert Backend (Telegram) running on port ${PORT}`);
});
