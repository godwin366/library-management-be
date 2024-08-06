import { Request } from "express";
import { CONSTANT_MESSAGE } from "../common/constant";
import { IApiResponse, IBook } from "../common/interface";
import { errorResponseMap } from "../helpers/helper";
import BookModel from "../models/bookModel";

/**
 * Service for creating new book
 * @returns {IApiResponse}
 */
export const createBookService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.BOOK.ERROR_CREATING_BOOK,
    data: null,
  };
  try {
    const { name, author, currentStatus } = req.body as IBook;
    const existingBook = await BookModel.findOne({ name });
    if (existingBook) {
      response.statusCode = 409;
      response.message = CONSTANT_MESSAGE.BOOK.BOOK_NAME_ALREADY_EXISTS;
      return response;
    }
    const newBook = new BookModel({
      name,
      author,
      ...(currentStatus && { currentStatus }),
    });

    const savedBook = await newBook.save();

    response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
    response.message = CONSTANT_MESSAGE.BOOK.BOOK_CREATED_SUCCESSFULLY;
    response.data = savedBook;
    response.statusCode = 200;
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in createBook service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Service for get books
 * @returns {IApiResponse}
 */
export const getBooksService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.BOOK.ERROR_IN_GETTING_BOOKS,
    data: null,
  };
  try {
    const { search, id } = req.query;
    let bookData;
    if (id) {
      bookData = await BookModel.findById(id);
    } else {
      const queryObj = {
        ...(search && {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
          ],
        }),
      };
      bookData = await BookModel.find(queryObj);
      if (!bookData.length) {
        bookData = null;
      }
    }

    response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
    response.message = bookData
      ? CONSTANT_MESSAGE.BOOK.BOOK_FOUND
      : CONSTANT_MESSAGE.BOOK.NO_BOOK_FOUND;
    response.data = bookData;
    response.statusCode = 200;
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in getBooksService service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Function responsible to update the book details.
 * @returns
 */
export const updateBookService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.BOOK.ERROR_IN_UPDATING_BOOK,
    data: null,
  };
  try {
    const { name, currentStatus, author, id } = req.body as IBook;
    let isNameAlreadyExist: Boolean = false;
    if (name) {
      const bookData = await BookModel.findOne({ name });
      if (bookData && String(bookData?._id) !== id) {
        isNameAlreadyExist = true;
      }
    }
    const bookData = await BookModel.findOneAndUpdate(
      { _id: id },
      {
        ...(name && { name }),
        ...(currentStatus && { currentStatus }),
        ...(author && { author }),
      },
      { returnDocument: "after" }
    );
    if (bookData) {
      response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
      response.message = isNameAlreadyExist
        ? CONSTANT_MESSAGE.BOOK.BOOK_NAME_ALREADY_EXISTS
        : CONSTANT_MESSAGE.BOOK.BOOK_UPDATED_SUCCESSFULLY;
      response.data = bookData;
      response.statusCode = 200;
    } else {
      response.statusCode = 404;
      response.status = CONSTANT_MESSAGE.STATUS.ERROR;
      response.message = CONSTANT_MESSAGE.BOOK.NO_BOOK_FOUND;
    }
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in updateBookService service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};

/**
 * Function responsible to delete the Book by Id.
 */
export const deleteBookService = async (req: Request) => {
  const response: IApiResponse = {
    statusCode: 400,
    status: CONSTANT_MESSAGE.STATUS.ERROR,
    message: CONSTANT_MESSAGE.USER.ERROR_IN_DELETING_USER,
    data: null,
  };
  try {
    const { id } = req.query;
    const deletedResponse = await BookModel.findByIdAndDelete(id);
    if (deletedResponse) {
      response.status = CONSTANT_MESSAGE.STATUS.SUCCESS;
      response.message = CONSTANT_MESSAGE.BOOK.BOOK_SUCCESSFULLY_DELETED;
      response.statusCode = 200;
    } else {
      response.statusCode = 404;
      response.status = CONSTANT_MESSAGE.STATUS.ERROR;
      response.message = CONSTANT_MESSAGE.BOOK.NO_BOOK_FOUND;
    }
  } catch (error: any) {
    console.error(
      `🚀 [ERROR] 🚀 in updateBookService service ${error?.message ?? ""}`
    );
    errorResponseMap(error, response);
  }
  return response;
};
