const multer = require('multer');

// Configurazione di storage per Multer in memoria anziché su disco
const storage = multer.memoryStorage();

// Filtro per i tipi di file accettati
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);  // Accetta il file
    } else {
        cb(new Error('Formato file non supportato. Utilizzare JPEG, PNG, GIF o WEBP.'), false);
    }
};

// Configurazione di Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024  // Limite di 5 MB
    },
    fileFilter: fileFilter
});

module.exports = upload;