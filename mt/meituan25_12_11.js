const sendNotify = require('./sendNotify.js');
const { HttpsProxyAgent } = require('https-proxy-agent')
const ee = require("./editEnv.js")
const autoCheck = require("./checkMeiTuanCk.js")
const axios = require("axios");
let qqTimes = process.env["qqTimes"] || 30;
const getUa = require("./randomUa.js")
qqTimes = Number(qqTimes);
let url = "";
let proxy = "";
let body = {};
let headers = {};
const sq_coupon = {
  couponId: "887DAF7CAE8744BD95CA49FF0A13758A",
  gdPageId: "513833",
  pageId: "516533",
  instanceId: "16890429573560.08766758935246644",
  componentId: "16890429573560.08766758935246644",
  desc:"天天神券-社群专享 25-12 11点"
};
const H5guard = require("./mt.js");
const params = {
  couponId: sq_coupon.couponId,
  gdPageId: sq_coupon.gdPageId,
  pageId: sq_coupon.pageId,
  instanceId: sq_coupon.instanceId,
  componentId: sq_coupon.componentId,
  version: "1",
  utmSource: "",
  utmCampaign: "",
  yodaReady: "h5",
  csecplatform: "4",
  csecversion: "2.0.1"
};

const data = {
  cType: "mti",
  fpPlatform: 3,
  wxOpenId: "",
  appVersion: "",
};
let cookieStr = "";
// 安卓UA
let userAgent = "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/" + 59 + Math.round(Math.random() * 10) + ".0.3497." + Math.round(Math.random() * 100) + "Safari/537.36";
const fullUrl = `test`;
let h5guardData = [];
let exTimes = 0;
let logTimes = 0;

let ck="";
let cookies = [];

let ckTimes = 0;
let logObj = {};
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
function watchCookie(v){
  setTimeout(() => {
    if(v != ck.split("#").length){
        
      console.log(ckTimes);
      watchCookie(ckTimes);
    }else{
      for(let i=0;i<cookies.length;i++){
        logObj[cookies[i]["remark"]] = [];
      }
      geth5data()
      watchValue(exTimes);
      watchLogs(logTimes);
    }
  }, 100);
}
function getCookies(){
  watchCookie(ckTimes);
  ckArr = ck.split("#");
  for(let i=0;i<ckArr.length;i++){
    setTimeout(()=>{
      try{
        axios.post(
          'https://i.waimai.meituan.com/openh5/account/center',
          {},
          {
            headers: {
              'Host': 'i.waimai.meituan.com',
              'Accept': 'application/json',
              'User-Agent':'Mozilla/5.0 (Linux; Android 12; Redmi K30 Pro Zoom Edition Build/SKQ1.211006.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/97.0.4664.104 Mobile Safari/537.36',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Origin': 'https://h5.waimai.meituan.com',
              'Sec-Fetch-Site': 'same-site',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Dest': 'empty',
              'Referer': 'https://h5.waimai.meituan.com/',
              'Accept-Encoding': 'gzip, deflate, br',
              'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
              'Cookie':ckArr[i]
            },
          }
        )
        .then((res) => {
          let obj = {
            "remark": res.data.data.userName,
            "cookie_str": ckArr[i],
            "active": true
          }
          cookies.push(obj);
          ckTimes++;
        })
        .catch((err) => {
          console.log(err.code);
          ckTimes++;
        });
      }
      catch(e){
        ckTimes++;
      }
    })
  }
}



function geth5data(){
  for(let i=0;i<cookies.length;i++){
    setTimeout(()=>{
      userAgent = getUa.getRandomUA();
      cookieStr = cookies[i].cookie_str;
      let h5guard = new H5guard(cookieStr, userAgent);
      h5guard.sign(fullUrl, data).then((res) => {
        url = "https://promotion.waimai.meituan.com/lottery/limitcouponcomponent/fetchcoupon?couponReferId=" + params.couponId + "&actualLng=114.10923&actualLat=22.98523&geoType=2&gdPageId=" + params.gdPageId + "&pageId=" + params.pageId + "&version=" + params.version + "&utmSource=" + params.utmSource + "&utmCampaign=" + params.utmCampaign + "&instanceId=" + params.instanceId + "&componentId=" + params.componentId + "&yodaReady=" + params.yodaReady + "&csecplatform=" + params.csecplatform + "&csecversion=" + params.csecversion;
      
        body = {
          cType: "wx_wallet",
          fpPlatform: 13,
          wxOpenId: "",
          appVersion: "",
          mtFingerprint: res.mtFingerprint,
        };
      
        headers = {
          mtgsig: res.mtgsig,
          Accept: "application/json, text/plain, */*",
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          Origin: "https://market.waimai.meituan.com",
          "Sec-Fetch-Site": "same-site",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          Referer: "https://market.waimai.meituan.com/",
          "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
          Host: "promotion.waimai.meituan.com",
          Connection: "keep-alive",
          "X-Requested-With": "com.tencent.mm",
          "Content-Length": JSON.stringify(body).length,
          Cookie: cookieStr,
        };
        let userId = cookieStr.match(/userId=(\d+)/)[1];
        let tokenStr = cookieStr.match(/token=([^;]+)/)[1];
        let token = `userId=${userId}&token=${tokenStr}`;
        let uurl = "https://promotion.waimai.meituan.com/lottery/limitcouponcomponent/info?couponReferIds=" + params.couponId + "&" + token;
        let remark = cookies[i]["remark"];
        h5guardData.push({headers,body,url,uurl,remark});
        exTimes++;
      });
    },0)
  }
}

