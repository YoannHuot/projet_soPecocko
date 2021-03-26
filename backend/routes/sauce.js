const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, sauceCtrl.createSauce);

router.post("/:id/like", auth, sauceCtrl.likeOrDislikeSauce);

router.get("/", auth, sauceCtrl.allSauce);

router.get("/:id", auth, sauceCtrl.uniqueSauce);

router.put("/:id", auth, multer, sauceCtrl.modifySauce);

router.delete("/:id", auth, multer, sauceCtrl.deleteSauce);

module.exports = router;
