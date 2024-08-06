import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { CONSTANT_MESSAGE } from "../common/constant";
import { IAdmin, IApiResponse } from "../common/interface";
import {
  createAdminService,
  deleteAdminService,
  getAdminsService,
  updateAdminService,
} from "../services/adminService";
import { adminValidation } from "../validators/validators";
import dotenv from "dotenv";

dotenv.config();

const salt: string | number = Number(process.env.SALT as string | number);

/**
 * Function responsible to create a admin.
 */
export const addAdminController = async (req: Request, res: Response) => {
  try {
    const { error } = adminValidation.validate(req.body);
    if (error) {
      return res.status(400).send({
        message: `${CONSTANT_MESSAGE.ERROR.VALIDATION_ERROR}: ${
          error.details?.[0]?.message ?? ""
        }`,
      });
    }
    const { name, userName, contactNo, emailId, password } = req.body as IAdmin;
    const hashedPassword = await bcrypt.hash(password, salt);

    const creteAdminResponse: IApiResponse = await createAdminService({
      password: hashedPassword,
      name,
      userName,
      contactNo,
      emailId,
    });

    return res.status(creteAdminResponse.statusCode).send(creteAdminResponse);
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in addAdminController controller: ", error);
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
export const getAdminController = async (req: Request, res: Response) => {
  try {
    const usersResponse: IApiResponse = await getAdminsService(req);
    return res.status(usersResponse.statusCode).send(usersResponse);
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in getAdminController controller: ", error);
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
export const updateAdminController = async (req: Request, res: Response) => {
  try {
    const { id, password } = req.body;
    if (!id) {
      return res.status(400).send({
        message: `${CONSTANT_MESSAGE.ERROR.VALIDATION_ERROR}: ${CONSTANT_MESSAGE.ERROR.ID_IS_REQUIRED}`,
      });
    }
    if (password?.length >= 8) {
      console.log("🚀 ~ updateAdminController ~ salt:", salt);
      req.body.password = await bcrypt.hash(password, salt);
    }
    const addAdminController: IApiResponse = await updateAdminService(req);
    return res.status(addAdminController.statusCode).send(addAdminController);
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in updateAdmin controller: ", error);
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
export const deleteAdminController = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).send({
        message: `${CONSTANT_MESSAGE.ERROR.VALIDATION_ERROR}: ${CONSTANT_MESSAGE.ERROR.ID_IS_REQUIRED}`,
      });
    }
    const addAdminController: IApiResponse = await deleteAdminService(req);
    return res.status(addAdminController.statusCode).send(addAdminController);
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in deleteAdmin controller: ", error);
    return res.status(401).send({
      statusCode: 401,
      status: CONSTANT_MESSAGE.STATUS.ERROR,
      message: error.message,
    });
  }
};
