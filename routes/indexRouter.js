const express = require("express");
const router = express.Router();
const {
    homepageController,
    registerPageController,
    registerController,
    loginController,
    logoutController,
    profileController,
} = require("../controllers/indexController");
const { isLoggedIn, redirectIfLoggedIn } = require("../middlewares/auth-middlewares");

router.get("/", redirectIfLoggedIn, homepageController);
router.get("/register", registerPageController);
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/logout", logoutController);
router.get("/profile",isLoggedIn, profileController);


module.exports = router;