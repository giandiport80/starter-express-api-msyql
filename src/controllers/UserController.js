const User = require('../models/User'); // Import model User

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
        message: 'Terjadi kesalahan',
        errors: error.message,
      });
    }
  },

  // STORE: Menambahkan user baru
  async store(req, res) {
    try {
      const { name, username, email, password } = req.body;

      if (!name || !username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Semua kolom wajib diisi',
        });
      }

      const user = await User.create({ name, username, email, password });

      res.status(201).json({
        success: true,
        message: 'Data berhasil disimpan',
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        errors: error.message,
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
        message: 'Terjadi kesalahan',
        errors: error.message,
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
        message: 'Terjadi kesalahan',
        errors: error.message,
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
        message: 'Terjadi kesalahan',
        errors: error.message,
      });
    }
  },
};

module.exports = UserController;
