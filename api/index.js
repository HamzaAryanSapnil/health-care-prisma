// Vercel serverless function entry point
// Import the Express app (not the server bootstrap)
const app = require('../dist/app.js').default;

// Export as Vercel serverless function handler
module.exports = app;

