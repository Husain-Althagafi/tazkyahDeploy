// backend/src/server.js
const app = require('./app');

//env
const PORT = process.env.BACKEND_PORT || 5005;

//Listen only in development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;