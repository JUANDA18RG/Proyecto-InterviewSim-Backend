import { Router } from "express";
import {
 createInterview,getInterviews,getInterviewById,getInterviewsByTeacher,deleteInterviewById,calificarEntrevista,obtenerRecomendaciones,mostrarInfo
} from "../controllers/interview.controllers.js";
import {auth} from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/createInterview", auth,createInterview);
router.get("/allIterview", auth,getInterviews);
router.get("/interview/:id",auth, getInterviewById);
router.get("/interviewTeacher/:id", auth,getInterviewsByTeacher);
router.delete("/deleteInterview/:id", auth,deleteInterviewById);
router.post("/calificar", auth,calificarEntrevista);
router.post("/recomendaciones", auth,obtenerRecomendaciones);
router.get("/Info", auth,mostrarInfo);




export default router;