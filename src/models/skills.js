import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    }
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

});

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
