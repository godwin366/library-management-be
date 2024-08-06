import Router from "express-promise-router";
import { addAdminController } from "../controllers/adminController";
import { logInUserController } from "../controllers/logInController";
import { userAuthentication } from "../middleware/userAuthentication";
import authRouter from "./authRoutes";

const router = Router();

router.post("/login", logInUserController);

/**
 * Admin api routes
 */
authRouter.post("/add-admin-user", addAdminController);
router.use("", userAuthentication, authRouter);

export default router;
