const path = require('path');

/**
 * Upload a file to a specified directory with validation options.
 * needed package express-file-upload
 *
 * @param {Object} files - The file(s) to be uploaded, typically from `req.files`.
 * @param {Object} options - Configuration options for file upload.
 * @param {number} options.maxSize - The maximum allowed file size in bytes.
 * @param {Array<string>} options.allowedTypes - The allowed MIME types for the file.
 * @param {string} [options.directory='uploads'] - The directory where the file will be saved.
 * @param {boolean} [options.multiple=false] - Whether multiple files are allowed. If true, returns an array of filenames.
 * @returns {string|Array<string>} - The uploaded file's name(s), either as a string or an array depending on `multiple`.
 * @throws {Error} If the file exceeds the size limit, has an invalid type, or fails to upload.
 */
function uploadFileUtil(
  files,
  { maxSize, allowedTypes, directory = 'uploads', multiple = false }
) {
  if (!files || files.length === 0) {
    throw new Error('No files uploaded');
  }

  let uploadDir = path.join(__dirname, directory);
  let uploadedFileNames = [];

  let filesArray = Array.isArray(files) ? files : [files];

  filesArray.forEach(file => {
    if (maxSize && file.size > maxSize) {
      throw new Error(
        `File ${file.name} exceeds the size limit of ${maxSize} bytes`
      );
    }

    if (allowedTypes && !allowedTypes.includes(file.mimetype)) {
      throw new Error(`File ${file.name} type is not allowed`);
    }

    let uploadedFileName = file.name;
    let uploadPath = path.join(uploadDir, uploadedFileName);

    file.mv(uploadPath, err => {
      if (err) {
        throw err;
      }
    });

    uploadedFileNames.push(uploadedFileName);
  });

  return multiple ? uploadedFileNames : uploadedFileNames[0];
}

module.exports = uploadFileUtil;
