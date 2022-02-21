var nodemailer = require("nodemailer");

var smtp = "smtp.qq.com";

function miner_message(status, data, callback) {
    var transporter = nodemailer.createTransport({
        host: smtp,
        auth: {
            user: "4683203@qq.com",
            pass: 'nibdvrkgdeajbhge' //授权码,通过QQ获取

        }
    });

    let stat = status === 'OK' ? `<span style="color:green;">ONLINE</span>` : `<span style="color:red;">OUTLINE</span>`


    var mailOptions = {
        from: '4683203@qq.com', // 发送者
        to: 'zion18095610369@icloud.com', // 接受者,可以同时发送多个,以逗号隔开
        subject: `miner message`, // 标题
        html: `
矿机状态：` + stat + `
<p style="color: chocolate">上报算力：${data.reportedHashrate}</p>
<p style="color: magenta">当前算力：${data.currentHashrate}</p>
<p style="color: crimson">平均算力：${data.averageHashrate}</p>
<p style="color: burlywood">陈旧占比：${data.btcPerMin}%</p>
<p style="color: green">有效股份：${data.validShares}</p>
<p style="color: red">无效股份：${data.invalidShares}</p>
<p style="color: cornflowerblue">陈旧股份：${data.staleShares}</p>
<p>活跃工人：${data.activeWorkers}</p>
<p style="color: darkgreen">未付ETH：${data.unpaid}</p>
<p style="color: darkmagenta">预估每日ETH收益：${data.coinsPerMin}</p>
<p style="color: darkmagenta">预估每日USD收益：${data.usdPerMin}</p>
<p>最后登陆时间：${data.lastSeen}</p>
`
    };
    var result = {
        httpCode: 200,
        message: '发送成功!',
    }
    try {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                result.httpCode = 500;
                result.message = err;
                callback(result);
                return;
            }
            callback(result);
        });
    } catch (err) {
        result.httpCode = 500;
        result.message = err;
        callback(result);
    }
}

function miner_warning(data, callback) {
    var transporter = nodemailer.createTransport({
        host: smtp,
        auth: {
            user: "951093847@qq.com",
            pass: 'yisdtzespqbkbbfd' //授权码,通过QQ获取

        }
    });
    var mailOptions = {
        from: '951093847@qq.com', // 发送者
        to: 'zion18095610369@icloud.com', // 接受者,可以同时发送多个,以逗号隔开
        subject: `miner warning`, // 标题
        html: `矿机状态：<span style="color:red;">OUTLINE</span>
<p style="color: chocolate">上报算力：${data.reportedHashrate}</p>
<p style="color: magenta">当前算力：${data.currentHashrate}</p>
<p style="color: crimson">平均算力：${data.averageHashrate}</p>
<p style="color: burlywood">陈旧占比：${data.btcPerMin}%</p>
<p>最后登陆时间：${data.lastSeen}</p>`
    };
    var result = {
        httpCode: 200,
        message: '发送成功!',
    }
    try {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                result.httpCode = 500;
                result.message = err;
                callback(result);
                return;
            }
            callback(result);
        });
    } catch (err) {
        result.httpCode = 500;
        result.message = err;
        callback(result);
    }
}

module.exports.miner_message = miner_message
module.exports.miner_warning = miner_warning