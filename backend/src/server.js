// backend/src/server.js
const app = require('./app');

//env
const PORT = process.env.PORT || 5005;

//Listen only in development

    app.listen(PORT, () => {
        console.log(`Server is running on 0.0.0.0${PORT}`);
    });


module.exports = app;