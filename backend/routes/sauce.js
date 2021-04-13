const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const rateLimiter = require("../middleware/rate-limit");
const checkUser = require("../middleware/checkUser");

router.post("/", auth, multer, rateLimiter, sauceCtrl.createSauce);

router.post("/:id/like", auth, rateLimiter, sauceCtrl.likeOrDislikeSauce);

router.get("/", auth, rateLimiter, sauceCtrl.allSauce);

router.get("/:id", auth, rateLimiter, sauceCtrl.uniqueSauce);

router.put("/:id", auth, checkUser, multer, rateLimiter, sauceCtrl.modifySauce);

router.delete("/:id", auth, checkUser, rateLimiter, sauceCtrl.deleteSauce);

module.exports = router;
