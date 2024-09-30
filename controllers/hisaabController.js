const { isLoggedIn } = require("../middlewares/auth-middlewares");
const hisaabModel = require("../models/hisaabModel");
const userModel = require("../models/userModel");
const { use } = require("../routes/indexRouter");

module.exports.createHisaabController = async function (req, res) {
    let { title, description, shareable, passcode, editpermissions } = req.body;

    encrypted = encrypted === "on" ? true : false
    shareable = shareable === "on" ? true : false
    editpermissions = editpermissions === "on" ? true : false

    try {
        let hisaabcreated = await hisaabModel.create({
            title,
            description,
            user: req.user._id,
            passcode,
            encrypted,
            shareable,
            editpermissions,
        });

        let user = await userModel.findOne({ email: req.user.email });
        user.hisaab.push(hisaabcreated._id);
        await use.save();

        res.redirect("/profile")

    }
    catch (err) {
        req.send(err.message)
    }
};

module.exports.hisaabPageController = async function (req, res) {
   return res.render("create");
}

module.exports.readHisaabController = async function (req, res) {
    const id = req.params.id;
    const hisaab = await hisaabModel.findOne({
        _id:id
    });
    if(!hisaab){
        return res.redirect("/profile");
    }
    if(hisaab.encrypted){
        return res.render("passcode", {isLoggedIn: true, id });
    }

    return res.render("hisaab", {isLoggedIn:true, hisaab});
}

module.exports.readVerifiedHisaabController = async function(req, res){
    const id= req.params.id;
    const hisaab = await hisaabModel.findOne({_id:id});

    if(!hisaab){
        return res.redirect("/profile");
    }

    if(hisaab.passcode !== req.body.passcode){
        return res.redirect("/profile");
    }

    return res.render("hisaab",{isLoggedIn:true, hisaab});
}

module.exports.deleteController = async function(req,res,next){
    const id = req.params.id;
    const hisaab = await hisaabModel.findOne({
        _id:id,
        user: req.user.id
    });

    if(!hisaab){
        return res.redirect("/profile");
    }

    await hisaabModel.deleteOne({
        _id:id
    })
    return res.redirect("/profile");
}

module.exports.editController = async function(req,res,next){
    const id = req.params.id;
    const hisaab = await hisaabModel.findById(id);

    if(!hisaab){
        return res.redirect("/profile");
    }

    return res.render("edit", {isLoggedIn: true, hisaab})
}

module.exports.editPostController = async function(req,res,next){
    const id = req.params.id;
    const hisaab = await hisaabModel.findById(id);

    if(!hisaab){
        return res.redirect("/profile");
    }
    hisaab.title = req.body.title;
    hisaab.data = req.body.description;
    hisaab.editpermissions = req.body.editpermissions =="on"? true : false;
    hisaab.shareable = req.body.shareable =="on"? true : false;
    hisaab.encrypted = req.body.encrypted =="on"? true : false;
    hisaab.passcode = req.body.passcode;

    await hisaab.save();
    res.redirect("/profile");
}