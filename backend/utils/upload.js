import multer from 'multer';
import path from 'path';

// 1. Create storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/'); // Save files to 'assets' directory
    },
    filename: (req, file, cb) => {
        // Generate unique filename with original name and timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// 2. File filter configuration
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
};

// 3. Create multer instance with configuration
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB size limit
    }
});