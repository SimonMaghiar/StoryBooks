const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require('express-session');
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");
//Load the config 
dotenv.config({path: './config/config.env'});
const path = require("path");

//Passport Config
require('./config/passport')(passport);

connectDB();

const PORT = process.env.PORT || 3000;
const app = express();

//Body Parser
app.use(express.urlencoded({extended: false }));    //<--It's necessary to be able to read the data from the req.body, when the form is submited
app.use(express.json());

//Method override 
app.use(methodOverride(function (req, res) {        //<-- This is used for edit.hbs so that we can use PUT method in the form.
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }));

//import routes
const index_routes = require("./routes/index");
const google_routes = require("./routes/auth");
const add_story_routes = require("./routes/stories");

//Handlebars Helpers  (In order to use helper functions, we need to register them as it is shown down below)
const {formatDate, truncate, stripTags, editIcon, select} = require('./helpers/hbs')

//Handlebars
app.engine('.hbs',exphbs({ helpers:{    //<--We register our helper functions situated in /helpers/hbs.js
    formatDate,
    truncate,
    stripTags,
    editIcon,
    select,
}, defaultLayout:'main',extname: '.hbs'}));
app.set('view engine','.hbs');

//Session
app.use(session({       //<-- Stores the cookie in the database so that when you refresh the dashboard, you won't be kicked out.
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  }));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function(req,res,next){
    res.locals.user = req.user; //<-- This is how we create an express global variable. 
                                //We use this so that we have access to ../user in index.hbs, more specifically, in the helper function.
    //console.log(res.locals);
    next();
});

//Static Folder
app.use(express.static(path.join(__dirname,'public')));  //<--used for main.hbs to include our css file

//Logging
if(process.env.NODE_ENV === 'development'){     //<--NODE_ENV is defined in package.json
    app.use(morgan('dev'));
}


//Routes
app.use('/',index_routes);
app.use('/auth',google_routes);
app.use('/',add_story_routes);

/* ------------------------------- */




app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);