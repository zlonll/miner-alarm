var schedule = require('node-schedule');
var dateFormat = require('dateformat');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var rp = require('request-promise');
var https = require('https')
var sendEmail = require('./sendEmail')
const jobs = {
    alarm: async () => {

        let requestOptions = {
            method: 'GET',
            uri: 'https://api.ethermine.org/miner/d3fbb8a8a84f52A8D3B010344A4dCf38F508B860/currentStats',
        };
        schedule.scheduleJob('* /10/20/30/40/50/00 * * * *', async function () {
            rp(requestOptions).then((response) => {
                console.log(response)
                let res = JSON.parse(response)
                console.log(res.data)
                let data = res.data;
                data.time = dateFormat(new Date(data.time * 1000), 'yyyy-mm-dd HH:MM:ss');
                data.lastSeen = dateFormat(new Date(data.lastSeen * 1000), 'yyyy-mm-dd HH:MM:ss');
                data.reportedHashrate = (data.reportedHashrate / 1000000).toFixed(2);
                data.currentHashrate = (data.currentHashrate / 1000000).toFixed(2);
                data.averageHashrate = (data.averageHashrate / 1000000).toFixed(2);
                data.unpaid = (data.unpaid / 1000000000000000000).toFixed(7);
                data.coinsPerMin = (data.coinsPerMin * 60 * 24);
                data.usdPerMin = (data.coinsPerMin * 60 * 24);
                data.btcPerMin = (data.staleShares / data.validShares * 100).toFixed(2)
                console.log(data)
                sendEmail.miner_message(res.status, data, (err) => {
                    console.log(err)
                })
            }).catch((err) => {
                console.log(err)
            })
        })
        schedule.scheduleJob('* /5/10/15/20/25/30/35/40/45/55/00 * * * *', async function () {
            rp(requestOptions).then((response) => {
                console.log(response)
                let res = JSON.parse(response)
                let data = res.data;
                data.time = dateFormat(new Date(data.time * 1000), 'yyyy-mm-dd HH:MM:ss');
                data.lastSeen = dateFormat(new Date(data.lastSeen * 1000), 'yyyy-mm-dd HH:MM:ss');
                if (res.status !== 'OK') {
                    sendEmail.miner_warning(data, (err) => {
                        console.log(err)
                    })
                }
            }).catch((err) => {
                console.log(err)
            })
        })
    }
};

const scheduleJob = {
    run: function () {
        jobs.alarm();
    },

}

module.exports = scheduleJob
