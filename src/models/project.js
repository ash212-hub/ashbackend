// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String, 
  imageUrl: String,
  imageid: String,
  projecturl: String
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
