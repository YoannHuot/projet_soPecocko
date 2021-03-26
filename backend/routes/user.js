const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

// enregistrement nouvel utilisateur
router.post("/signup", userCtrl.signup);

// connexion d'un utilisateur existant
router.post("/login", userCtrl.login);

module.exports = router;
