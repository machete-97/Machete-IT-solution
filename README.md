# Machete IT Solution

This project is a small Node.js + Express website for Machete IT Solution.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on `.env.example` and add your email/WhatsApp settings.
3. Start the app:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000`

## Deployment

This app is ready to deploy to any Node-compatible host.

### Recommended hosts

- Render
- Railway
- Heroku
- Vercel (with serverless Express adapter)

### Render / Heroku setup

1. Push the repo to GitHub.
2. Create a new service/app on the host.
3. Set the build command to:
   ```bash
   npm install
   ```
4. Set the start command to:
   ```bash
   npm start
   ```
5. Add environment variables from `.env.example`.

### Notes

- `server.js` serves `index.html` and provides `/api/contact`.
- The website references `/_sdk/element_sdk.js` and `/_sdk/data_sdk.js`, so those SDK files should be added to the repo or served from the same host.
- Keep updating `index.html` while the site remains published; redeploy when ready.
