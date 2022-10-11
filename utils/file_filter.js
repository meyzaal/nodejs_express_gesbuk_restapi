
class FileFilter {
    excelFilter(req, file, cb) {
        if (
            file.mimetype.includes("excel") ||
            file.mimetype.includes("spreadsheetml")
        ) {
            cb(null, true);
        } else {
            cb("Please upload only excel file.", false);
        }
    }

    imageFilter(req, file, cb) {
        if (file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/png"
        ) {
            cb(null, true);
        } else {
            cb("Please upload file with type .jpg, .jpeg, .png.", false);
        }
    }
}

module.exports = new FileFilter
