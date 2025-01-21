const path = require('path');
const Post = require('../models/Post');
const { z } = require('zod');
const Validator = require('validatorjs');

function validationZod(request) {
  const postSchema = z.object({
    user_id: z.number().int().positive().min(1, 'user_id is required'),
    title: z.string().min(1, 'title is required'),
    description: z.string().min(1, 'description is required'),
  });

  const parsedData = postSchema.safeParse(request);

  return parsedData;
}

function validationInput(request) {
  let error = [];
  let image_error = [];
  const file = request.files?.image;
  const mimeType = file?.mimetype.split('/')[0];

  if (!file) {
    image_error.push('image tidak boleh kosong.');
  } else if (mimeType !== 'image') {
    image_error.push('Hanya file gambar yang diperbolehkan (JPG, JPEG, PNG)');
  } else if (file?.size > 200 * 1024) {
    image_error.push('Ukuran file gambar tidak boleh lebih dari 200KB');
  }

  const rules = {
    user_id: 'required|integer|min:1',
    title: 'required|min:1',
    description: 'required|min:1',
  };

  Validator.useLang('id');
  const validation = new Validator(request, rules);
  const validation_error = validation.errors.all();

  return {
    fails: validation.fails(),
    errors: {
      ...validation_error,
      image_error,
    },
  };
}

const PostController = {
  // INDEX: Menampilkan semua post
  async index(req, res) {
    try {
      const posts = await Post.findAll(); // Mengambil semua data post

      res.status(200).json({
        success: true,
        message: 'Data berhasil ditemukan',
        data: posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        errors: error.message,
      });
    }
  },

  // STORE: Menambahkan post baru
  async store(req, res) {
    try {
      const { user_id, title, description } = req.body;

      const validateRequest = validationInput({
        ...req.body,
        files: req.files || {},
      });

      if (validateRequest.fails) {
        return res.status(400).json({
          success: false,
          message: 'periksa kembali inputan anda',
          errors: validateRequest.errors,
        });
      }

      let image = null;
      if (req.files?.image) {
        const file = req.files.image;
        const ext = path.extname(file.name);
        image = 'post-image-' + file.md5 + new Date().getTime() + ext;

        file.mv(`./public/uploads/${image}`, async err => {
          if (err) {
            return res.json({ success: false, message: err.message });
          }
        });
      }

      const post = await Post.create({
        user_id,
        title,
        description,
        image,
      });

      res.status(201).json({
        success: true,
        message: 'Data berhasil disimpan',
        data: post,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        errors: error.message,
      });
    }
  },

  // SHOW: Menampilkan post berdasarkan ID
  async show(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id); // Mengambil post berdasarkan ID

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post tidak ditemukan',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Data berhasil ditemukan',
        data: post,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        errors: error.message,
      });
    }
  },

  // UPDATE: Memperbarui post berdasarkan ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const { user_id, title, description } = req.body;

      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post tidak ditemukan',
        });
      }

      post.user_id = user_id || post.user_id;
      post.title = title || post.title;
      post.description = description || post.description;

      await post.save();

      res.status(200).json({
        success: true,
        message: 'Data berhasil diperbarui',
        data: post,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan',
        errors: error.message,
      });
    }
  },

  // DELETE: Menghapus post berdasarkan ID
  async delete(req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post tidak ditemukan',
        });
      }

      await post.destroy();

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

module.exports = PostController;
