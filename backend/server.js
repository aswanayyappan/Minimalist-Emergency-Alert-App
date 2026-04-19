require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// 1. Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// 2. Session Management (Pure Express Session)
app.use(session({
  secret: process.env.SESSION_SECRET || 'emergency_alert_secret_123',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

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

    // Store Google Profile in session
    req.session.user = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    };

    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard`);
  } catch (error) {
    console.error('[AUTH ERROR] Details:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/signup?error=auth_failed`);
  }
});

app.get('/auth/status', (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.json({ status: 'logged out' });
});

// Health Check
app.get('/status', (req, res) => res.json({ status: 'online' }));

// 4. Secured Alert Route
app.post('/alert', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized: Please login first' });
  }

  try {
    const { type, lat, lon } = req.body;
    const user = req.session.user;

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
