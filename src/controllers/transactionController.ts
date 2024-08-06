import { Request, Response } from "express";
import { CONSTANT_MESSAGE } from "../common/constant";
import { IApiResponse } from "../common/interface";
import {
  createTransactionService,
  deleteTransactionService,
  getTransactionsService,
  updateTransactionService,
} from "../services/libraryTransactionService";
import {
  transactionValidation,
  updateTransactionValidation,
} from "../validators/validators";

/**
 * Function responsible to create a transaction.
 */
export const addTransactionController = async (req: Request, res: Response) => {
  try {
    const { error } = transactionValidation.validate(req.body);
    if (error) {
      return res.status(400).send({
        message: `${CONSTANT_MESSAGE.ERROR.VALIDATION_ERROR}: ${
          error.details?.[0]?.message ?? ""
        }`,
      });
    }
    const creteTransactionResponse: IApiResponse =
      await createTransactionService(req);

    return res
      .status(creteTransactionResponse.statusCode)
      .send(creteTransactionResponse);
  } catch (error: any) {
    console.error(
      "🚀 [ERROR] 🚀 in addTransactionController controller: ",
      error
    );
    return res.status(401).send({
      statusCode: 401,
      status: CONSTANT_MESSAGE.STATUS.ERROR,
      message: error.message,
    });
  }
};

/**
 * Function responsible to get transactions by name or id or all transactions.
 */
export const getTransactionController = async (req: Request, res: Response) => {
  try {
    const transactionsResponse: IApiResponse = await getTransactionsService(
      req
    );
    return res
      .status(transactionsResponse.statusCode)
      .send(transactionsResponse);
  } catch (error: any) {
    console.error(
      "🚀 [ERROR] 🚀 in getTransactionController controller: ",
      error
    );
    return res.status(401).send({
      statusCode: 401,
      status: CONSTANT_MESSAGE.STATUS.ERROR,
      message: error.message,
    });
  }
};

/**
 * Function responsible to update transactions details by the id.
 */
export const updateTransactionController = async (
  req: Request,
  res: Response
) => {
  try {
    const { error } = updateTransactionValidation.validate(req.body);
    if (error) {
      return res.status(400).send({
        message: `${CONSTANT_MESSAGE.ERROR.VALIDATION_ERROR}: ${
          error.details?.[0]?.message ?? ""
        }`,
      });
    }
    const updateTransactionRes: IApiResponse = await updateTransactionService(
      req
    );
    return res
      .status(updateTransactionRes.statusCode)
      .send(updateTransactionRes);
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in updateTransaction controller: ", error);
    return res.status(401).send({
      statusCode: 401,
      status: CONSTANT_MESSAGE.STATUS.ERROR,
      message: error.message,
    });
  }
};

/**
 * Function responsible to delete Transaction by the id.
 */
export const deleteTransactionController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).send({
        message: `${CONSTANT_MESSAGE.ERROR.VALIDATION_ERROR}: ${CONSTANT_MESSAGE.ERROR.ID_IS_REQUIRED}`,
      });
    }
    const deleteResponse: IApiResponse = await deleteTransactionService(req);
    return res.status(deleteResponse.statusCode).send(deleteResponse);
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in deleteTransaction controller: ", error);
    return res.status(401).send({
      statusCode: 401,
      status: CONSTANT_MESSAGE.STATUS.ERROR,
      message: error.message,
    });
  }
};
