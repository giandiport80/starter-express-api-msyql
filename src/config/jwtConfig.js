const jwt = require('jsonwebtoken');

const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY;
const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY;

function generateAccessToken(payload, expiresIn = '1h') {
  try {
    return jwt.sign(payload, JWT_ACCESS_KEY, { expiresIn });
  } catch (error) {
    throw new Error(`Error generating access token: ${error.message}`);
  }
}

function generateRefreshToken(payload, expiresIn = '7d') {
  try {
    return jwt.sign(payload, JWT_REFRESH_KEY, { expiresIn });
  } catch (error) {
    throw new Error(`Error generating refresh token: ${error.message}`);
  }
}

module.exports = {
  JWT_ACCESS_KEY,
  JWT_REFRESH_KEY,
  generateAccessToken,
  generateRefreshToken,
};
