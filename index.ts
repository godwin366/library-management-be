import cors from "cors";
import dotenv from "dotenv";
import express, { Response } from "express";
import { connectDb } from "./src/connections/dbConnection";
import routes from "./src/routes/route";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors());

app.get("/api/health", (_, res: Response) => {
  res.send({ status: "success", message: "Health check!" });
});
app.use("/api", routes);

const port = 5000;

app.listen(port, () => {
  console.log(`🚀 [INFO] 🚀 Server running on the port: ${port}`);
  connectDb();
});
