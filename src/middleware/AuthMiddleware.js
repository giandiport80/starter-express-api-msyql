const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const userDecoded = jwt.verify(token, jwtConfig.JWT_ACCESS_KEY);
    req.user = userDecoded;

    const userExist = await User.findOne({ where: { id: userDecoded.id } });

    if (!userExist) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (userExist.remember_token == null) {
      return res
        .status(401)
        .json({ message: 'User telah logout, token invalid' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
