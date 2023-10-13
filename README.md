# meituan
 美团相关

### 一.文件夹说明

mt文件夹为脚本相关，包括检测ck、更新ck、美团算法、随机UA、神券配置等。

ckapi为部署在服务器上的处理cdk、美团ck的程序，用于执行宝哥的抢券软件以及CDK管理。

### 二、使用说明

#### 1.本地使用

注意：电脑需安装nodejs

下载mt文件夹即可，以meituan开头的为抢券脚本。

修改checkMeiTuanCk.js文件的39行：

```js
let ck=process.env[ckname] || "";
```

改为：

```js
let ck=process.env[ckname] || "你的ck";
```

修改抢券脚本中倒数第四行：

```js
ck = process.env["mt_sq25_12_11"] || "";
```

改为：

```js
ck = process.env["mt_sq25_12_11"] || "你的ck";
```

即添加ck。

添加好以后，使用cmd(按住win+r键输入cmd回车)、或者终端运行命令：

```
node D:\nodejs\mt\meituan25_12_11.js
```

node后为脚本完整路径。

示例:![](https://i.mji.rip/2023/10/13/e37a60916e1eb3dfcdcb311a7c72f9e8.png)

默认运行次数为30，若想修改次数，修改脚本中第6行的30。

```
let qqTimes = process.env["qqTimes"] || 30;
```

30改过要请求的次数。
