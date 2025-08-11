 // routes/projectRoutes.js
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import Project from '../../models/project.js';

dotenv.config();
const createproject = express.Router();



// post :http://localhost:5000/api/createproject

// ✅ Use memory storage so files are not saved locally
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📌 Upload image directly to Cloudinary + Save to MongoDB
createproject.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, projecturl } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Convert buffer to Cloudinary upload stream
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio_project_images' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer); // send file buffer
      });
    };

    const imageResult = await uploadToCloudinary();

    // Save in MongoDB
    const project = new Project({
      title,
      description,
      imageUrl: imageResult.secure_url,
      imageid: imageResult.public_id, // store public_id for deletion
      projecturl
    });

    const saved = await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project: saved,
    });
  } catch (err) {
    console.error('Project Creation Error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

export default createproject;
