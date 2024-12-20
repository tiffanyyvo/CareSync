import Token from "../models/Token.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Creates a token
export const createToken = async(req, res) => {
    const {username, password, familyGroup, _id} = req.body;
    if (!username) {
        return res.status(400).json({success: false, message: "No username and password"});
    }

    const accessToken = jwt.sign( {username, _id}, process.env.TOKEN_SECRET);
    const refreshToken = jwt.sign( {username, _id} , process.env.REFRESH_TOKEN)

    try {
        const existingToken = await Token.findOne({ user_id: _id });
        if (existingToken) {
            existingToken.token = accessToken;
            existingToken.refresh_token = refreshToken;
            await existingToken.save();
            return res.status(200).json({ success: true, data: existingToken });
        }

        const newToken = new Token({
            token: accessToken,
            user_id: _id,
            refresh_token: refreshToken,
        });
        await newToken.save();
        res.status(201).json({ success: true, data: newToken});
    }
    
    catch (error) {
        console.error("Error creating token:", error.message);
        res.status(500).json({success: false, message: "Error adding token"});
    }
};

// Gets token from database
export const getToken = async(req, res) => {
    try {
        const users = await Token.find();
        res.status(200).json({success: true, data: users})
    }
    catch (error) {
        console.error("Error fetching tokens:", error.message);
        res.status(500).json({success: false, message: "Error fetching tokens"})
    }
};

// Updates token
export const updateToken = async(req, res) => {
    const { id } = req.params;
    const token = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Token ID Does Not Exist" });
    }

    try {
        const updatedToken = await Token.findByIdAndUpdate(id, token, { new: true }) // gives updated user object
        res.status(200).json({success: true, data: updatedToken})
    }
    catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({success: false, message: "Error updating token"});
    }
};

// Deletes token
export const deleteToken = async(req, res) => {
    const { id } = req.params;

    // Check if the user ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Token ID does not exist" });
    }

    try {
        // Attempt to find and delete the user by ID
        const deletedToken = await Token.findByIdAndDelete(id);
        
        if (!deletedToken) {
            return res.status(404).json({ success: false, message: "Token not found" });
        }

        res.status(200).json({ success: true, message: "Token deleted successfully", data: deletedToken });
    } catch (error) {
        console.error("Error deleting token:", error.message);
        res.status(500).json({ success: false, message: "Error deleting token" });
    }
};