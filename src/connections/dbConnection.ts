import { connect } from "mongoose";

export const connectDb = async () => {
  try {
    const DB_URL: string | undefined = process.env.DB_URL;
    if (DB_URL) {
      await connect(DB_URL, { dbName: "library" });
      console.log("🚀 [INFO] 🚀 DB connected successfully!!");
    } else {
      console.log("🚀 [INFO] 🚀 DB URL is not found");
    }
  } catch (error) {
    console.log("🚀 [ERROR] 🚀 in connectDb", error);
  }
};
