const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Data file path
const PETS_FILE = path.join(__dirname, "pets.json");

// Initialize pets file if it doesn't exist
if (!fs.existsSync(PETS_FILE)) {
  fs.writeFileSync(PETS_FILE, JSON.stringify([]));
}

// Helper function to read pets from file
const readPets = () => {
  try {
    const data = fs.readFileSync(PETS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write pets to file
const writePets = (pets) => {
  fs.writeFileSync(PETS_FILE, JSON.stringify(pets, null, 2));
};

// Routes

// Get all pets
app.get("/api/pets", (req, res) => {
  const pets = readPets();
  res.json(pets);
});

// Add new pet
app.post("/api/pets", upload.single("image"), async (req, res) => {
  try {
    const { name, breed, age } = req.body;

    if (!name || !breed || !age || !req.file) {
      return res
        .status(400)
        .json({ error: "All fields including image are required" });
    }

    // Upload image to S3
    const imageKey = `pets/${Date.now()}-${req.file.originalname}`;
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const uploadResult = await s3.upload(uploadParams).promise();

    // Create pet object
    const newPet = {
      id: Date.now().toString(),
      name,
      breed,
      age: parseInt(age),
      imageUrl: uploadResult.Location,
      createdAt: new Date().toISOString(),
    };

    // Add to pets file
    const pets = readPets();
    pets.push(newPet);
    writePets(pets);

    res.status(201).json(newPet);
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).json({ error: "Failed to add pet" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
