import mongoose from "mongoose";

export const connectDb = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://genegobisfranz:eIVDi61Uqatgpe4B@expressdb.lnmsp1u.mongodb.net/SimpleCRUD-api?retryWrites=true&w=majority&appName=ExpressDB"
		);
		console.log("MongoDB connected successfully");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1); // Exit process with failure
	}
};