function watchValue(v){
  setTimeout(() => {
    if(v != cookies.length){
      watchValue(exTimes)
    }else{
      startMain()
    }
  }, 100);
}
function watchLogs(v){
  setTimeout(() => {
    if(v != cookies.length*qqTimes){
      watchLogs(logTimes)
    }else{
      console.log(logObj);
      let keysArr = Object.keys(logObj);
      let msgstr = "";
      for(let i=0;i<keysArr.length;i++){
         msgstr += keysArr[i] + ":\n" + logObj[keysArr[i]].at(-1) + "\n\n";
      }
      sendNotify.sendNotify("美团25-12 11点通知:",msgstr);
    }
  }, 100);
}
let intervals = [];
let nums = [];

function startMain(){
  for(let i=0;i<h5guardData.length;i++){
    nums[i] = 0;
    setTimeout(()=>{
      axios.get(h5guardData[i]["uurl"]).then((response) => {
        let time = new Date(toDateString(new Date).slice(0,11) + "09:59:59").getTime() - new Date().getTime();
        console.log(time+"毫秒后开始运行脚本！");
        let headers = h5guardData[i]["headers"];
        setTimeout(() => {
          intervals[i] = setInterval(() => {
            nums[i]++;
            logTimes++;
            let option ={headers, json: true};
            if(proxy != "http://:@:$"){
              option[httpAgent] = new HttpsProxyAgent(proxy);
              option[httpsAgent] = new HttpsProxyAgent(proxy);
            }
            axios
              .post(h5guardData[i]["url"], h5guardData[i]["body"], option)
    
              .then((answer) => {
                console.log(answer.data,123);
                logObj[h5guardData[i]["remark"]].push(sq_coupon.desc + answer.data.msg + toDateString(new Date) + ". userId: " + headers["Cookie"].match(/userId=(\d+)/)[1]);
                if(answer.data.msg.indexOf("成功")>-1){
                  logTimes = logTimes + qqTimes - logTimes%qqTimes;
                  ee.setEnvVar("mt_sq25_12_11",headers["Cookie"]);
                  clearInterval(intervals[i]);
                }
              })
              .catch((err) => {
                console.log(err.response.status,"error1");
                logObj[h5guardData[i]["remark"]].push(sq_coupon.desc + err.response.status.toString() + " 请求次数过多，禁止访问。" + err.response.statusText + toDateString(new Date) + ".  userId: " + headers["Cookie"].match(/userId=(\d+)/)[1])
                clearInterval(intervals[i]);
                logTimes = logTimes + qqTimes - logTimes%qqTimes;
              });
            if (nums[i] === qqTimes) {
              clearInterval(intervals[i]);
            }
          }, 100);
        }, time);
      })
      .catch((error) => {
        console.log(error.response.status.toString() + error.response.statusText,"error2");
        logObj[h5guardData[i]["remark"]].push(sq_coupon.desc + error.status + error.statusText + toDateString(new Date) + ". userId: " + headers["Cookie"].match(/userId=(\d+)/)[1])
      });
    },0)
  }
}

autoCheck.autoCheck("mt_sq25_12_11","美团25-12 11点通知").then(async (res)=>{
  ck = process.env["mt_sq25_12_11"] || "uuid=1695603435422400590; isUuidUnion=true; iuuid=1695603435434856464; WEBDFPID=u19x4uw9528v5622023z7v979z16y0048103x805y95979584936056w-2005095745430-1689735745430KAWSESUfd79fef3d01d5e9aadc18ccd4d0c95072389; _lxsdk_cuid=17d094a9600c8-09a434bcf393b2-57b1a33-295d29-17d094a9600c8; _lxsdk=1695603435434856464; uuid=ce943b95dc63493b9d5c.1693098337.1.0.0; token=AgF1IKvZBTC2tGXI1xLefcA1fpGH9CbYZNyEt6F4UmIZ61uc76c-xRiVVLELa6ONY-jYN7doorS9_wAAAAB5GwAAY6D-kh-6Jk-k5wIiG6GeUaFfHRRZFwRHV2KKdqnbQGlNgmSJs9QrTVOr2qNekVF3; mt_c_token=AgF1IKvZBTC2tGXI1xLefcA1fpGH9CbYZNyEt6F4UmIZ61uc76c-xRiVVLELa6ONY-jYN7doorS9_wAAAAB5GwAAY6D-kh-6Jk-k5wIiG6GeUaFfHRRZFwRHV2KKdqnbQGlNgmSJs9QrTVOr2qNekVF3; oops=AgF1IKvZBTC2tGXI1xLefcA1fpGH9CbYZNyEt6F4UmIZ61uc76c-xRiVVLELa6ONY-jYN7doorS9_wAAAAB5GwAAY6D-kh-6Jk-k5wIiG6GeUaFfHRRZFwRHV2KKdqnbQGlNgmSJs9QrTVOr2qNekVF3; userId=800464853; u=800464853; isid=AgF1IKvZBTC2tGXI1xLefcA1fpGH9CbYZNyEt6F4UmIZ61uc76c-xRiVVLELa6ONY-jYN7doorS9_wAAAAB5GwAAY6D-kh-6Jk-k5wIiG6GeUaFfHRRZFwRHV2KKdqnbQGlNgmSJs9QrTVOr2qNekVF3; _lx_utm=utm_term%3D258648; _lxsdk_s=18b24553793-09-684-c5%7C%7C19";
  // 代理ip和代理端口
  let proxyIp = '';
  let proxyPort = '';
  // 配置用户名和密码
  let username = '';
  let password = '';
  proxy = `http://${username}:${password}@${proxyIp}:${proxyPort}`
  if(ck != "")
    getCookies();
});

