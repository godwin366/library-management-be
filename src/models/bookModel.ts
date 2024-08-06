import { model, Schema } from "mongoose";
import { IBook } from "../common/interface";

const bookSchema = new Schema<IBook>(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    currentStatus: {
      type: String,
      required: true,
      default: "IN_STOCK",
    },
  },
  {
    timestamps: true,
  },
);

const BookModel = model<IBook>("BookModel", bookSchema, "books");
export default BookModel;
