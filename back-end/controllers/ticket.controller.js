import Ticket from "../models/ticket.model.js";
import { inngest } from "../inngest/client.js";


export const createTicket = async(req, res)=>{
    try{
        const {title, description} = req.body;
        if(!title || !description){
            return res.status(400).json({
                msg: "Title and Description are required!"
            });
        }

        const newTicket = await Ticket.create({
            title,
            description,
            createdBy: req.user._id.toString()
        });

        await inngest.send({
            name: "user/on-ticket-create",
            data: {
                ticketId: newTicket._id.toString()
            }
        })

        return res.status(201).json({
            message: "Ticket created successfully",
            ticket: newTicket
        });

    }catch(error){
        console.log("Failed to create new ticket!");
        console.log(error);
        res.status(500).json({
            message: "Failed to create new ticket!"
        });
    }
}

export const getTickets = async (req, res)=>{
    try{
        const user = req.user;
        let tickets = [];
        if(user.role !== "user"){
            tickets = await Ticket.find().sort({createdAt: -1});
        }
        else if(user.role === "moderator"){
            tickets = await Ticket.find({ assignedTo: user._id });
        }
        else {
            tickets = await Ticket.find({ createdBy: user._id }).sort({ createdAt: -1 });
        }

        return res.status(200).json(tickets)
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Internal sserver error"
        });
    }
}

export const getTicket = async (req, res)=>{
    const ticketId = req.params.id;
    const user = req.user;
    let ticket;
    
    try{
        if(user.role !== "user"){
            ticket = await Ticket.findById(ticketId).populate("AssignedTo",["email", "name"]);
        }else{
            ticket = await Ticket.findById(ticketId);
        }

        if(!ticket){
            return res.status(400).json({
                message: "Ticket does not exist!"
            });
        }

        res.status(200).json(ticket);
    }catch(error){
        console.log("Internal server error: ", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const updateTicket = async (req, res)=>{
    const ticketId = req.params.id;
    const user = req.uset;
    const {response} = req.body;

    try{
        const ticket = await Ticket.findById(ticketId);
        if(!ticket){
            return res.status(400).json({
                message: "Ticket does not exist!"
            });
        }

        if(!response){
            return res.status(400).json({
                message: "There is no any response to update!"
            });
        }

        await Ticket.findByIdAndUpdate(ticketId,{
            response,
            status: "Completed"
        });

        res.status(200).json({message: "Successfully updated!"});

    }catch(error){
        console.log("Internal server error: ", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getModerateTickets = async (req, res)=>{
    
    try{
        const user = req.user;
        let tickets = [];
        tickets = await Ticket.find({ assignedTo: user._id });

        return res.status(200).json(tickets);

    }catch(error){
        return res.status(500).json({
            message: "Internal sserver error"
        });
    }
}

export const deleteTicket = async (req, res)=>{
    const user = req.user;
    const ticketId = req.params.id;

    try{
        if(user.role !== "admin"){
            return res.status(401).json({message: "Not authorized"});
        }

        const ticket = await Ticket.findById(ticketId);
        if(!ticket){
            return res.status(404).json({
                message: "Ticket does not found!"
            });
        }

        await Ticket.findByIdAndDelete(ticketId);
        return res.json(200).json({message: "Successfully deleted"});

    }catch(error){
        res.status(500).json({
            message: "Internal server error!"
        });
    }
}