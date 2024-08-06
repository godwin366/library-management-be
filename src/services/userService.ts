import { Request } from "express";
import { CONSTANT_MESSAGE } from "../common/constant";
import { IApiResponse } from "../common/interface";
import UserModel from "../models/userModel";
import { errorResponseMap } from "../helpers/helper";

/**
 * Service for creating new user
 * @returns {IApiResponse}
 */
export const createUserService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.USER.ERROR_CREATING_USER,
    data: null,
  };
  try {
    const { name, userName, contactNo, emailId } = req.body;
    const existingUser = await UserModel.findOne({ userName });
    if (existingUser) {
      response.statusCode = 409;
      response.message = CONSTANT_MESSAGE.USER.USER_NAME_ALREADY_EXISTS;
      return response;
    }
    const newUser = new UserModel({
      name,
      userName,
      contactNo,
      emailId,
    });

    const savedUser = await newUser.save();

    response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
    response.message = CONSTANT_MESSAGE.USER.USER_CREATED_SUCCESSFULLY;
    response.data = savedUser;
    response.statusCode = 200;
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in createUser service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Service for get users
 * @returns {IApiResponse}
 */
export const getUsersService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.USER.ERROR_IN_GETTING_USERS,
    data: null,
  };
  try {
    const { search, id } = req.query;
    let userData;
    if (id) {
      userData = await UserModel.findById(id);
    } else {
      const queryObj = {
        ...(search && {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { userName: { $regex: search, $options: "i" } },
          ],
        }),
      };
      userData = await UserModel.find(queryObj);
      if (!userData.length) {
        userData = null;
      }
    }

    response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
    response.message = userData
      ? CONSTANT_MESSAGE.USER.USER_FOUND
      : CONSTANT_MESSAGE.USER.NO_USER_FOUND;
    response.data = userData;
    response.statusCode = 200;
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in getUsersService service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Function responsible to update the user details. userName cannot be changed.
 * @returns
 */
export const updateUserService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.USER.ERROR_IN_UPDATING_USER,
    data: null,
  };
  try {
    const { name, contactNo, emailId, id } = req.body;
    const userData = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        ...(name && { name }),
        ...(contactNo && { contactNo }),
        ...(emailId && { emailId }),
      },
      { returnDocument: "after" }
    );
    if (userData) {
      response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
      response.message = CONSTANT_MESSAGE.USER.USER_UPDATED_SUCCESSFULLY;
      response.data = userData;
      response.statusCode = 200;
    } else {
      response.statusCode = 404;
      response.status = CONSTANT_MESSAGE.STATUS.ERROR;
      response.message = CONSTANT_MESSAGE.USER.NO_USER_FOUND;
    }
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in updateUserService service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Function responsible to delete the user by Id.
 */
export const deleteUserService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.USER.ERROR_IN_DELETING_USER,
    data: null,
  };
  try {
    const { id } = req.query;
    const deletedResponse = await UserModel.findByIdAndDelete(id);
    if (deletedResponse) {
      response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
      response.message = CONSTANT_MESSAGE.USER.USER_SUCCESSFULLY_DELETED;
      response.statusCode = 200;
    } else {
      response.statusCode = 404;
      response.status = CONSTANT_MESSAGE.STATUS.ERROR;
      response.message = CONSTANT_MESSAGE.USER.NO_USER_FOUND;
    }
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in updateUserService service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};
