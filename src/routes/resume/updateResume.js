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

// PUT /api/update?publicId=<cloudinary_public_id>
resumeRouter.put(
  '/',
  upload.single('resume'),
  async (req, res) => {
    try {
      const { publicId } = req.query;

      if (!publicId) {
        return res.status(400).json({ error: 'publicId query parameter is required' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Resume file is required' });
      }

      // 1️⃣ Find existing resume in DB using public_id
      const existingResume = await Resume.findOne({ resumeid: publicId });
      if (!existingResume) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      // 2️⃣ Delete old file from Cloudinary
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

      // 3️⃣ Create custom filename
      const ext = path.extname(req.file.originalname);
      const timestamp = new Date()
        .toISOString()
        .replace(/T/, '_')
        .replace(/:/g, '-')
        .split('.')[0];
      const customFilename = `resume_${timestamp}${ext}`;

      // 4️⃣ Upload new resume to Cloudinary
      const resumeResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'raw',
        folder: 'portfolio_resumes',
        use_filename: true,
        unique_filename: false,
        filename_override: customFilename
      });

      // 5️⃣ Remove local file
      fs.unlinkSync(req.file.path);

      // 6️⃣ Create new URL
      const resumeUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/v${resumeResult.version}/${resumeResult.public_id}`;

      // 7️⃣ Update DB record
      existingResume.resumeUrl = resumeUrl;
      existingResume.resumeid = resumeResult.public_id;
      const updatedResume = await existingResume.save();

      res.status(200).json({
        message: 'Resume updated successfully',
        resumeUrl: updatedResume.resumeUrl,
        resumeid: updatedResume.resumeid
      });

    } catch (err) {
      console.error('Resume Update Error:', err);
      res.status(500).json({ error: 'Failed to update resume' });
    }
  }
);

export default resumeRouter;
