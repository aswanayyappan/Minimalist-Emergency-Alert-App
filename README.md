# Minimalist Emergency Alert App

A high-performance, minimalist emergency alert system prototype designed for rapid response. This application allows users to send immediate distress signals with their precise real-time location to a predefined Telegram recipient.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![React](https://img.shields.io/badge/react-18.x-61dafb.svg)

## 🚀 Features

- **One-Tap Alerts**: Instant buttons for POLICE, MEDICAL, and FIRE emergencies.
- **Real-Time Geolocation**: Automatically fetches the user's GPS coordinates using the browser's Geolocation API.
- **Telegram Integration**: 100% free and reliable notifications delivered via a Telegram Bot.
- **Interactive Map Pins**: Receives real-time location pins directly in the Telegram app.
- **Premium UI**: Modern dark-mode aesthetic with smooth animations (Framer Motion) and glassmorphism.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS 4, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, Axios.
- **Notifications**: Telegram Bot API.

## 📦 Project Structure

```text
/
├── backend/            # Express server and Telegram logic
├── "Minimalist..." /   # React frontend (Vite project)
├── LICENSE             # MIT License
└── .gitignore          # Protected secrets (ignores .env)
```

## ⚙️ Setup Instructions

### 1. Telegram Bot Setup
1. Message [@BotFather](https://t.me/botfather) on Telegram to create a new bot and get your **API Token**.
2. Message [@userinfobot](https://t.me/userinfobot) to get your **Chat ID**.

### 2. Backend Configuration
Navigate to the `backend` folder and create a `.env` file:
```env
PORT=3000
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

### 3. Installation
Run the following commands in separate terminals:

**Start Backend:**
```bash
cd backend
npm install
npm start
```

**Start Frontend:**
```bash
cd "Minimalist Emergency Alert App"
npm install
npm run dev
```

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
