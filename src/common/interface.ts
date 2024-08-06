import { Date } from "mongoose";

export interface IUser {
  name: string;
  userName: string;
  contactNo: string;
  emailId: string;
}

export interface IBook {
  name: string;
  author: string;
  currentStatus: string;
  id?: string;
}

export interface IAdmin {
  name: string;
  userName: string;
  contactNo: string;
  password: string;
  emailId: string;
  id?: string;
}

export interface ILibraryTransaction {
  userId: string;
  bookId: string;
  dueDate: Date;
  transactionType: "BORROWED" | "RETURNED";
  id?: string;
}

export interface IApiResponse {
  data?: any | null;
  statusCode: number;
  status: string;
  message?: string;
}
