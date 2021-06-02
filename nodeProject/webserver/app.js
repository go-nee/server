const express = require("express");

const app = express()
app.set('port', process.env.PORT||3000);


app.use(express.static(__dirname + '/public'));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get('/about', (req,res)=>{
    res.sendFile(__dirname + '/about.html');
});


app.use((req,res)=>{
    res.sendFile(__dirname + "/404.html");
});

app.listen(app.get('port'), (err)=>{
    if (err) return console.log(err);
    console.log(app.get('port'), '번 폰트에서 대기 중');
});