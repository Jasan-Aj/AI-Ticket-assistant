import Router from "express";
import {authenticate} from "../middlewares/authenticate.middleware.js";
import { createTicket, getTicket, getTickets, updateTicket , getModerateTickets, deleteTicket} from "../controllers/ticket.controller.js";

const router = Router();

router.post("/",authenticate,createTicket);

router.get("/",authenticate,getTickets);

router.get("/:id",authenticate, getTicket);

router.post("/update/:id",authenticate, updateTicket);

router.get("/moderate",authenticate, getModerateTickets);

router.delete("/delete/:id",authenticate, deleteTicket);

export default router;