import { Request } from "express";
import { CONSTANT_MESSAGE } from "../common/constant";
import { IAdmin, IApiResponse } from "../common/interface";
import { errorResponseMap } from "../helpers/helper";
import AdminModel from "../models/adminModel";

/**
 * Service for creating new admin.
 * @returns {IApiResponse}
 */
export const createAdminService: (
  adminData: IAdmin
) => Promise<IApiResponse> = async (adminData: IAdmin) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.ADMIN.ERROR_CREATING_ADMIN,
    data: null,
  };
  try {
    const { name, userName, contactNo, emailId, password } = adminData;
    const existingAdmin = await AdminModel.findOne({ userName });
    if (existingAdmin) {
      response.statusCode = 409;
      response.message = CONSTANT_MESSAGE.ADMIN.ADMIN_NAME_ALREADY_EXISTS;
      return response;
    }
    const newAdmin = new AdminModel({
      name,
      userName,
      contactNo,
      emailId,
      password,
    });

    const savedAdmin = await newAdmin.save();

    response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
    response.message = CONSTANT_MESSAGE.ADMIN.ADMIN_CREATED_SUCCESSFULLY;
    response.data = savedAdmin;
    response.statusCode = 200;
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in createAdmin service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Service for get users
 * @returns {IApiResponse}
 */
export const getAdminsService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.ADMIN.ERROR_IN_GETTING_ADMINS,
    data: null,
  };
  try {
    const { search, id } = req.query;
    let adminData;
    if (id) {
      adminData = await AdminModel.findById(id);
    } else {
      const queryObj = {
        ...(search && {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { userName: { $regex: search, $options: "i" } },
          ],
        }),
      };
      adminData = await AdminModel.find(queryObj);
      if (!adminData.length) {
        adminData = null;
      }
    }

    response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
    response.message = adminData
      ? CONSTANT_MESSAGE.ADMIN.ADMIN_FOUND
      : CONSTANT_MESSAGE.ADMIN.NO_ADMIN_FOUND;
    response.data = adminData;
    response.statusCode = 200;
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in getAdminsService service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Function responsible to update the user details. userName cannot be changed.
 * @returns
 */
export const updateAdminService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.ADMIN.ERROR_IN_UPDATING_ADMIN,
    data: null,
  };
  try {
    const { name, contactNo, emailId, id, password } = req.body as IAdmin;
    const adminData = await AdminModel.findOneAndUpdate(
      { _id: id },
      {
        ...(name && { name }),
        ...(contactNo && { contactNo }),
        ...(emailId && { emailId }),
        ...(password?.length > 8 && { password }),
      },
      { returnDocument: "after" }
    );
    if (adminData) {
      response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
      response.message = CONSTANT_MESSAGE.ADMIN.ADMIN_UPDATED_SUCCESSFULLY;
      response.data = adminData;
      response.statusCode = 200;
    } else {
      response.statusCode = 404;
      response.status = CONSTANT_MESSAGE.STATUS.ERROR;
      response.message = CONSTANT_MESSAGE.ADMIN.NO_ADMIN_FOUND;
    }
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in updateAdminService service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Function responsible to delete the user by Id.
 */
export const deleteAdminService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.ADMIN.ERROR_IN_DELETING_ADMIN,
    data: null,
  };
  try {
    const { id } = req.query;
    const deletedResponse = await AdminModel.findByIdAndDelete(id);
    if (deletedResponse) {
      response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
      response.message = CONSTANT_MESSAGE.ADMIN.ADMIN_SUCCESSFULLY_DELETED;
      response.statusCode = 200;
    } else {
      response.statusCode = 404;
      response.status = CONSTANT_MESSAGE.STATUS.ERROR;
      response.message = CONSTANT_MESSAGE.ADMIN.NO_ADMIN_FOUND;
    }
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in updateAdmin service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * To get admin by userName.
 */
export const getAdminByUserName = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.ADMIN.ERROR_IN_GETTING_ADMINS,
    data: null,
  };
  try {
    const adminData: IAdmin | null = await AdminModel.findOne({
      username: req.body.username,
    });
    response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
    response.message = adminData
      ? CONSTANT_MESSAGE.ADMIN.ADMIN_FOUND
      : CONSTANT_MESSAGE.ADMIN.NO_ADMIN_FOUND;
    response.data = adminData;
    response.statusCode = 200;
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in getAdminByUserName service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};
