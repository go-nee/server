var express = require("express");
var router = expresss.Router();
const mqtt = require("mqtt");
const DHT11 = require("../models/DHT11");

//mosquitto server에 접속하기
const clinet = mqtt.connect("mqtt://192.168.15.79");

//웹 클라이언트(mqtt.html)가 post 방식으로 URL(http://192.168.0.6:3000/devices/led)요청시 처리
//웹 클라이언트로부터 수신한 데이터: {"flag": value}
router.post("/led", function(req, res, next){
    //웹 클라이언트로의 응답 메시지 작성
    res.set("Content-Type", "text/json");
    if(req.body.flag == "on"){          // 수신한 데이터(flag) 값이 on 이면
        client.publish("led", "1");     // mosquitto server로 led = "on"을 전송
        res.send(JSON.stringify({led : "on"}));     // 웹 클라이언트에게 led = "on" 응답 메시지
                                                    // -> mqtt.html의 61행의 obj로 전달된다
    }else{                              // 수신한 데이터(flag) 값이 off이면
        client.publish("led", "2");     // mosquitto server로 led = "2"를 전송
        res.send(JSON.stringify({led : "off"}));    // 웹 클라이언트에게 led = "off" 응답 메시지

    }
});

module.exports = router;