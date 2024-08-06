import { Request, Response } from "express";
import { CONSTANT_MESSAGE } from "../common/constant";
import { IApiResponse } from "../common/interface";
import {
  createBookService,
  deleteBookService,
  getBooksService,
  updateBookService,
} from "../services/bookService";
import { bookValidation } from "../validators/validators";

/**
 * Function responsible to create a book.
 */
export const addBookController = async (req: Request, res: Response) => {
  try {
    const { error } = bookValidation.validate(req.body);
    if (error) {
      return res.status(400).send({
        message: `${CONSTANT_MESSAGE.ERROR.VALIDATION_ERROR}: ${
          error.details?.[0]?.message ?? ""
        }`,
      });
    }
    const creteBookResponse: IApiResponse = await createBookService(req);

    return res.status(creteBookResponse.statusCode).send(creteBookResponse);
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in addBookController controller: ", error);
    return res.status(401).send({
      statusCode: 401,
      status: CONSTANT_MESSAGE.STATUS.ERROR,
      message: error.message,
    });
  }
};

/**
 * Function responsible to get books by name or id or all books.
 */
export const getBookController = async (req: Request, res: Response) => {
  try {
    const booksResponse: IApiResponse = await getBooksService(req);
    return res.status(booksResponse.statusCode).send(booksResponse);
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in getBookController controller: ", error);
    return res.status(401).send({
      statusCode: 401,
      status: CONSTANT_MESSAGE.STATUS.ERROR,
      message: error.message,
    });
  }
};

/**
 * Function responsible to update books details by the id.
 */
export const updateBookController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        message: `${CONSTANT_MESSAGE.ERROR.VALIDATION_ERROR}: ${CONSTANT_MESSAGE.ERROR.ID_IS_REQUIRED}`,
      });
    }
    const updateBookRes: IApiResponse = await updateBookService(req);
    return res.status(updateBookRes.statusCode).send(updateBookRes);
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in updateBook controller: ", error);
    return res.status(401).send({
      statusCode: 401,
      status: CONSTANT_MESSAGE.STATUS.ERROR,
      message: error.message,
    });
  }
};

/**
 * Function responsible to delete Book by the id.
 */
export const deleteBookController = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).send({
        message: `${CONSTANT_MESSAGE.ERROR.VALIDATION_ERROR}: ${CONSTANT_MESSAGE.ERROR.ID_IS_REQUIRED}`,
      });
    }
    const deleteResponse: IApiResponse = await deleteBookService(req);
    return res.status(deleteResponse.statusCode).send(deleteResponse);
  } catch (error: any) {
    console.error("🚀 [ERROR] 🚀 in deleteBook controller: ", error);
    return res.status(401).send({
      statusCode: 401,
      status: CONSTANT_MESSAGE.STATUS.ERROR,
      message: error.message,
    });
  }
};
