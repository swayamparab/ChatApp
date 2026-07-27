import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
    // Documents
    "application/pdf",

    // Word
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    // Excel
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    // PowerPoint
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // Text
    "text/plain",

    // ZIP
    "application/zip",
    "application/x-zip-compressed",
];

const upload = multer({
    storage,

    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB
    },

    fileFilter(req, file, cb) {
        const isImage = file.mimetype.startsWith("image/");
        const isVideo = file.mimetype.startsWith("video/");
        const isDocument = allowedMimeTypes.includes(file.mimetype);

        if (isImage || isVideo || isDocument) {
            cb(null, true);
        } else {
            cb(new Error("Unsupported file type."));
        }
        
    },
    
});

export default upload;