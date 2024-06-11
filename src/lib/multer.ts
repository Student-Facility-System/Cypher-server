import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 2048 * 2048 }, // Optional: Set a file size limit (in bytes)
    fileFilter: (req, file, cb) => {
        // Optional: Check for allowed file types (e.g., image/jpeg)
        if (!file.mimetype.startsWith('image/')) {
            return cb(new multer.MulterError(<"LIMIT_PART_COUNT" | "LIMIT_FILE_SIZE" | "LIMIT_FILE_COUNT" | "LIMIT_FIELD_KEY" | "LIMIT_FIELD_VALUE" | "LIMIT_FIELD_COUNT" | "LIMIT_UNEXPECTED_FILE">'LIMIT_FILE_TYPE', 'Only image files are allowed.'));
        }
        cb(null, true);
    }
});


export {storage, upload}
export default {storage, upload};