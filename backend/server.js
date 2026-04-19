require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// Trust proxy is required for Render/Heroku to set secure cookies
app.set('trust proxy', 1);

// 1. Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());


// 3. Auth Routes (Pure Google OAuth)
app.get('/auth/google', (req, res) => {
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback';
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=profile%20email`;
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback';
  try {
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: callbackUrl
    });

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const userProfile = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    };

    const token = jwt.sign(
      userProfile,
      process.env.SESSION_SECRET || 'emergency_alert_secret_123',
      { expiresIn: '24h' }
    );

    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard?token=${token}`);
  } catch (error) {
    console.error('[AUTH ERROR] Details:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/signup?error=auth_failed`);
  }
});

app.get('/auth/status', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }

  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, process.env.SESSION_SECRET || 'emergency_alert_secret_123');
    res.json({ authenticated: true, user });
  } catch (err) {
    res.json({ authenticated: false });
  }
});

app.get('/auth/logout', (req, res) => {
  // Stateless JWT: logout is handled on the client side by discarding the token
  res.json({ status: 'logged out' });
});

// Health Check
app.get('/status', (req, res) => res.json({ status: 'online' }));

// 4. Secured Alert Route
app.post('/alert', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Please login first' });
  }

  const token = authHeader.split(' ')[1];
  let user;
  try {
    user = jwt.verify(token, process.env.SESSION_SECRET || 'emergency_alert_secret_123');
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  try {
    const { type, lat, lon } = req.body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    const messageBody = `🚨 <b>EMERGENCY ALERT</b>\n\n<b>Type:</b> ${type}\n<b>User:</b> ${user.name}\n<b>Email:</b> ${user.email}\n\n<b>Location:</b>\nhttps://maps.google.com/?q=${lat},${lon}`;
    
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: messageBody,
      parse_mode: 'HTML'
    });

    await axios.post(`https://api.telegram.org/bot${botToken}/sendLocation`, {
      chat_id: chatId,
      latitude: lat,
      longitude: lon
    });

    res.json({ status: 'sent' });
  } catch (error) {
    console.error('[ERROR] Alert failed:', error.message);
    res.status(500).json({ error: 'Failed to send alert' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend with Pure Google OAuth running on port ${PORT}`);
}).on('error', (err) => {
  console.error('[CRITICAL] Server failed to start:', err.message);
});
