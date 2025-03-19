import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Generating filename for file:", file);
        cb(null, './public/temp');
    },
    filename: (req, file, cb) => {
       
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload =  multer({ storage });

export const uploadMultiple =  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]);
