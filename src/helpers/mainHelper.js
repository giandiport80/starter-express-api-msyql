require('dotenv').config();

function generateAccessToken(payload, expiresIn = '1h') {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  } catch (error) {
    throw new Error(`Error generating access token: ${error.message}`);
  }
}

function generateRefreshToken(payload, expiresIn = '7d') {
  try {
    return jwt.sign(payload, process.env.J, { expiresIn });
  } catch (error) {
    throw new Error(`Error generating refresh token: ${error.message}`);
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
