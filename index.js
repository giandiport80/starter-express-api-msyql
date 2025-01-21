const app = require('./src/app');
const database = require('./src/config/database');
const logger = require('./src/config/logger');

const PORT = process.env.APP_PORT || 3000;

(async () => {
  try {
    await database.sync({ force: false });
    console.log('Database connected.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error('Unable to start server:', err);
    console.error('Unable to start server:', err);
  }
})();
