import { Request } from "express";
import mongoose from "mongoose";
import { CONSTANT_MESSAGE } from "../common/constant";
import { IApiResponse, ILibraryTransaction } from "../common/interface";
import { errorResponseMap } from "../helpers/helper";
import LibraryTransactionModel from "../models/libraryTransactionModel";

/**
 * Service for creating new book
 * @returns {IApiResponse}
 */
export const createTransactionService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.TRANSACTION.ERROR_CREATING_TRANSACTION,
    data: null,
  };
  try {
    const { bookId, userId, dueDate, transactionType } =
      req.body as ILibraryTransaction;
    const existingTransaction = await LibraryTransactionModel.findOne({
      bookId,
      userId,
      dueDate,
      ...(transactionType && { transactionType }),
    });
    if (existingTransaction) {
      response.statusCode = 409;
      response.message =
        CONSTANT_MESSAGE.TRANSACTION.TRANSACTION_ALREADY_EXISTS;
      return response;
    }
    const newTransaction = new LibraryTransactionModel({
      bookId,
      userId,
      dueDate,
      ...(transactionType && { transactionType }),
    });

    const savedTransaction = await newTransaction.save();

    response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
    response.message =
      CONSTANT_MESSAGE.TRANSACTION.TRANSACTION_CREATED_SUCCESSFULLY;
    response.data = savedTransaction;
    response.statusCode = 200;
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in createTransaction service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Service for get transactions
 * @returns {IApiResponse}
 */
export const getTransactionsService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.TRANSACTION.ERROR_IN_GETTING_TRANSACTIONS,
    data: null,
  };
  try {
    const { transactionType, id, bookId, userId, dueDate } = req.body;

    const query = [
      ...(id || transactionType || bookId || userId || dueDate
        ? [
            {
              $match: {
                ...(id && { _id: new mongoose.Types.ObjectId(id) }),
                ...(transactionType && { transactionType }),
                ...(bookId && { bookId }),
                ...(userId && { userId }),
                ...(dueDate && { dueDate: new Date(dueDate) }),
              },
            },
          ]
        : []), // Match the transaction by ID
      {
        $addFields: {
          userIdObjectId: {
            $convert: {
              input: "$userId",
              to: "objectId",
            },
          },
          bookIdIdObjectId: {
            $convert: {
              input: "$bookId",
              to: "objectId",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users", // Collection name for users
          localField: "userIdObjectId", // Field after conversion
          foreignField: "_id", // Field from the users collection
          as: "userDetails", // Output array field
        },
      },
      { $unwind: "$userDetails" }, // Unwind userDetails array
      {
        $lookup: {
          from: "books", // Collection name for users
          localField: "bookIdIdObjectId", // Field after conversion
          foreignField: "_id", // Field from the users collection
          as: "bookDetails", // Output array field
        },
      },
      { $unwind: "$bookDetails" }, // Unwind bookDetails array
      {
        $project: {
          userId: 1,
          bookId: 1,
          dueDate: 1,
          transactionType: 1,
          userDetails: {
            id: 1,
            name: 1,
            userName: 1,
            contactNo: 1,
            emailId: 1,
          },
          bookDetails: {
            _id: 1,
            name: 1,
            author: 1,
            currentStatus: 1,
          },
        }, // Specify fields to include in the output
      },
    ];
    const transactionData = await LibraryTransactionModel.aggregate(query);

    response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
    response.message = transactionData
      ? CONSTANT_MESSAGE.TRANSACTION.TRANSACTION_FOUND
      : CONSTANT_MESSAGE.TRANSACTION.NO_TRANSACTION_FOUND;
    response.data = transactionData;
    response.statusCode = 200;
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in getTransactionsService service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Function responsible to update the transaction details.
 * @returns
 */
export const updateTransactionService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.TRANSACTION.ERROR_IN_UPDATING_TRANSACTION,
    data: null,
  };
  try {
    const { bookId, userId, dueDate, transactionType, id } =
      req.body as ILibraryTransaction;

    const transactionData = await LibraryTransactionModel.findOneAndUpdate(
      { _id: id },
      {
        ...(bookId && { bookId }),
        ...(userId && { userId }),
        ...(dueDate && { dueDate }),
        ...(transactionType && { transactionType }),
      },
      { returnDocument: "after" }
    );
    if (transactionData) {
      response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
      response.message =
        CONSTANT_MESSAGE.TRANSACTION.TRANSACTION_UPDATED_SUCCESSFULLY;
      response.data = transactionData;
      response.statusCode = 200;
    } else {
      response.statusCode = 404;
      response.status = CONSTANT_MESSAGE.STATUS.ERROR;
      response.message = CONSTANT_MESSAGE.TRANSACTION.NO_TRANSACTION_FOUND;
    }
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in updateTransactionService service ${
        error?.message ?? ""
      }`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Function responsible to delete the Transaction by Id.
 */
export const deleteTransactionService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.USER.ERROR_IN_DELETING_USER,
    data: null,
  };
  try {
    const { id } = req.query;
    const deletedResponse = await LibraryTransactionModel.findByIdAndDelete(id);
    if (deletedResponse) {
      response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
      response.message =
        CONSTANT_MESSAGE.TRANSACTION.TRANSACTION_SUCCESSFULLY_DELETED;
      response.statusCode = 200;
    } else {
      response.statusCode = 404;
      response.status = CONSTANT_MESSAGE.STATUS.ERROR;
      response.message = CONSTANT_MESSAGE.TRANSACTION.NO_TRANSACTION_FOUND;
    }
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in updateTransactionService service ${
        error?.message ?? ""
      }`
    );
    errorResponseMap(error, response);
  }
  return response;
};
