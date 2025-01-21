const winston = require('winston');
const path = require('path');
const { format } = require('date-fns');

const currentDate = format(new Date(), 'yyyy-MM-dd');
const logFileName = path.join(__dirname, '../logs', `logs-${currentDate}.log`);

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: logFileName }),
  ],
});

module.exports = logger;
