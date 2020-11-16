const express = require("express");
const app = express();
const exphbs = require("express-handlebars");

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Routing
app.get('/',(req,res)=>{
    res.render('index',{
        title:'Home Page', 
        name: "Simon Maghiar",
        age: 24,
        isDisplayName: true,
        isAgeEnabled: true
    });
});
 //
app.get('/about',(req,res)=>{
    res.render('about',{title: "About Page"});
});

app.get('/dashboard',(req,res)=>{
    res.render('dashboard',{
       isListEnable: false 
    });
});

app.get('/each/helper', (req,res)=>{
    res.render('contact',{
        people:[
            "James",
            "Simon",
            "Peter",
            "Sarah"
        ],
        user:{
            username: "accimesterlin",
            age: 15,
            phone: 404232
        },
        lists:[
            {
                items: ["Mango","Apple"]
            },
            {
                items: ["Potato","Carrot"]
            }
        ]
    });
});

app.listen(8080, () =>{
    console.log("Server is starting at port",8080);
});