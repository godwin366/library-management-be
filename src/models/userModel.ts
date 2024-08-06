import { model, Schema } from "mongoose";
import { IUser } from "../common/interface";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = model<IUser>("UserModel", userSchema, "users");
export default UserModel;
