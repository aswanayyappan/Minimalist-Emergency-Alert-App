# Emergency Alert System Backend

A minimal Node.js backend for an emergency alert prototype.

## Tech Stack
- Node.js & Express
- Twilio SMS API
- CORS & dotenv

## Installation Steps

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Edit the `.env` file and replace the placeholders with your Twilio credentials:
   - `TWILIO_SID`: Your Twilio Account SID
   - `TWILIO_AUTH`: Your Twilio Auth Token
   - `TWILIO_PHONE`: Your Twilio Phone Number
   - `TARGET_PHONE`: The recipient phone number (where alerts will be sent)

4. **Run the server:**
   ```bash
   npm start
   ```
   *(Note: Ensure you have added `"start": "node server.js"` to your `package.json` scripts if you use npm start, or just run `node server.js`)*

## API Specification

### Send Alert
**Endpoint:** `POST /alert`

**Body (JSON):**
```json
{
  "type": "POLICE", 
  "lat": 12.9716,
  "lon": 77.5946
}
```
*Supported types: `POLICE`, `AMBULANCE`, `FIRE`*

**Responses:**
- `200`: Alert sent successfully
- `400`: Invalid data (missing fields or wrong type)
- `429`: Rate limit (requests restricted to once every 3 seconds)
- `500`: SMS sending failed
