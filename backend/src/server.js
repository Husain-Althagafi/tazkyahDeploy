// backend/src/server.js
const app = require('./app');
const path = require('path');
const express = require('express')
//env
const PORT = process.env.PORT || 5005;

//Listen only in development

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../../build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });

app.listen(PORT, () => {
    console.log(`Server is running on 0.0.0.0${PORT}`);
});


module.exports = app;