 // routes/projectRoutes.js
import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import Project from '../../models/project.js';

dotenv.config();
const projectRouter = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


//  delete :http://localhost:5000/api/deleteproject?publicId=portfolio_project_images/cohzn7wiud8szxjewc7i


projectRouter.delete('/', async (req, res) => {
  try {
    const { publicId } = req.query;

    if (!publicId) {
      return res.status(400).json({ error: 'publicId query parameter is required' });
    }

    // Find project in DB
    const existingProject = await Project.findOne({ imageid: publicId });
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete from Cloudinary (image)
    await cloudinary.uploader.destroy(publicId);

    // Delete from MongoDB
    await Project.deleteOne({ imageid: publicId });

    res.json({ message: 'Project and image deleted successfully' });
  } catch (err) {
    console.error('Project Delete Error:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default projectRouter;
