const multer = require('multer');
const FileFilter = require('./file_filter');

module.exports = function uploadFile(fileType) {
    let folder

    switch (fileType) {
        case 'excel':
            folder = 'guest-list'
            break;

        case 'image':
            folder = 'guest-picture'
            break;

        default:
            folder = null
            break;
    }

    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `./uploads/${folder}`)
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${folder}-${file.originalname}`)
        },
    });

    switch (fileType) {
        case 'excel':
            return multer({ storage: storage, fileFilter: FileFilter.excelFilter })

        case 'image':
            return multer({ storage: storage, fileFilter: FileFilter.imageFilter })

        default:
            return undefined
    }
}
