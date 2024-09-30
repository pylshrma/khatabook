const express = require("express");
const router = express.Router();
const {
    isLoggedIn, redirectIfLoggedIn,} = require("../middlewares/auth-middlewares");

const { createHisaabController,
    hisaabPageController,
    deleteController,
    readVerifiedHisaabController,
    readHisaabController,
    editController,
    editPostController
} = require("../controllers/hisaabController");


router.get("/create", isLoggedIn, hisaabPageController);
router.post("/create", isLoggedIn, createHisaabController);

router.get("/delete/:id", isLoggedIn , deleteController);
router.get("/edit/:id", isLoggedIn, editController);
router.post("/edit/:id", isLoggedIn, editPostController);

router.get("/view/:id",isLoggedIn, readHisaabController);

router.post("/verify/:id",isLoggedIn, readVerifiedHisaabController);




module.exports = router;