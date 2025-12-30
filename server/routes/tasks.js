const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 */
router.post("/", auth, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      completed: false,
      userId: req.userId, // From auth middleware
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ message: "Server error while creating task" });
  }
});

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the logged-in user
 */
router.get("/", auth, async (req, res) => {
  try {
    // Sort by newest first
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Fetch Tasks Error:", err);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task (Title or Completion status)
 */
router.put("/:id", auth, async (req, res) => {
  try {
    // Find task by ID and ensure it belongs to the user
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.json(task);
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ message: "Server error while updating task" });
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    // Ensure the task belongs to the user before deleting
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.json({ message: "Task deleted successfully", id: req.params.id });
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ message: "Server error while deleting task" });
  }
});

module.exports = router;