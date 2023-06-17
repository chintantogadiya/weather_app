const http = require('http');
const fs = require('fs');
const url = require('url');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal, orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}",(orgVal.main.temp-273.15).toFixed());
    temperature = temperature.replace("{%tempmin%}", (orgVal.main.temp_min -273.15).toFixed());
    temperature = temperature.replace("{%tempmax%}", (orgVal.main.temp_max-273.15).toFixed());
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}",orgVal.weather[0].main);
    console.log(temperature);
    return temperature;
};
http.createServer((req,res) =>{
    if(req.url == "/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Ahmedabad&appid=83f6871e0272a1529c819528d4a48aed')
            .on('data', (chunk) =>{
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                // the data is array format.so we have to convert it into string
                const realTimeData = arrData.map(val => replaceVal(homeFile,val)).toString();
                res.write(realTimeData);
            })
            .on('end', (err) =>{
                if (err) return console.log('connection closed due to errors', err);
                res.end();//if there is no more data to read then write res.end(); otherwise you will not get result 
            });
    }
}).listen(8000);