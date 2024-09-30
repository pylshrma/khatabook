const express = require("express");
const env  = require("process");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const flash = require("connect-flash");

require("dotenv").config();

const indexRouter = require("./routes/indexRouter");
const hisaabRouter = require("./routes/hisaabRouter");
const userModel = require("./models/userModel");
const db = require("./config/mongoose-connection");


app.use(expressSession({
    secret: 'JWT_KEY', // Replace with a secure key
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/hisaab", hisaabRouter);

app.listen(process.env.PORT || 3000);