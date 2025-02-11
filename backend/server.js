const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3010;

// Enable CORS for frontend to access the backend
app.use(cors());

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files (uploaded files) from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure multer storage (saving the file with its original name)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files to the 'uploads' directory
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use the original filename (no modification)
    cb(null, file.originalname);
  }
});

// Set up multer for file upload
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).single("file");

// File upload route
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send("File is too large. Max size is 5MB.");
      }
      return res.status(500).send("Error uploading file: " + err.message);
    }
    res.status(200).send({ message: "File uploaded successfully!" });
  });
});

// Endpoint to get the list of uploaded files
app.get("/files", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory.");
    }
    res.json(files);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://192.168.29.188:${PORT}`);
});
