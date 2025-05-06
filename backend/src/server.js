const app = require('./app');
const path = require('path');
const PORT = process.env.PORT || 5005;

// // Production configuration
// if (process.env.NODE_ENV === 'production') {
//   // Serve static files from React app
//   app.use(express.static(path.join(__dirname, '../build')));

//   // Handle React routing - must come AFTER API routes
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../build', 'index.html'));
//   });
// }

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});