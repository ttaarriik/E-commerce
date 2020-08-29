require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./routes/admin/auth');
const productShow = require('./routes/products');
const cartRouter  = require('./routes/carts');
const productRouter = require("./routes/admin/products");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const methodOverride = require("method-override");
const passportLocalMongoose = require("passport-local-mongoose");
const Admin = require("./models/admin");
const app = express();
const Product = require("./models/product");
//-momery unleaked---------
app.set('trust proxy', 1);

app.use(session({
cookie:{
    secure: true,
    maxAge:60000
       },
store: new RedisStore(),
secret: 'secret',
saveUninitialized: true,
resave: false
}));

app.use(function(req,res,next){
if(!req.session){
    return next(new Error('Oh no')) //handle error
}
next() //otherwise continue
});


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

let url = process.env.DATABASE || 3000;
mongoose.connect(url);

app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(express.static(__dirname +  "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	app.locals.currentUser = req.user;
	app.locals.error = null;
	app.locals.errors = null;
	next();
})


//PASSPORT CONFIGURE

app.use(require("express-session")({
	secret: "tareq",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());




app.use(authRouter);
app.use(productRouter);
app.use(productShow);
app.use(cartRouter);

app.listen(3000, () => {
  console.log('Listening');
});
