const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5007;

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Enable CORS for communication with the frontend
app.use(cors());

// Route to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // AI API URL
  const apiUrl = "https://grape-diseases-detection.1pfz69w9cph3.us-south.codeengine.appdomain.cloud/predict";

  try {
    // Create a FormData instance and append the file
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    // Send the formData to the AI API
    const response = await axios.post(apiUrl, formData, {
      headers: formData.getHeaders(),
    });

    // Send the AI API response back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error calling AI API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
