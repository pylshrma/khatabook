const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const hisaabModel = require("../models/hisaabModel");
const bcrypt = require("bcrypt");
const options = require("../routes/indexRouter");
const { isLoggedIn } = require("../middlewares/auth-middlewares");
const { log } = require("console");


module.exports.homepageController = function (req, res) {
    let message = req.flash("error");
    res.render("index", { isLoggedIn: false });
};

module.exports.registerPageController = function (req, res) {
    res.render("register", { isLoggedIn: false });
};

module.exports.registerController = async function (req, res) {
    let { email, username, password, name } = req.body;

    try {
        let user = await userModel.findOne({ email });
        if (user) return res.render("you already have an account, plz login ")

        let salt = await bcrypt.genSalt(10);
        let hashed = await bcrypt.hash(password, salt)

        user = userModel.create(
            {
                email,
                name,
                username,
                password: hashed
            });

        let token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_KEY
        );

        res.cookie("token", token)
        res.redirect("/profile")
    } catch (err) {
        res.send(err.message);
    }
};

module.exports.loginController = async function (req, res) {
    let { email, password } = req.body
    try {
        let user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            req.flash("error", "you have to registered first");
            return res.redirect("/");
        }

    let result = await bcrypt.compare(password, user.password)
        console.log(result);
        if (result) {
            let token = jwt.sign(
                { id: user._id, email: email },
                process.env.JWT_KEY,
            );
            console.log(token);
                res.cookie("token", token),
                res.send("ho gya");
        }
        else {
            res.redirect('/');
        }
    }
    catch (err) {
        req.flash("error", "something happen error 404");
        return res.redirect("/");
    }

};

module.exports.logoutController = async function (req, res) {
    res.cookie("token", "")
    return res.redirect("/")
};

module.exports.profileController = async function (req, res) {
    if (req.user) {
        const id = req.user.id;
      } else {
        console.log("req.user is null");
      }
    

    let byDate = Number(req.query.byDate);
    let { startDate, endDate } = req.query;

    byDate = byDate ? byDate : -1;
    startDate = startDate ? startDate : new Date("1970-01-01");
    endDate = endDate ? endDate : new Date();

    let user = await userModel
        .findOne({ _id: id })
        .populate({
            path: "hisaab",
            match: { createdAt: { $gte: startDate, $lte: endDate } },
            options: { sort: { createdAt: byDate } },
        });
    
const hisaabs = await hisaabModel.find({
    user: user._id
})
    res.render("profile", { isLoggedIn: true, user, hisaab })
};