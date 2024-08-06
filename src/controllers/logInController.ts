import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CONSTANT_MESSAGE } from "../common/constant";
import { IAdmin } from "../common/interface";
import { getAdminByUserName } from "../services/adminService";

export const logInUserController = async (req: Request, res: Response) => {
  try {
    if (!(req.body.userName && req.body.password?.length >= 8)) {
      return res.status(400).send({
        message: CONSTANT_MESSAGE.ERROR.INVALID_CREDENTIALS,
      });
    }
    const adminData = await getAdminByUserName(req);
    const { userName, name, contactNo, emailId } = adminData.data as IAdmin;
    const match = await bcrypt.compare(
      req.body.password,
      adminData.data.password
    );

    if (match) {
      console.log(process.env.JWT_SECRET_KEY);

      const accessToken = jwt.sign(
        { userName, name, contactNo, emailId },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '1h' }
      );
      res.status(200).send({
        status: adminData.status,
        data: { userName, name, contactNo, emailId },
        accessToken: accessToken,
      });
    } else {
      return res.status(401).send({
        message: CONSTANT_MESSAGE.ERROR.INCORRECT_PASSWORD,
      });
    }
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in addBookController controller: ", error);
    return res.status(401).send({
      statusCode: 401,
      status: CONSTANT_MESSAGE.STATUS.ERROR,
      message: error.message,
    });
  }
};
