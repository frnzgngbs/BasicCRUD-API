import mongoose from "mongoose";

export const connectDb = async () => {
	const dbUrl = process.env.DB_URL;
	try {
		await mongoose.connect(dbUrl);
		console.log("MongoDB connected successfully");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1); // Exit process with failure
	}
};
