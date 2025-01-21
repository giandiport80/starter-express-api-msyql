const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtConfig = require('../config/jwtConfig');
const User = require('../models/User');

const AuthController = {
  login: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    try {
      const user = await User.findOne({ where: { username } });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username credentials',
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password credentials',
        });
      }

      const accessToken = jwtConfig.generateAccessToken({
        id: user.id,
        role_id: user.role_id,
        username: user.username,
        email: user.email,
      });

      const refreshToken = jwtConfig.generateRefreshToken({
        id: user.id,
        role_id: user.role_id,
        username: user.username,
        email: user.email,
      });

      user.remember_token = refreshToken;
      await user.save();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.APP_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: 'Login successful',
        accessToken,
        refreshToken,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred',
        error: err.message,
      });
    }
  },

  refreshToken: async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    try {
      const decoded = jwt.verify(refreshToken, jwtConfig.JWT_REFRESH_KEY);

      const user = await User.findByPk(decoded.id);
      if (!user || user.remember_token !== refreshToken) {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid refresh token' });
      }

      const newAccessToken = jwtConfig.generateAccessToken({
        id: user.id,
        role_id: user.role_id,
        username: user.username,
        email: user.email,
      });

      return res.json({ accessToken: newAccessToken });
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid refresh token' });
    }
  },

  logout: async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    try {
      if (refreshToken) {
        const decoded = jwt.verify(refreshToken, jwtConfig.JWT_REFRESH_KEY);

        const user = await User.findByPk(decoded.id);
        if (!user || user.remember_token !== refreshToken) {
          return res.status(403).json({ message: 'Invalid refresh token' });
        }

        user.remember_token = null;
        await user.save();

        res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
        });
      }

      return res.json({ message: 'Logout successful' });
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid refresh token' });
    }
  },
};

module.exports = AuthController;
