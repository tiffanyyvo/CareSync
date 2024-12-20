import Task from "../models/Task.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Create a new task
export const createTask = async(req, res) => {
    // Get the users token
    const token = req.header('Authorization')?.split(' ')[1]; // 'Bearer <token>'
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
   }

    const task = req.body;
    console.log("Request body:", req.body)
    if (!task.task) {
        return res.status(400).json({success: false, message: "No task entered"});
    }

    // Add the user id and family group to each new task
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET); 
    const userId = decoded._id; 
    const newTask = new Task({task: task.task, user_id: userId, family_id: decoded.familyGroup});

    try {
        await newTask.save();
        res.status(201).json({success: true, data: newTask});
    }
    catch (error) {
        console.error("Error creating task:", error.message);
        res.status(500).json({success: false, message: "Error adding task"});
    }
};

// Fetch all tasks from DB
export const getTasks = async (req, res) => {
    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1]; // 'Bearer <token>'
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        // Verify the token
        const [header, payload, signature] = token.split('.')
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload._id
        const familyId = decodedPayload.familyGroup
        // Fetch tasks for the specific user or family
        if(familyId != null) {
            const tasks = await Task.find({ family_id: familyId }); 
            res.status(200).json({ success: true, data: tasks });
        }
        else {
            const tasks = await Task.find({ user_id: userId }); 
            res.status(200).json({ success: true, data: tasks });
        }
    } catch (error) {
        console.error('Error verifying token or fetching tasks:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// Update a task
export const updateTask = async(req, res) => {
    const { id } = req.params;
    const task = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Task ID Does Not Exist" });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, task, { new: true }) // gives updated task object
        res.status(200).json({success: true, data: updatedTask})
    }
    catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({success: false, message: "Error updating task"});
    }
};

// Delete a task
export const deleteTask = async(req, res) => {
    const { id } = req.params;
    try {
        
    }
    catch (error) {
        console.error("Error deleting task:", error.message);
        res.status(500).json({success: false, message: "Error deleting task"});
    }
};

// Updates all task by users ID when they join a family group
export const updateByID = async(req, res) => {
    try {
        const { userId } = req.params;
        const { family_id } = req.body;
        
        const result = await Task.updateMany({ user_id: userId }, { family_id: family_id });
        
        res.json({ message: 'Tasks updated successfully', modifiedCount: result.modifiedCount });
      } catch (error) {
        res.status(500).json({ message: 'Error updating tasks', error: error.message });
      }
};