import {inngest} from "../client.js";
import Ticket from "../../models/ticket.model.js";
import User from "../../models/user.model.js";
import { NonRetriableError } from "inngest";
import { analyzeTicket } from "../../utils/ai-agents/ticket-analyzer.agent.js";
import { sendMail } from "../../utils/mailer.js";

const onTicketCreated = inngest.createFunction(
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

            //step 02: Update ticket status
            await step.run("update-status",async()=>{
                await Ticket.findByIdAndUpdate(
                    ticketId,
                    {status: "Pending"}
                )
            });

            const aiResponse = await analyzeTicket(ticket);

            //step 03: Ai processing
            const relatedSkills = await step.run("AI-Processing", async()=>{
                let skills = [];
                if(aiResponse){
                    await Ticket.findOneAndUpdate(
                        ticketId,
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

            //step 04: assign moderator
            const moderator = await step.run("assign-modertor", async()=>{
                let user = await User.findOne({
                    role: "moderator",
                    skills: {
                        $elemMatch: {
                            $regex: relatedSkills.join("|"),
                            $option: "i"
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