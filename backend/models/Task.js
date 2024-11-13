import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    familyMember: {
        type: String
    },
    needByDate: {
        type: Date
    },
    completed: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

// Creates Tasks collection in MongoDB
const Task = mongoose.model("Task", taskSchema);
export default Task;