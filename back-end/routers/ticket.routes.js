import Router from "express";
import {authenticate} from "../middlewares/authenticate.middleware.js";
import { createTicket, getTicket, getTickets, updateTicket } from "../controllers/ticket.controller.js";

const router = Router();

router.post("/",authenticate,createTicket);

router.get("/",authenticate,getTickets);

router.get("/:id",authenticate, getTicket);

router.get("/update/:id",authenticate, updateTicket);

export default router;