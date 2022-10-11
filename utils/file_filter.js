
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
        if (file.mimetype.includes("image")
        ) {
            cb(null, true);
        } else {
            cb("Please upload only image file.", false);
        }
    }
}

module.exports = new FileFilter
