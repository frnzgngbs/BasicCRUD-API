import { Router } from "express";
import { validationResult } from "express-validator";
import {
	createUserValidator,
	validateId,
} from "../schema/validator/UserValidator.mjs";
import { User } from "../schema/model/UserModel.mjs";

export const router = Router();

router.get("/api/users", async (request, response) => {
	try {
		const users = await User.find({});
		return response.json(users);
	} catch (err) {}
});

router.post("/api/users", async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const newUser = new User({ username, email, password });
		await newUser.save();
		res.status(201).json(newUser);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
});

router.put(
	"/api/user/:id",
	[createUserValidator, validateId],
	async (request, response) => {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return response.status(400).json({ errors: errors.array() });
		}

		const {
			params: { id },
			body: { username, password, email },
		} = request;

		console.log(`ID = ${id}, BODY = ${(username, password, email)}`);

		try {
			await User.findByIdAndUpdate(id, { username, password, email });

			return response.status(204);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server error" });
		}

		// const updatedUser = await User.findByIdAndUpdate();
	}
);

router.delete("/api/user/:id", validateId, async (request, response) => {
	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		// Get the first error message
		const errorMessage = errors.array()[0].msg;
		return response.status(400).json({ error: errorMessage });
	}

	const { id } = request.params;

	try {
		const toDeleteUser = await User.findByIdAndDelete(id).select(
			"_id username email"
		);

		if (!toDeleteUser) return response.status(404).send("User not found.");

		return response.status(200).json({ ...toDeleteUser });
	} catch (error) {
		console.log(error);
		return response.sendStatus(500);
	}
});
