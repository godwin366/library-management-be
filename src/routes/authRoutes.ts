import Router from "express-promise-router";
import {
    deleteAdminController,
    getAdminController,
    updateAdminController
} from "../controllers/adminController";
import {
    addBookController,
    deleteBookController,
    getBookController,
    updateBookController,
} from "../controllers/bookController";
import {
    addTransactionController,
    deleteTransactionController,
    getTransactionController,
    updateTransactionController,
} from "../controllers/transactionController";
import {
    addUserController,
    deleteUserController,
    getUserController,
    updateUserController,
} from "../controllers/userController";

const authRouter = Router();

/**
 * Admin api routes
 */
authRouter.get("/admins", getAdminController);
authRouter.post("/updateAdmin", updateAdminController);
authRouter.delete("/deleteAdmin", deleteAdminController);

/**
 * User api routes.
 */
authRouter.post("/addUser", addUserController);
authRouter.get("/users", getUserController);
authRouter.post("/updateUser", updateUserController);
authRouter.delete("/deleteUser", deleteUserController);

/**
 * Book api routes.
 */
authRouter.post("/addBook", addBookController);
authRouter.get("/books", getBookController);
authRouter.post("/updateBook", updateBookController);
authRouter.delete("/deleteBook", deleteBookController);

/**
 * transaction api routes.
 */
authRouter.post("/addTransaction", addTransactionController);
authRouter.post("/transactions", getTransactionController);
authRouter.post("/updateTransaction", updateTransactionController);
authRouter.delete("/deleteTransaction", deleteTransactionController);

export default authRouter;
