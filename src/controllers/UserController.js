const User = require('../models/User'); // Import model User
const bcrypt = require('bcryptjs');
const Validator = require('validatorjs');
Validator.useLang('id');
const logger = require('../config/logger');

const UserController = {
  // INDEX: Menampilkan semua user
  async index(req, res) {
    try {
      const users = await User.findAll(); // Mengambil semua data user

      res.status(200).json({
        success: true,
        message: 'Data berhasil ditemukan',
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan',
      });
    }
  },

  // STORE: Menambahkan user baru
  async store(req, res) {
    try {
      const validator = validateRequest(req.body);
      const { name, username, email, password } = req.body;

      if (validator.fails()) {
        return res.status(400).json({
          success: false,
          message: 'Periksa kembali inputan anda',
          errors: validator.errors,
        });
      }

      const userExist = await User.findOne({ where: { username } });
      if (userExist) {
        const message = 'User sudah ada';
        const error = new Error(message);
        error.code = 400;

        logger.error(message);
        throw error;
      }

      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        success: true,
        message: 'Data berhasil disimpan',
        data: user,
      });
    } catch (error) {
      let code = error.code || 500;
      res.status(code).json({
        success: false,
        message: error.message || 'Terjadi kesalahan',
      });
    }
  },

  // SHOW: Menampilkan user berdasarkan ID
  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id); // Mengambil user berdasarkan ID

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Data berhasil ditemukan',
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan',
      });
    }
  },

  // UPDATE: Memperbarui user berdasarkan ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, username, email, password } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan',
        });
      }

      user.name = name || user.name;
      user.username = username || user.username;
      user.email = email || user.email;
      user.password = password || user.password;

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Data berhasil diperbarui',
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan',
      });
    }
  },

  // DELETE: Menghapus user berdasarkan ID
  async delete(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan',
        });
      }

      await user.destroy();

      res.status(200).json({
        success: true,
        message: 'Data berhasil dihapus',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan',
      });
    }
  },
};

function validateRequest(request, id = null) {
  let rules = {
    name: ['required', 'min:3'],
    username: ['required', 'min:3'],
    email: ['required', 'min:6', 'email'],
    password: ['required', 'min:6'],
  };

  if (id) {
    //
  }

  const validator = new Validator(request, rules);
  validator.setAttributeNames({
    name: 'Nama',
    username: 'Username',
    email: 'Email',
    password: 'Kata Sandi',
  });

  return validator;
}

module.exports = UserController;
