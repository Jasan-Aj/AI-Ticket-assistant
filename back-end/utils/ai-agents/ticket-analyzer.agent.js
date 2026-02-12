import {createAgent, gemini} from "@inngest/agent-kit"

export const analyzeTicket = async (ticket)=>{
    const supportAgent = createAgent({
    model: gemini({
    model: "gemini-2.5-flash",
        apiKey: process.env.GEMINI_API_KEY 
    }),
        name: "AI Ticket Analytic Assistant",
        system: `You are an expert AI assistant that processes technical support tickets.

        Your job is to:
        1. Summarize the issue.
        2. Estimate its priority.
        3. Provide helpful notes and resources links for human moderators.
        4. List relevant technical skills required.

        IMPORTANT:
        - Respond with *only* valid raw JSON.
        -Do NOT include markdown, code fences, comments, or any extra formatting.
        - The format must be a raw JSON object.

        Repeat: Do not wrap your output in markdown or code fences.`,
    });

    const response = await supportAgent.run(`You are a ticket triage agent Only return strict JSON object with no extra headers, or markdown.

        Analyze the following support tcket and provide a JSON object with:

        - summary: A short 1-2 sentence summary of the issue.
        - priority: One of "low" "medium" "high".
        - helpfulNotes: A detailed technical explination that a moderator can use to solve this issue. Include useful external links or resources if possible.
        - relatedSkills: An array of relevant skills required to solve the issue (eg., ["React", "MongoDB"]).

        Respond ONLY in this JSON format and do not iclude any other text or markdown in the answer:

        {
        "summary": "Short summary of the ticket",
        "priority": "high",
        "helpfulNotes": "Here are useful tips...",
        "relatedSkills": ["React", "Node.js"]
        }

        ---

        Ticket information:

        - Title: ${ticket.title}
        - Description: ${ticket.description}`);

    
    const raw = response.text || response.output?.[0]?.content || response.messages?.at(-1)?.content;

    if (!raw) {
        console.error("AI returned an empty response. Full response object:", JSON.stringify(response));
        return null;
    }

    try {
        
        const jsonString = raw.replace(/```json\s?|```/gi, "").trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Failed to parse AI JSON. Raw output:", raw);
        return null;
    }
}