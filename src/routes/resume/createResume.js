 import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'; 
import Resume from '../../models/resumeschema.js';


dotenv.config();
const resumeRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * 1️⃣ Upload resume to Cloudinary only
 * POST /resume/upload
 */
resumeRouter.post(
  '/upload',
  upload.single('resume'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Resume file is required' });
      }

      // Create custom filename
      const ext = path.extname(req.file.originalname);
      const now = new Date();
      const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
      const customFilename = `resume_${timestamp}${ext}`;

      // Upload to Cloudinary
      const resumeResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'raw',
        folder: 'portfolio_resumes',
        use_filename: true,
        unique_filename: false,
        filename_override: customFilename
      });

      fs.unlinkSync(req.file.path);

      const resumeUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/v${resumeResult.version}/${resumeResult.public_id}`;

    //   res.status(200).json({
    //     message: 'Resume uploaded successfully',
    //     resumeUrl
        
    //   });

      const resume = new Resume({
        resumeUrl,
        resumeid: resumeResult.public_id
      });

      const saved = await resume.save();

      res.status(201).json({
        message: 'Resume created successfully',
        resumeUrl,
        resumeid: resumeResult.public_id
      });


 
      
    } catch (err) {
      console.error('Resume Upload Error:', err);
      res.status(500).json({ error: 'Failed to upload resume' });
    }
  }
);

export default resumeRouter;
