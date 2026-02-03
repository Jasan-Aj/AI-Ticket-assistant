import Router from "express";
import {authenticate} from "../middlewares/authenticate.middleware.js";
import { getUsers, updateUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/",authenticate, getUsers);
router.post("/",authenticate, updateUser);

export default router;