import { Router } from "express";
import { validationResult } from "express-validator";
import {
	userDetailsValidator,
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

router.get("/api/users/:id", validateId, async (request, response) => {
	const { id } = request.params;

	const errors = validationResult(id);

	if (!errors.isEmpty())
		return response.status(404).json({ error: errors.array()[0].msg });

	try {
		const user = await User.findById(id).select("_id username email ").lean();

		return response.status(200).json(user);
	} catch (error) {
		console.log("error");
		return response.status(500).json({ error: error.message });
	}
});

router.post("/api/users/create", async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const newUser = new User({ username, email, password });
		await newUser.save();

		// Use toObject to convert Mongoose documents to JavaSript plain objects
		const {
			password: userPassword,
			__v,
			...userToBeReturned
		} = newUser.toObject();

		res.status(201).json(userToBeReturned);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
});

router.put(
	"/api/users/update/:id",
	[userDetailsValidator, validateId],
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

// For now lets just use a validator for ID and just disregard the cases for the response body.
router.patch(
	"/api/users/patch/:id",
	[validateId],
	async (request, response) => {
		const {
			params: { id },
			body,
		} = request;

		const errors = validationResult(id);

		if (!errors.isEmpty())
			return response.status(400).json({ error: errors.array()[0].msg });
		try {
			const user = await User.findById(id);

			Object.keys(body).forEach((key) => {
				if (key !== "_id") user[key] = body[key];
			});

			await user.save();

			return response.status(200).json({ id, ...body });
		} catch (error) {
			console.log(error);
			return response.sendStatus(500);
		}
	}
);

router.delete("/api/users/:id", validateId, async (request, response) => {
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
