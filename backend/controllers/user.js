require("dotenv").config();
const connectCipher = process.env.CIPHER_PASSWORD;
const secretToken = process.env.SECRET_TOKEN;
//

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passwordValidator = require("../models/Password-validator");
const crypto = require("crypto");

// fonction signup
exports.signup = (req, res, next) => {
	let testValidation = passwordValidator.validate(req.body.password);
	if (testValidation == true) {
		// encryptage
		const cipher = crypto.createCipher("aes192", connectCipher);
		const encrypted = cipher.update(req.body.email, "utf8", "hex") + cipher.final("hex"); // utilise la fonction crypto sur req.body.email pour cacher cette dernière
		bcrypt
			.hash(req.body.password, 10)
			.then((hash) => {
				const user = new User({
					email: encrypted,
					password: hash
				});
				user.save()
					.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
					.catch((error) => res.status(400).json({ error }));
			})
			.catch((error) => res.status(501).json({ error }));
	} else if (testValidation == false) {
		console.log("mot de passe invalide");
	}
};

// fonction login
exports.login = (req, res, next) => {
	// encryptage
	const cipher = crypto.createCipher("aes192", connectCipher);
	const encrypted = cipher.update(req.body.email, "utf8", "hex") + cipher.final("hex"); // utilise la fonction crypto sur req.body.email pour cacher cette dernière
	User.findOne({ email: encrypted })
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign({ userId: user._id }, secretToken, {
							expiresIn: "24h"
						}) // changer le random_token_secret et le mettre dans dot.env
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
