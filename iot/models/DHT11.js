//MongoDB에 온습도 데이터 저장하기 위해서 스키마 생성
const mongoose = require("mongoose");   //스키마 생성 위한 mongoose 모듈
const DHT11Schema = mongoose.Schema({
    tmp : {                         // 온도 데이터
        type : String,
        required : true
    },  
    hum : {                         // 습도 데이터
        type : String,
        required : true
    },
    created_at : {                  // 날짜(시간) 데이터
        type : Date,
        default : Date.now          // MongoDB 서버에 있는 시간 정보를 defaultfh
    }
});

module.exports = mongoose.model('DHT11', DHT11Schema);