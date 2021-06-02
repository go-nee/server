const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://192.168.0.3"); //라즈베리파이의 IP주소
const DHT11 = require("./models/DHT11");

const express = require("express");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require('dotenv/config');

client.on("connect", ()=>{
    //ades
    console.log("moquitoo server connected"); 
    client.subscribe("dnt11");
});

client.on("message", (topic, message)=>{
    var obj = JSON.parse(message); //message -> JSON형식으로 변환
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    obj.created_at = new Date(Date.UTC(year, month, today, hours, minutes, seconds));

    console.log(obj);


    //DHT11 모듈로부터 dht11 객체를 생성하고 mqtt로부터 수신한 데이터(obj 객체)를 dht11 컬렉션에 저장
    const dnt11 = new DHT11({
        tmp : obj.tmp,
        hun : obj.hum,
        created_at : obj.created_at
    });
    try{
        const saveDHT11 = dht11.save();
        console.log("insert Ok");
    }catch(err){
        console.log({message : err});
    }
});

//웹 서버 구축
app.set("port", "3000");    //포트 설정
var server = http.createServer(app);    //서버 생성

//웹 서버 구동 및 MongoDB 접속
server.listen(3000, (err)=>{
    if(err){
        return console.log(err);    //3000번 포트가 사용 중이면 에러
    }else{
        console.log("A web server is ready");
        //MongoDB 접속(DB 명 : iot)
        mongoose.connect(process.env.MONGODB_URL,
            { dbName: "iot", useNewUrlParser: true, useUnifiedTopology: true}, ()=> console.log("Succesfully connected to MongoDB!"));
    }
});

// 클라이언트와 통신하기 위해 소켓 만들기(socket.io 모듈 이용)
var io = require("socket.io")(server);
// io에 connection 이벤트를 등록()
io.on("connection", (socket)=>{
    //소켓을 통해서 클라이언트가 송신한 socket_evt_mqtt 이벤트 수신
    socket.on("socket_evt_mqtt", (data)=>{
        //MongoDB의 DHT11 컬렉션에 있는 데이터를 받아서 클라이언트에 송신
        DHT11.find({}).sort({_id : -1}).limit(1).then(obj=>{
            socket.emit("socket_evt_mqtt",JSON.stringify(obj[0]));
        });
    });
});

app.use(express.static(__dirname + "/public"));