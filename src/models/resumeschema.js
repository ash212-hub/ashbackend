// models/Project.js
import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
 
  resumeUrl: String,
  resumeid: String
}, {
  timestamps: true,
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
