
export const setReqHeader = (req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "https://ai-ticket-assistant-4qfw.vercel.app");
  
  // Necessary if you are using cookies or sessions
  res.header("Access-Control-Allow-Credentials", "true");
  
  // Methods the browser is allowed to use
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Headers the browser is allowed to send
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // HANDLES THE PREFLIGHT CHECK
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
}