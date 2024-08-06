import { NextFunction, Request, Response } from "express";
import { CONSTANT_MESSAGE } from "../common/constant";
import jwt from "jsonwebtoken";

export const userAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"] as string;
    if (!token)
      return res.status(400).send({
        statusCode: 400,
        message: CONSTANT_MESSAGE.AUTH.TOKEN_NOT_PROVIDED,
      });
    const jwtToken = token.split(" ")[1];
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY as string);
    if (!isVerified) {
      return res
        .status(401)
        .send({ message: CONSTANT_MESSAGE.AUTH.AUTHENTICATION_FAILED });
    }
    next();
  } catch (error: any) {
    console.log("🚀 [ERROR] 🚀 in userAuthentication", error.message);
    if (error?.message === "invalid token") {
      return res
        .status(401)
        .send({ message: CONSTANT_MESSAGE.AUTH.INVALID_TOKEN });
    } else {
      return res.status(500).send({
        statusCode: 500,
        status: CONSTANT_MESSAGE.STATUS.ERROR,
        message: CONSTANT_MESSAGE.AUTH.INTERNAL_SERVER_ERROR,
      });
    }
  }
};
