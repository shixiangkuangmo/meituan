// [name:美团Cookie检测2]
function main(env) {
  env = env.replace(/\'|\"/g, '');
  if (env && env.indexOf("userId") != -1 && env.indexOf("token") != -1 && (env.indexOf("webdfpid") != -1 || env.indexOf("WEBDFPID") != -1)) {
    let result = request({
      method: "post",
      url: "https://i.waimai.meituan.com/cfeplay/playcenter/batchgrabred/drawPoints/v2",
      headers: {
        Cookie: env,
      },
      dataType: "json",
      timeout: 5 * 1000,
    });

    if (result) {
      // 判断是否过期
      if (result["code"] === 0) {
        // Cookie有效
        return {
          bool: true,
          env: env,
        };
      } else if (result["code"] === 1) {
        // Cookie有效
        return {
          bool: true,
          env: env,
        };
      } else {
        // Cookie无效
        return {
          bool: false,
          env: "Cookie已失效",
        };
      }
    } else {
      return {
        bool: false,
        env: "检查Cookie失败",
      };
    }
  }else{
    return {
      bool: false,
      env: "cookie,缺少字段！",
    };
  }
}