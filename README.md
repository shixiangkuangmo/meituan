# ~声明：该项目目前采用美团算法1.1，目前APP已经更新到算法mtgsig2.4，故项目无法使用，请勿下载！待算法更新！~
# app端采用算法2.4，目前H5端仍是算法1.1，脚本待优化！


### ck说明
确保ck中包含userId、token、WEBDFPID字段存在


### 未来计划
#### 1.增加抢券结果自助查询（未完成），预计完成时间：2023-10-13
#### 2.增加cdk使用情况查询（未完成），预计完成时间：2023-10-14

### 提醒
#### 1.若出现403错误，请调整运行次数(qqTimes)以及抢券时间，避免请求次数过多导致403
# 脚本介绍
### mt抢券相关



<font color=red>下载说明：如果你懂一点nodejs，则不需要下载node_modules文件夹，下载后，在程序目录下执行 npm install 即可</font>

##### 特别说明，mt文件夹下的meituan25_12_11.js为增加了HTTP代理请求版，防止访问过多导致403，未做详细测试，自行研究。


### 一.文件夹说明

mt文件夹为脚本相关，包括检测ck、更新ck、美团算法、随机UA、神券配置等。

以meituan开头的为抢券脚本，以meituan25_12_11.js为例：

这个脚本代表11点的25-12：故青龙运行此脚本时，定时应设置为：40 59 10 * * *

需要提前20秒，因为脚本初始化需要一定时间，会在开始前一秒发送请求，间隔时间为100毫秒。



ckapi为部署在服务器上的处理cdk、美团ck的程序，用于执行宝哥的抢券软件以及CDK管理。

### 二、使用说明

#### 环境变量用#号分割

#### 1.本地使用青龙版。

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

示例:![](https://i.miji.bid/2023/12/26/33d84ca4b13d7142406623b2424fc35d.png)

默认运行次数为30，若想修改次数，修改脚本中第6行的30。

```
let qqTimes = process.env["qqTimes"] || 30;
```

30改成要请求的次数。

#### 2.本地使用宝哥版。

直接看里边的说明即可。自行添加用户信息和配置。

#### 3.青龙使用

将mt文件夹中所有js、json文件上传到青龙脚本。

自行查看脚本里的ck变量名称：

![](https://i.mji.rip/2023/10/13/5d183cd5f8661e5ab7e039dab53335b5.png)



若要修改次数，修改脚本默认值或者青龙新建环境变量，名称：qqTimes，值为具体次数，比如：10。

并添加对应的ck环境变量和值，若通过青龙Tools提交则不用提交。

然后创建任务，以meituan25_12_11.js为例：

![](https://i.mji.rip/2023/10/13/82fba3f9680e28be6a7f78e040986fca.png)



定时规则：券时间前20秒，比如这个券11点开始，那么格式为：40 59 10 * * *

若需要检测ck，则创建检测ck任务：

![](https://i.mji.rip/2023/10/13/c885a76808801eeee10ad6bcc892d310.png)

此为开始前10分钟检测整点券的ck。

#### 4.宝哥青龙Tools提交版

将压缩包中文件放在 服务器/root/ql/data/mt/目录下。

重点在于使用插件，即ckapi中的writeck.js文件。

青龙Tools中请为变量绑定次插件即可。

并在服务器上运行，命令：

```
cd /root/ql/data/mt/MeiTuan

./MeiTuan-linux-amd64 2>&1 &

```

若需要检测ck，则青龙创建命令：

![](https://i.mji.rip/2023/10/13/9e139b9cab5a9d6fcb4f96ec3ffc97da.png)



#### 5.cdk管理、ck校验程序使用方法

宝塔创建nodejs项目即可，自行百度。

接口：

ip:端口/cdk，获取cdk

ip:端口/writeck，获取用户名并将ck、用户名写入到宝哥配置文件中。



将青龙Tools获取到的CDK.txt文件放到ckapi目录下，并执行： 

```
node readCdk.js
```

即可将cdk写入cdk.json文件中，以供用户获取!
