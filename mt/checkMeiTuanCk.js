const axios = require('axios').default;

const sendNotify = require('./sendNotify.js');
let sendmsg = "";
const ee = require("./editEnv")
async function chekCk(ck){
  try{
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
        'Cookie':ck
      },
    }
  )
  if(resdata.status == 200 && resdata.data.msg=="成功"){
    return {isValid:true,name:resdata.data.data.userName};
  }else{
    return {isValid:false,name:""};
  }
  }
  catch(e){
    return {isValid:false,name:""};
  }
}
async function autoCheck(ckname,title){
  let ck=process.env[ckname] || "";
  if(!ck)
    return "空ck";
  let ckArr = ck.split("#");
  for(let i=0;i<ckArr.length;i++){
    let isValid = await chekCk(ckArr[i])
    console.log(isValid);
    if(!isValid.isValid){
      let a = await ee.setEnvVar(ckname,ckArr[i],title);
      console.log(a + "ck失效已删除.");
      sendmsg += a;
    }
  }
  
  if(sendmsg.length)
    sendNotify.sendNotify("ck失效通知",sendmsg);
  return "ok";
} 
exports.autoCheck = autoCheck;