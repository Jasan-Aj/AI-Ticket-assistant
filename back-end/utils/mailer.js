import nodemailer from "nodemailer";


export const sendMail = async (to, subject, text)=>{
    try{
        const transporter = nodemailer.createTransport({
            host: MAILTRAP_SMTP_HOST,
            port: MAILTRAP_SMTP_PORT,
            secure: false, 
            auth: {
                user: process.env.MAILTRAP_SMTP_USER,
                pass: process.env.MAILTRAP_SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: '"inngest workflow',
            to,
            subject,
            text,
        });

    console.log("Message sent: %s", info.messageId);
    
    return info;

    }catch(error){
        console.log("Error in sending mail: ", error);
    }
}