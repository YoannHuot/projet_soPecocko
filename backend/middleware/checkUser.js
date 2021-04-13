const Sauce = require("../models/Sauce");

module.exports = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			console.log(sauce.userId);
			console.log(req.body.userConnected);

			if (sauce.userId === req.body.userConnected) {
				next();
			} else {
				console.log("error : Id propriétaire de la sauce différent");
				res.status(401).json({ message: "User différent" });
			}
		})
		.catch((error) => res.status(500).json({ error }));
};
