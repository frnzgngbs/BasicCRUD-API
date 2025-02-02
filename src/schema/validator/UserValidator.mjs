import { body, param } from "express-validator";
import mongoose from "mongoose";

// Just to demonstrate the use of validators. Not checking edge cases here
export const validateId = param("id").custom((id) => {
	if (!mongoose.isValidObjectId(id)) throw new Error("Invalid Id");
});

export const userDetailsValidator = [
	body("username")
		.isLength({ min: 5, max: 15 })
		.withMessage(
			"Username must be at least 5 characters and at most 15 characters."
		),
	body("password")
		.isEmpty()
		.isLength({ min: 5, max: 20 })
		.withMessage(
			"Password must be at least 5 characters and at most 20 characters."
		),
	body("email").isEmail().withMessage("Please provide a valid email address."),
];
