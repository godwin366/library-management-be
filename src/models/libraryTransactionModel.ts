import { model, Schema } from "mongoose";
import { ILibraryTransaction } from "../common/interface";

const libraryTransactionSchema = new Schema<ILibraryTransaction>(
  {
    userId: {
      type: String,
      required: true,
    },
    bookId: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
      default: "BORROWED",
    },
  },
  {
    timestamps: true,
  }
);

const LibraryTransactionModel = model<ILibraryTransaction>(
  "LibraryTransactionModel",
  libraryTransactionSchema,
  "libraryTransactions"
);
export default LibraryTransactionModel;
