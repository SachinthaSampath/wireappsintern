const http = require('http');
const fs = require("fs");
const port = 3000;

const server = http.createServer((rquest,response)=>{
    
    response.writeHead(200,{'Content-Type':'text/html'});

    fs.readFile('index.html',(error,data)=>{
        //console.log(data);
        if(error){
            response.writeHead(404);
            response.write("Error: File not found");
        }else{
            response.write(data);
        }
        response.end();
    })
    //response.write("Hello Node");
    
});

server.listen(port,(error)=>{
    if(error){
        console.log("Something is wrong",error);
    }else{
        console.log("Server is listening on port "+port);
    }
});