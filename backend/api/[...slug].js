const serverless = require("serverless-http");
const app = require("../src/server"); // Import your Express app

// Remove the app.listen() call in server.js before deploying
module.exports = serverless(app);
