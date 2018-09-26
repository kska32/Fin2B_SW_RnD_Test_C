let express = require("express");
let bodyParser = require("body-parser");
let exphbs  = require('express-handlebars');
var childProcess = require('child_process');

let app = express();
let port = 28082;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.enable('view cache');//Template Caching

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit:"300kb"}));

app.use(express.static(__dirname + '/public'));

app.listen(port, function () {
    console.log('The server is running at http://localhost:'+port+'/');
    childProcess.exec('start http://localhost:'+port);
});

app.get("/",(req,res,next)=>{
    res.render("cover",{timer:Date.now()});
});

//..
app.get("/main",(req,res,next)=>{
    res.render("main",{timer:Date.now()});
});

//피보나치 요청 응답....
app.post("/fibonacci",(req,res,next)=>{
    let n = req.body.N;
    let Fibonacci = getFibonacciNumber(parseInt(n));
    res.end(Fibonacci.toString());
});
//Fibonacci

//google api key때문에 뒷단에서 처리해야 할뜻.
app.post("/googleSearch",async(req,res,next)=>{
    let searchkey = req.body.searchkey;
    let key = "AIzaSyDE7k8lIGIteWbLs4ShuoBwYm1Ld3JyC_0";
    let cx = "006302910569569867484:4derhzxxwny";
    let hostname = 'www.googleapis.com'; 
    let path = '/customsearch/v1/siterestrict?key='+key+'&cx='+cx+'&q='+encodeURIComponent(searchkey);

    let result = await httpsRequest(hostname,path,"get");
    res.end(result);
});

//피보나치 계산 요구사항대로 이렇게 뒷단에서.
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

//Nodejs httpsClient api를 사용하여, googleCustomApi rest요청.
const https = require('https');
function httpsRequest(hostname,path,method="POST",port=443){
        return new Promise(function(resolve){
                const options = {
                    hostname: hostname,
                    port: 443,
                    path: path,
                    method
                };
                
                const req = https.request(options, (res) => {
                    let data = '';
                    res.on('data', (d) => {
                        data += d;
                    });
                    res.on('end', (e) =>{
                        resolve(data);
                    });
                });

                req.on('error', (e) => { console.error(e); });
                req.end();
        });
}
