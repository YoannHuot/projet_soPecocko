// Middleware qui protégera les routes dans lequel il est inséré en vérifiant que l'utilisateur est bien authentifié avant de l'autoriser à envoyer des requêtes

const jsonWebToken = require("jsonwebtoken");
require("dotenv").config();
const protectEncodeToken = process.env.SECRET_TOKEN;

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jsonWebToken.verify(token, protectEncodeToken);
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId !== userId) {
			throw "Invalid user ID";
		} else {
			next();
		}
	} catch {
		res.status(401).json({
			error: new Error("Invalid request!")
		});
	}
};
