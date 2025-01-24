const path = require('path');
const fs = require('fs');
const Validator = require('validatorjs');
Validator.useLang('id');

const express = require('express');

function routeGroup(router, options, callback) {
  const { prefix = '', middleware = [] } = options;
  const subRouter = express.Router();

  middleware.forEach(mw => subRouter.use(mw));

  callback(subRouter);
  router.use(prefix, subRouter);
}

function validateRequest(request, rules, attributeNames = {}) {
  const validator = new Validator(request, rules);

  if (attributeNames) {
    validator.setAttributeNames(attributeNames);
  }

  return validator;
}

/**
 * Helper untuk mengunggah file.
 * menggunakan middleware express-fileupload
 * @param {Object} fileObj - Objek file dari req.files.
 * @param {string} dest - Direktori tujuan untuk menyimpan file.
 * @param {Object} options - Konfigurasi tambahan untuk unggahan file.
 * @param {string} options.filename - Nama file yang diinginkan (tanpa ekstensi).
 * @param {number} options.max_size - Ukuran maksimal file dalam kilobyte (KB).
 * @returns {Object} - Informasi file yang diunggah atau error jika gagal.
 */
function uploadFile(fileObj, dest, options = {}) {
  try {
    if (!fileObj) {
      throw new Error('File tidak ditemukan.');
    }

    const { filename, max_size } = options;
    const maxSizeBytes = (max_size || 10240) * 1024;

    if (fileObj.size > maxSizeBytes) {
      throw new Error(`File melebihi ukuran maksimal ${max_size} KB.`);
    }

    const fileExt = path.extname(fileObj.name);
    if (!fileExt) {
      throw new Error('Ekstensi file tidak valid.');
    }

    const finalFilename = filename ? `${filename}${fileExt}` : fileObj.name;

    const uploadPath = path.join(dest, finalFilename);

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    fileObj.mv(uploadPath);

    return {
      success: true,
      data: {
        filename: finalFilename,
        path: uploadPath,
        size: fileObj.size,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

module.exports = {
  uploadFile,
};

module.exports = {
  routeGroup,
  validateRequest,
};
