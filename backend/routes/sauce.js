const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const rateLimiter = require("../middleware/rate-limit");

router.post("/", auth, multer, rateLimiter, sauceCtrl.createSauce);

router.post("/:id/like", auth, rateLimiter, sauceCtrl.likeOrDislikeSauce);

router.get("/", auth, rateLimiter, sauceCtrl.allSauce);

router.get("/:id", auth, rateLimiter, sauceCtrl.uniqueSauce);

router.put("/:id", auth, multer, sauceCtrl.checkUser, rateLimiter, sauceCtrl.modifySauce);

router.delete("/:id", auth, multer, sauceCtrl.checkUser, rateLimiter, sauceCtrl.deleteSauce);

module.exports = router;
