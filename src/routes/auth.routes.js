import { Router } from "express";
import {
 loginUserOrTeacher,logout,registerUserOrTeacher,verifyToken,DeleteUser,getGrades,getAccionTeacher
} from "../controllers/auth.controllers.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import {auth} from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/register", validateSchema(registerSchema), registerUserOrTeacher);
router.post("/login", validateSchema(loginSchema), loginUserOrTeacher);
router.get("/verify", verifyToken);
router.post("/logout", auth , logout);
router.delete("/deleteUser", auth , DeleteUser);
router.get("/getGrades", auth , getGrades);
router.get("/getGradesTeacher", auth , getAccionTeacher);

export default router;