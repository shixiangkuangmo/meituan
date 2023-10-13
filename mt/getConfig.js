//此文件为获取配置文件，未完成
const fs = require('fs');
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
let date = toDateString(new Date);
let tag = date.slice(11,16)
console.log(tag);
function getCoupon() {
  
  let rdata = fs.readFileSync('./sq_coupon.json', 'utf8');
  let data = JSON.parse(rdata);
  console.log(tag);
  //console.log(data);
  /*switch (tag) {
    case "09:50":
      ckMt.autoCheck("mt_sq25_12_10","10点 25-12");
      ckMt.autoCheck("mt_sq30_15_10","10点 30-15");
      break;
    case "10:20":
      ckMt.autoCheck("mt_sq25_12_10_30","10点30 25-12");
      break;
    case "10:50":
      ckMt.autoCheck("mt_kf11","11点 25-25咖啡");
      ckMt.autoCheck("mt_sq25_12_11","11点 25-12");
      break;
    case "13:50":
      ckMt.autoCheck("mt_kf14","14点 25-25咖啡");
      break;
    case "14:50":
      ckMt.autoCheck("mt_sq25_12_15","15点 25-12");
      break;
    case "15:50":
      ckMt.autoCheck("mt_sq30_15_16","16点 30-15");
      ckMt.autoCheck("mt_sq25_12_16","16点 25-12");
      break;
    case "16:50":
      ckMt.autoCheck("mt_sq25_12_17","17点 25-12");
      ckMt.autoCheck("mt_sq38_16_17","17点 38-16");
      break;
  }*/
}
