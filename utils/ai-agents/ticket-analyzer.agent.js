import { createAgent, gemini } from "@inngest/agent-kit";

export const analyzeTicket = async (ticket)=>{
    const supportAgent = createAgent({
        model: gemini({
           model: "gemini-1.5-flash-8b",
           apiKey: process.env.GEMINI_API_KEY 
        }),
        name: "AI Ticket Analytic Assistant",
        system: ``,
    });

    const response = await supportAgent.run('');
}