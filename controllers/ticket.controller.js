import Ticket from "../models/ticket.model";
import { inngest } from "../inngest/client";


const createTicket = async(req, res)=>{
    try{
        const {title, description} = req.body;
        if(!title || !description){
            res.status(400).json({
                msg: "Title and Description are required!"
            });
        }

        const newTicket = await Ticket.create({
            title,
            description,
            createdBy: req.user._id.toString()
        });

        await inngest.run({
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
        res.status(500).json({
            message: "Failed to create new ticket!"
        });
    }
}

const getTickets = async (req, res)=>{
    try{
        const user = req.user;
        let tickets = [];
        if(user.role !== user){
            tickets = await Ticket.find().sort({createdAt: -1});
        }else{
            tickets = (await Ticket.find()).filter({
                createdBy: user._id.toString()
            }).sort({
                createdAt: -1
            });
        }

        return res.status(200).json(tickets)
    }catch(error){
        return res.status(500).json({
            message: "Internal sserver error"
        });
    }
}