import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { connectDb } from "./db.mjs";
import { router } from "./routes/userRoutes.mjs";

const app = express();

connectDb();
const PORT = process.env.port || 8000;

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
	console.log(`Server is running at ${PORT}`);
});
