 import { Router } from "express";
import skillSchema from "../../models/skills.js";

const skillrouter = Router();
//
// Create a new skill= post: http://localhost:5000/api/skills
skillrouter.post("/", async (req, res) => {
    try {
        const { name, level } = req.body; // Use req.body for POST data

        if (!name || !level) {
            return res.status(400).json({ error: "name and level are required" });
        }

        const skill = new skillSchema({
            name,
            level
        });

        await skill.save();

        res.status(201).json({
            message: "Skill created successfully",
            skill
        });
    } catch (error) {
        console.error("Error creating skill:", error);
        res.status(500).json({ error: "Failed to create skill" });
    }
});


//get all skills = get: http://localhost:5000/api/skills

skillrouter.get("/", async (req, res) => {
    try {
        const skills = await skillSchema.find();
        res.status(200).json(skills);
    } catch (error) {
        console.error("Error fetching skills:", error);
        res.status(500).json({ error: "Failed to fetch skills" });
    }
});


// update skills = put: http://localhost:5000/api/skills/<id>


 skillrouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, level } = req.body;

        if (!name || !level) {
            return res.status(400).json({ error: "name and level are required" });
        }

        const skill = await skillSchema.findByIdAndUpdate(
            id,
            { name, level },
            { new: true, runValidators: true }
        );

        if (!skill) {
            return res.status(404).json({ error: "Skill not found" });
        }

        res.status(200).json({
            message: "Skill updated successfully",
            skill
        });
    } catch (error) {
        console.error("Error updating skill:", error);
        res.status(500).json({ error: "Failed to update skill" });
    }
});


export default skillrouter;




