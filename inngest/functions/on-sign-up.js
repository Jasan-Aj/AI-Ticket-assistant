import {inngest} from "../client.js";
import User from "../../models/user.model.js";
import {sendMail} from "../../utils/mailer.js"

export const sendWellcomeMail = inngest.createFunction(
    {
        id: "send-greeting-mail",
        name: "Greeting mail send",
        retries: 2
    },
    {event: "user/sign-up"},

    async (event, step)=>{

        try{
            //step 01: get user
            const user = await step.run("get-user",async()=>{
                const {email} = event.data;
                const userObject = await User.findOne(email);

                if(!userObject){
                    const error = new Error("User does not exist!");
                    throw error;
                }

                return userObject;
            });

            //step 02: 
            await step.run("send-email", async()=>{
                const subject = `Wellcome ${user.name || 'unknown'}`;
                const body = `Hi ${user.name || 'unknown'}
                \n\n

                We glad to you on Board! \n\n

                by \n
                team inngest mailers`;

                await sendMail(user.mail, subject, body);
            });

            return {
                success: true
            }
        }catch(error){
            console.log("Error in background work: ", error);
            return {
                success: false
            }
        }
        
    }
)