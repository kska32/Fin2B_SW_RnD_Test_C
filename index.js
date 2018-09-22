let express = require("express");
let bodyParser = require("body-parser");
let exphbs  = require('express-handlebars');
var childProcess = require('child_process');

let app = express();
let port = 28082;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.enable('view cache');//Template Caching

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit:"300kb"}));

app.use(express.static(__dirname + '/public'));

app.listen(port, function () {
    console.log('The Test is running at http://localhost:'+port+'/');
    childProcess.exec('start http://localhost:'+port);
});

app.get("/",(req,res,next)=>{
    res.render("home",{body:"HOME",timer:Date.now(),form:true});
});

app.get("/contact",(req,res,next)=>{
    res.render("home",{body:"CONTACT",timer:Date.now()});
});

app.post("/fibonacci",(req,res,next)=>{
    let n = req.body.N;
    let Fibonacci = getFibonacciNumber(parseInt(n));
    res.end(Fibonacci.toString());
});
//Fibonacci

function getFibonacciNumber(n){
    let x1=0,x2=1;
    let sum=0;
    switch(n){
        case 1:
            sum = 0;
            break;
        case 2:
            sum = 1;
            break;
        default:
            for(let i=0; i<n-2; i++){
                sum = x1 + x2;
                x1 = x2;
                x2 = sum;
            }
            break;
    }
    return sum;
}





