// 引入express
const express = require('express')
const fs = require('fs');
const axios = require('axios').default;
const path = require("path");
const requestIp = require('request-ip');
const bodyParser = require("body-parser");//body参数解析
// 调用express()
const app = express()
app.use(requestIp.mw());
app.use(bodyParser.urlencoded({ extended: false })); //parse application/x-www-form-urlencoded
app.use(bodyParser.json()); //parse application/json


app.set('trust proxy', true);
function getValue(ck,key){
  ck = ck.replaceAll(' ', '');
  let arr = ck.split(";");
  let name = "无";
  for(let i=0;i<arr.length;i++){
    let item = arr[i].split("=");
    if(item[0] == key){
      name = item[1];
      break;
    }
  }
  return name;
}
function digit(value, length = 2) {
  if (
    typeof value === "undefined" ||
    value === null ||
    String(value).length >= length
  ) {
    return value;
  }
  return (Array(length).join("0") + value).slice(-length);
}
 
//格式化日期到毫秒
function toDateString(time, format = "yyyy-MM-dd HH:mm:ss.SSS") {
  if (!time) {
    return "";
  }
  if (typeof time === "number" && String(time).length === 10) {
    time = time * 1000; // 10位时间戳处理
  }
  const date = new Date(time);
  const ymd = [
    digit(date.getFullYear(), 4),
    digit(date.getMonth() + 1),
    digit(date.getDate()),
  ];
  const hms = [
    digit(date.getHours()),
    digit(date.getMinutes()),
    digit(date.getSeconds()),
    digit(date.getMilliseconds()),
  ];
  return format
    .replace(/yyyy/g, ymd[0])
    .replace(/MM/g, ymd[1])
    .replace(/dd/g, ymd[2])
    .replace(/HH/g, hms[0])
    .replace(/mm/g, hms[1])
    .replace(/ss/g, hms[2])
    .replace(/SSS/g, hms[3]);
}
function isFileExisted(path_way) {
  fs.access(path_way, (err) => {
    if (err) {
      fs.appendFileSync(path_way, '{}', 'utf-8', (err) => {
        if (err) {
          return console.log('该文件不存在，重新创建失败！')
        }
        console.log("文件不存在，已新创建");
      });
    } else {
      console.log(err);
    }
  })
};
app.post('/writeCk', async function (request, response) {
  let strck = request.body.ck;
  console.log(strck);
  let ck = {
    "remark": "",
    "cookie_str": strck,
    "active": true
  }
  let result = {
    state:"success",
    msg:"成功"
  }
  let resdata = await axios.post(
    'https://i.waimai.meituan.com/openh5/account/center?_=1696948947206&yodaReady=h5&csecplatform=4&csecversion=2.2.1',
    {},
    {
      headers: {
        'Host': 'i.waimai.meituan.com',
        'Accept': 'application/json',
        'User-Agent':'Mozilla/5.0 (Linux; Android 12; Redmi K30 Pro Zoom Edition Build/SKQ1.211006.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.104 Mobile Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://h5.waimai.meituan.com',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://h5.waimai.meituan.com/',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cookie':strck
      },
    }
  )
  console.log(resdata);
  if(resdata.status == 200 && resdata.data.msg=="成功"){
    ck.remark = resdata.data.data.userName;
    let strpath = "./db.json";
    let isCf = false;
    try{
      let res = fs.readFileSync(strpath, "utf8");
      const config = JSON.parse(res);
      for(let i=0;i<config.length;i++){
        if(config[i]["cookie_str"] == ck["cookie_str"]){
          isCf = true;
        }
      }
      if(isCf){
        result = {
          state:"fail",
          msg:"禁止重复提交！"
        }
      }else{
        config.push(ck);
        const updatedConfig = JSON.stringify(config, null, 2);
        fs.writeFileSync(strpath, updatedConfig);
        console.log("Config file updated successfully.");
      }
    }
    catch(e){
      console.log(e);
      result = {
        state:"fail",
        msg:"文件操作失败！"
      }
    }
  }else{
    result = {
      state:"fail",
      msg:"cookie失效，请重新获取！"
    }
  }
  
  response.send(result);
})
app.get('/', function (request, response) {
  console.log(request);
  response.send({success:"index"})
})
 
 
app.get('/cdk', async (req, res) => {
  let str;
  let day = toDateString(new Date).slice(0,11);
  console.log(req.clientIp);
  let ip = req.ip.replace("::ffff:","");
  let key = ip;
  let strpath = day.replaceAll("-","")+".json";
  let  re = await isFileExisted(strpath);
  let rdata = fs.readFileSync(strpath, "utf8");
  let ipdata = JSON.parse(rdata);
  if(ipdata[key]){
    str = `<h1 style='color:red;'>fail:每个ip每日仅能获取一个10次的CDK，您今日已获取过：${ipdata[key]}</h1>`
    res.send(str);
  }else{
    let rdata1 = fs.readFileSync("./cdk.json", "utf8");
    let cdkdata = JSON.parse(rdata1);
    if(cdkdata.length){
        let cdk = cdkdata[0];
        let upcdk = JSON.stringify(cdkdata.slice(1), null, 2);
        fs.writeFileSync("./cdk.json", upcdk);
    
        let rdata2 = fs.readFileSync(strpath, "utf8");
        let ipdata = JSON.parse(rdata2);
        let nipdata = ipdata;
        nipdata[key] = cdk;
        let unipdata = JSON.stringify(nipdata, null, 2);
        fs.writeFileSync(strpath, unipdata);
        console.log("Config file updated successfully.");
        
        str = `<h1 style='color:red;'>Your CDK is: ${cdk}</h1>`
        res.send(str);
    }else{
        str = `<h1 style='color:red;'>CDK已无，请联系作者，妖火ID：28570。</h1>`
        res.send(str);
    }
  }
});
// 监听端口，启动web服务
app.listen(3030, function () {
  console.log('app listening on port 3030!')
})
