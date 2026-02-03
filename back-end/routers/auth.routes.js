import Router from "express";
import {signup, signin, logout} from "../controllers/user.controller.js"

const router = Router();

router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post("/sign-out", signout);

export default router;