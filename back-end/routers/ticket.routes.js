import Router from "express";
import {authenticate} from "../middlewares/authenticate.middleware.js";
import { createTicket, getTicket, getTickets } from "../controllers/ticket.controller.js";

const router = Router();

router.post("/",authenticate,createTicket);

router.get("/",authenticate,getTickets);

router.get("/:id",authenticate, getTicket);

export default router;