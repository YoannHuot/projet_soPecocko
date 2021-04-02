const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const rateLimit = require("../middleware/rate-limit");

// enregistrement nouvel utilisateur
router.post("/signup", rateLimit, userCtrl.signup);

// connexion d'un utilisateur existant
router.post("/login", rateLimit, userCtrl.login);

module.exports = router;
