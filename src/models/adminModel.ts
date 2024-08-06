import { model, Schema } from "mongoose";
import { IAdmin } from "../common/interface";

const adminSchema = new Schema<IAdmin>(
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
    password: {
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
  }
);

const AdminModel = model<IAdmin>("AdminModel", adminSchema, "admins");
export default AdminModel;
