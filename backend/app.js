require("dotenv").config();

// variable d'ajout des extensions package.json
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const nocache = require("nocache");

// variable environnement
const connectMongo = process.env.CONNECT_MONGODB;

// variable importation de la route pour authentification
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/images", express.static(path.join(__dirname, "images")));

// mongoSanitize = permet de remplacer certains caractères spéciaux qui ouvrent des failles de sécurité
app.use(mongoSanitize());

// helmet = permet de cacher l'infastrucutre de l'application
app.use(helmet());

// nocache = permet d'éviter certains problème de connexion utilisateur
app.use(nocache());

// connexion à la base de données mongoose
mongoose
	.connect(connectMongo, { useNewUrlParser: true, useUnifiedTopology: true })
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
