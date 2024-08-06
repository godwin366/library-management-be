import { Request, Response } from "express";
import { CONSTANT_MESSAGE } from "../common/constant";
import { IApiResponse } from "../common/interface";
import {
  createUserService,
  deleteUserService,
  getUsersService,
  updateUserService,
} from "../services/userService";
import { userValidation } from "../validators/validators";

/**
 * Function responsible to create a user.
 */
export const addUserController = async (req: Request, res: Response) => {
  try {
    const { error } = userValidation.validate(req.body);
    if (error) {
      return res.status(400).send({
        message: `${CONSTANT_MESSAGE.ERROR.VALIDATION_ERROR}: ${
          error.details?.[0]?.message ?? ""
        }`,
      });
    }
    const creteUserResponse: IApiResponse = await createUserService(req);

    return res.status(creteUserResponse.statusCode).send(creteUserResponse);
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in addUserController controller: ", error);
    return res.status(401).send({
      statusCode: 401,
      status: CONSTANT_MESSAGE.STATUS.ERROR,
      message: error.message,
    });
  }
};

/**
 * Function responsible to get users by name or id or all users.
 */
export const getUserController = async (req: Request, res: Response) => {
  try {
    const usersResponse: IApiResponse = await getUsersService(req);
    return res.status(usersResponse.statusCode).send(usersResponse);
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in getUserController controller: ", error);
    return res.status(401).send({
      statusCode: 401,
      status: CONSTANT_MESSAGE.STATUS.ERROR,
      message: error.message,
    });
  }
};

/**
 * Function responsible to update users details by the id.
 */
export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        message: `${CONSTANT_MESSAGE.ERROR.VALIDATION_ERROR}: ${CONSTANT_MESSAGE.ERROR.ID_IS_REQUIRED}`,
      });
    }
    const addUserController: IApiResponse = await updateUserService(req);
    return res.status(addUserController.statusCode).send(addUserController);
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in updateUser controller: ", error);
    return res.status(401).send({
      statusCode: 401,
      status: CONSTANT_MESSAGE.STATUS.ERROR,
      message: error.message,
    });
  }
};

/**
 * Function responsible to delete user by the id.
 */
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).send({
        message: `${CONSTANT_MESSAGE.ERROR.VALIDATION_ERROR}: ${CONSTANT_MESSAGE.ERROR.ID_IS_REQUIRED}`,
      });
    }
    const addUserController: IApiResponse = await deleteUserService(req);
    return res.status(addUserController.statusCode).send(addUserController);
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in deleteUser controller: ", error);
    return res.status(401).send({
      statusCode: 401,
      status: CONSTANT_MESSAGE.STATUS.ERROR,
      message: error.message,
    });
  }
};
