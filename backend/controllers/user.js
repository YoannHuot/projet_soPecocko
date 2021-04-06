require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passwordValidator = require("../models/Password-validator");
const connectCipher = process.env.CIPHER_PASSWORD;
const crypto = require("crypto");

// Cipher => permet de crypter les adresses mail

// fonction signup
exports.signup = (req, res, next) => {
	let testValidation = passwordValidator.validate(req.body.password);
	if (testValidation == true) {
		const cipher = crypto.createCipher("aes192", connectCipher); // constante qui définit la méthode de la fonction crypto
		var encrypted = cipher.update(req.body.email, "utf8", "hex"); // utilise la fonction crypto sur req.body.email pour cacher cette dernière
		encrypted = encrypted + cipher.final("hex");
		bcrypt
			.hash(req.body.password, 10)
			.then((hash) => {
				const user = new User({
					email: req.body.email,
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
	User.findOne({ email: req.body.email })
		// il faudra décrypter le mail pour le trouver dans la bdd
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
						token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
							expiresIn: "24h"
						}) // changer le random_token_secret et le mettre dans dot.env
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
