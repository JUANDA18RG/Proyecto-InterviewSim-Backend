import { Router } from "express";
import {
 createInterview,getInterviews,getInterviewById
} from "../controllers/interview.controllers.js";
import IA from "../IA.js";

const router = Router();

router.post("/createInterview", createInterview);
router.get("/allIterview", getInterviews);
router.get("/interview/:id", getInterviewById);



export default router;