import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, 
        match: [/\S+@\S+\.\S+/,'please fill email with valid charecters'],
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 5
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "moderator"],
        required: true
    },
    skills: {
        type: [String],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const User = mongoose.model('User', userSchema);
export default User;