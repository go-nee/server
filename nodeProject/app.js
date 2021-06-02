const http = require("http");

const server = http.createServer((req,res)=>{ //req : 요청 ,res : 응답
    if (req.url === '/'){
        res.write("<h1>Hello from node.js</h1>");

    }else{
        res.write(`<h1>You have entered this ult: ${req.url}</h1>`);
    }
    res.end();

});

server.listen(3000, () =>{
    console.log("This server is listening on port 3000");
})