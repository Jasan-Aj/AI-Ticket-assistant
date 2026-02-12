import {inngest} from "../client.js";
import Ticket from "../../models/ticket.model.js";
import User from "../../models/user.model.js";
import { NonRetriableError } from "inngest";
import { analyzeTicket } from "../../utils/ai-agents/ticket-analyzer.agent.js";
import { sendMail } from "../../utils/mailer.js";

export const onTicketCreated = inngest.createFunction(
    {id: "on-ticket-create", retries:2},
    {event: "user/on-ticket-create"},
    async ({event, step})=>{

        const {ticketId} = event.data;

        try{
            //step 01: Fetch ticket
            const ticket = await step.run("fetch-ticket", async()=>{
                const ticketObject = await Ticket.findById(ticketId);
                if(!ticketId){
                    throw new NonRetriableError("The ticked does not exist!");
                }
                return ticketObject;
            });

            const aiResponse = await analyzeTicket(ticket);

            console.log("ai response  ", aiResponse);

            //step 02: Ai processing
            const relatedSkills = await step.run("AI-Processing", async()=>{
                let skills = [];
                if(aiResponse){
                    await Ticket.findOneAndUpdate(
                        {_id :ticket._id},
                        {
                            priority: !["low", "medium", "high"].includes(aiResponse.priority) ? "medium" : aiResponse.priority,
                            aiDescription: aiResponse.helpfulNotes,
                            status: "Processing",
                            relatedSkills: aiResponse.relatedSkills
                        }
                    )
                    skills = aiResponse.relatedSkills;
                }
                return skills;
            });

            //step 03: assign moderator
            const moderator = await step.run("assign-modertor", async()=>{

                if (!relatedSkills || relatedSkills.length === 0) {
                return await User.findOne({ role: "admin" });
            }

                let user = await User.findOne({
                    role: "moderator",
                    skills: {
                        $elemMatch: {
                            $regex: relatedSkills.join("|"),
                            $options: "i"
                        }
                    }
                });

                if(!user){
                    user = await User.findOne({
                        role: "admin"
                    });
                }

                await Ticket.findByIdAndUpdate(ticketId,{
                    assignedTo: user? user : null
                });

                return user;
            });

            //step 04: Update ticket status
            await step.run("update-status",async()=>{
                const ticket = await Ticket.findByIdAndUpdate(
                    ticketId,
                    {status: "Processing"}
                )
                return ticket;
            });

            //step 05: send notifiction email
            await step.run("send-notify-mail", async()=>{
                const ticket = await Ticket.findById(ticketId);
                if(moderator){
                    await sendMail(
                        moderator.email,
                        "A Ticket assigned for you",
                        `The ticked assigned for you \n
                        Ticket: ${ticket.title}`
                    );
                }
            });

            return {
                success: true
            }

        }catch(error){
            console.log("There is an error in On ticket create workflow: ", error);
            return {
                success: false
            }
        }
    }
)