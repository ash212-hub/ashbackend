 // app.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './mongodb/dbconnection.js';  
import createproject from './routes/projects/createProject.js';
import deleteProject from './routes/projects/deletingProjects.js'
import createResume from './routes/resume/createResume.js';
import updateResume from './routes/resume/updateResume.js';
import skillrouter from './routes/skills/skills.js'
dotenv.config();
connectDB();

const app = express(); 
app.use(express.json());

app.use('/api/createproject', createproject);
app.use('/api/deleteproject', deleteProject);
app.use('/api/createresume', createResume);
app.use('/api/update', updateResume);
app.use('/api/skills', skillrouter); 


app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
