import { userControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { Router } from "express";



const router = Router();

router.post("/register", validateRequest(createUserZodSchema),userControllers.createUser);

router.get("/all-users", userControllers.getAllUsers);

export const UserRoutes = router;