const multer = require('multer');
const path = require('path');
const fs = require('fs');

// التأكد من وجود مجلد الصور
const ensureUploadDir = () => {
    const uploadDir = path.join(__dirname, '../uploads');
    const profileDir = path.join(uploadDir, 'profiles');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (!fs.existsSync(profileDir)) {
        fs.mkdirSync(profileDir, { recursive: true });
    }

    return profileDir;
};

// إعدادات التخزين
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = ensureUploadDir();
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // إنشاء اسم فريد للملف
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = `profile-${req.user.id}-${uniqueSuffix}${ext}`;
        cb(null, filename);
    }
});

// فلتر أنواع الملفات المسموحة
const fileFilter = (req, file, cb) => {
    // السماح فقط بالصور
    if (file.mimetype.startsWith('image/')) {
        // التحقق من الامتدادات المسموحة
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files with extensions .jpg, .jpeg, .png, .gif, .webp are allowed'), false);
        }
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// إعدادات multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB حد أقصى
        files: 1 // ملف واحد فقط
    }
});

// middleware لرفع الصورة الشخصية
const uploadProfileImage = upload.single('profileImage');

// middleware للتعامل مع أخطاء multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File size too large. Maximum size is 5MB',
                error: 'FILE_SIZE_LIMIT'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                message: 'Too many files. Only one file is allowed',
                error: 'FILE_COUNT_LIMIT'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                message: 'Unexpected field name. Use "profileImage" as field name',
                error: 'UNEXPECTED_FIELD'
            });
        }
    }

    if (err) {
        return res.status(400).json({
            message: err.message || 'File upload error',
            error: 'UPLOAD_ERROR'
        });
    }

    next();
};

// دالة لحذف الصورة القديمة
const deleteOldProfileImage = (imagePath) => {
    if (imagePath && fs.existsSync(imagePath)) {
        try {
            fs.unlinkSync(imagePath);
            console.log('Old profile image deleted:', imagePath);
        } catch (error) {
            console.error('Error deleting old profile image:', error);
        }
    }
};

// دالة للحصول على URL الصورة
const getImageUrl = (req, filename) => {
    if (!filename) return null;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return `${baseUrl}/uploads/profiles/${filename}`;
};

module.exports = {
    uploadProfileImage,
    handleMulterError,
    deleteOldProfileImage,
    getImageUrl,
    ensureUploadDir
}; 