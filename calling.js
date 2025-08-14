import express from "express";
const router = express.Router();

router.get("/sayhi", (req, res) => {
  res.send("Hi");
});

export default router;
