// variable d'ajout des extensions package.json
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
// variable importation de la route pour authentification
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// OSWAP : Variable d'envrionnement .env (mettre les mdp dans dans des variables d'environnement) => ne pas giter le .env
// rate-limite : express-rate-limite npm
// password-validator : voir le package (créer un modele de password + require)
// express-mongo-sanitize
// helmet express
// nocache

app.use("/images", express.static(path.join(__dirname, "images")));

// connexion à la base de données mongoose
mongoose
	.connect(
		"mongodb+srv://YoannH:QzNjDxWJBYYSO5S4@cluster0.ijq2e.mongodb.net/PROJET6_SOPEKOCKO?retryWrites=true&w=majority",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

// autorisation CORS

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

// route pour le signup et le login
app.use("/api/auth", userRoutes);

// routes pour les sauces
app.use("/api/sauces", sauceRoutes);

module.exports = app;
