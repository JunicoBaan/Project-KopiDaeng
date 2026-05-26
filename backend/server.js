const app = require('./app');
const http = require('http');

const PORT = process.env.PORT || 5000;
app.set('port', PORT);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
