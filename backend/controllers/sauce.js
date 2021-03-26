const Sauce = require("../models/Sauce");
const fs = require("fs"); // file system

exports.createSauce = (req, res, next) => {
	//On stocke dans une variable les données envoyées par le frontend en les transformant en objet js sous forme de chaine de caractères
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	// //Création instance d'une nouvelle sauce
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
		//req.protocol = HTTP ou HTTPS
		//req.get("host") = obtenir l'host du serveur, dans notre cas loclhost:3000 mais en production ce sera la racine du serveur
		//req.file.filename = le nom du fichier
	});
	// console.log(sauceObject.name);
	// Sauvegarde la sauce dans la base de données
	sauce
		.save()
		// 	//Envoi au frontend de la réponse
		.then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
		.catch((error) => res.status(400).json({ error }));
};

// renvoie le tableau de toutes les sauces dans la BDD
exports.allSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};

// renvoie la sauce avec l'ID correspondant
exports.uniqueSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id }) // on vérifie que l'ID enregistré dans mongoose = l'id présent dans l'URL soit l'id du produit
		.then((thing) => res.status(200).json(thing))
		.catch((error) => res.status(404).json({ error }));
};

// permet de modifier une sauce
exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file // opérateur ternaire, si req.file = true alors ...
		? {
				...JSON.parse(req.body.sauce), // on parse le JSON pour le rendre exploitable
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}` // on update l'image defaçon dynamique en cas de modification de l'image
		  }
		: { ...req.body }; // si req.file = sauce alors on update le body de la requête
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // on vérifie que les id correspondent, puis on remplace le body de sauceObject par les valeurs changées dans la requête
		.then(() => res.status(200).json({ message: "Sauce modifiée !" }))
		.catch((error) => res.status(400).json({ error }));
};

// permet de supprimer une sauce
exports.deleteSauce = (req, res, next) => {
	const saucId = req.params.id;
	Sauce.findOne({ _id: saucId }) // on trouve l'objet dans la BDD
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1]; // une fois trouvé, on extrait le nom du fichier à delete
			fs.unlink(`images/${filename}`, () => {
				// on le supprime avec le package fs et la fonction .unlink
				Sauce.deleteOne({ _id: req.params.id }) // avec le callback du fs.link on fait le delete du fichier dans la BDD
					.then(() => res.status(200).json({ message: "Objet supprimé !" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

// permet de liker une sauce
exports.likeOrDislikeSauce = (req, res, next) => {
	const like = req.body.like;
	const userId = req.body.userId;
	if (like == 1) {
		// si on like
		Sauce.updateOne(
			// appelle de la fonction updateOne
			{ _id: req.params.id }, // en JSON, on vérifie que l'ID du tableau d'objet est égale à l'id de l'URL
			{ $push: { usersLiked: userId } }, // on push dans le tableau usersLikes[] l'id du User qui like
			{ $inc: { likes: +1 } } // on incrémente de le nombre de like de un
		)
			.then(() => res.status(200).json({ message: "Like ajouté !" }))
			.catch((error) => res.status(400).json({ error }));
	} else if (like == -1) {
		Sauce.updateOne(
			{ _id: req.params.id },
			{ $push: { usersDisliked: userId } },
			{ $inc: { dislikes: +1 } }
		)
			.then(() => res.status(200).json({ message: "dislike ajouté !" }))
			.catch((error) => res.status(400).json({ error }));
	} else if (like == 0) {
		Sauce.findOne({ _id: req.params.id }) // on cherche la sauce sur laquelle on se trouve par son url (params)
			.then((sauce) => {
				if (sauce.usersLiked.includes(req.body.userId)) {
					// on vérifie si le tableau de la sauce trouvée possède l'ID de l'user (donc si ce dernier a déjà liké)) ==> si le tableau userLiked contient l'id du user de la requête
					Sauce.updateOne(
						// si cette confition est remplie, alors on update la sauce, toujours en la qualifiant par ID.
						{ _id: req.params.id },
						{ $pull: { usersLiked: userId } },
						{ $inc: { likes: -1 } }
					)
						.then(() => res.status(200).json({ message: " like retiré !" }))
						.catch((error) => res.status(400).json({ error }));
				} else if (sauce.usersDisliked.includes(req.body.userId)) {
					//
					Sauce.updateOne(
						{ _id: req.params.id },
						{ $pull: { usersDisliked: userId } },
						{ $inc: { dislikes: -1 } }
					)
						.then(() => res.status(200).json({ message: " dislike retiré !" }))
						.catch((error) => res.status(400).json({ error }));
				}
			})
			.catch((error) => res.status(400).json({ error }));
	} else {
		return res.status(400).json({ error });
	}
};
