import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLenght: 50
    },
    description: {
        type: String,
        trim: true,
        maxLenght: 250
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Processing", "Completed"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    priority: {
        type: String,
    },
    deadLine: {
        type: Date
    },
    aiDescription: {
        type: String
    },
    relatedSkills: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
