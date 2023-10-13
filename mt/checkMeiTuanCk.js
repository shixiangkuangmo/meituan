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
  let ck=process.env[ckname] || "uuid=1695603435422400590; isUuidUnion=true; iuuid=1695603435434856464; WEBDFPID=u19x4uw9528v5622023z7v979z16y0048103x805y95979584936056w-2005095745430-1689735745430KAWSESUfd79fef3d01d5e9aadc18ccd4d0c95072389; _lxsdk_cuid=17d094a9600c8-09a434bcf393b2-57b1a33-295d29-17d094a9600c8; _lxsdk=1695603435434856464; uuid=ce943b95dc63493b9d5c.1693098337.1.0.0; token=AgF1IKvZBTC2tGXI1xLefcA1fpGH9CbYZNyEt6F4UmIZ61uc76c-xRiVVLELa6ONY-jYN7doorS9_wAAAAB5GwAAY6D-kh-6Jk-k5wIiG6GeUaFfHRRZFwRHV2KKdqnbQGlNgmSJs9QrTVOr2qNekVF3; mt_c_token=AgF1IKvZBTC2tGXI1xLefcA1fpGH9CbYZNyEt6F4UmIZ61uc76c-xRiVVLELa6ONY-jYN7doorS9_wAAAAB5GwAAY6D-kh-6Jk-k5wIiG6GeUaFfHRRZFwRHV2KKdqnbQGlNgmSJs9QrTVOr2qNekVF3; oops=AgF1IKvZBTC2tGXI1xLefcA1fpGH9CbYZNyEt6F4UmIZ61uc76c-xRiVVLELa6ONY-jYN7doorS9_wAAAAB5GwAAY6D-kh-6Jk-k5wIiG6GeUaFfHRRZFwRHV2KKdqnbQGlNgmSJs9QrTVOr2qNekVF3; userId=800464853; u=800464853; isid=AgF1IKvZBTC2tGXI1xLefcA1fpGH9CbYZNyEt6F4UmIZ61uc76c-xRiVVLELa6ONY-jYN7doorS9_wAAAAB5GwAAY6D-kh-6Jk-k5wIiG6GeUaFfHRRZFwRHV2KKdqnbQGlNgmSJs9QrTVOr2qNekVF3; _lx_utm=utm_term%3D258648; _lxsdk_s=18b24553793-09-684-c5%7C%7C19";
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