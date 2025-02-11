const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3010;

// Enable CORS
app.use(cors());
app.use(express.json());

const corsOptions = {
    origin: '*', // Allow all devices in the network
    methods: ['GET', 'POST'], // Allow file upload
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));


// Storage Configuration for File Uploads
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

// Route: File Upload
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded successfully!', filename: req.file.filename });
});

// Route: Get All Files
app.get('/files', (req, res) => {
    fs.readdir(uploadFolder, (err, files) => {
        if (err) return res.status(500).json({ error: "Error reading files" });
        res.json(files);
    });
});

// Route: Download File
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(uploadFolder, req.params.filename);
    res.download(filePath);
});

// Start Server
app.listen(PORT, () => console.log(`Server running at http://192.168.29.188:${PORT}`));
