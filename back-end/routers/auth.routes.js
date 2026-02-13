import Router from "express";
import {signup, signin, signout} from "../controllers/user.controller.js"
import {authenticate} from  "../middlewares/authenticate.middleware.js" 
import {setReqHeader} from "../middlewares/cors.middleware.js"

const router = Router();

router.post("/sign-up", signup);
router.post("/sign-in",setReqHeader, signin);
router.delete("/sign-out",authenticate, signout);

export default router;