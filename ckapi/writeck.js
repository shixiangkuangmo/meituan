// [name:写入ck]

// 第一行为插件名称， 在后台显示的使用会用到

// 返回数据格式
// return {
//      // 代表是否允许通过
//     "bool": true,
//      // 处理后的变量
//     "env": env
// }
let ip = "";
let port = "";
function randomString(e) {
  var e = e || 32,
    t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}
// 必须以main为函数名, env为传入变量
function main(env) {
  env = env.replace(/\'|\"/g, "");
  if (env && env.indexOf("userId") != -1 && env.indexOf("token") != -1 && (env.indexOf("webdfpid") != -1 || env.indexOf("WEBDFPID") != -1)) {
    let result = request({
      method: "POST",
      url: `http://${ip}:${port}/writeCk`,
      headers: {
        "User-Agent": "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      },
      json: true,
      dataType: "json",
      body: { ck: env },
    });

    if (result) {
      if (result.state == "403") {
        return {
          bool: true,
          env: result.msg,
        };
      }
      // 判断是否过期
      if (result["state"] === "success") {
        // Cookie有效
        return {
          bool: true,
          env: randomString(),
        };
      } else {
        // Cookie无效
        return {
          bool: false,
          env: result["msg"],
        };
      }
    } else {
      return {
        bool: false,
        env: "请求失败",
      };
    }
  } else {
    return {
      bool: false,
      env: "cookie无效",
    };
  }
}
