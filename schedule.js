var schedule = require('node-schedule');
var dateFormat = require('dateformat');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var rp = require('request-promise');
var sendEmail = require('./sendEmail');

let rule1 = new schedule.RecurrenceRule();
rule1.minute = [0,10,20,30, 40, 50]; //
rule1.second = 0;

let rule2 = new schedule.RecurrenceRule();
rule2.minute = [0,5,10,15,20,25,30,35,40,45,50,55]; //
rule2.second = 0;

const jobs = {
    alarm: async () => {

        let requestOptions = {
            method: 'GET',
            uri: 'https://api.ethermine.org/miner/d3fbb8a8a84f52A8D3B010344A4dCf38F508B860/currentStats',
        };
        schedule.scheduleJob(rule1, async function () {
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
        schedule.scheduleJob(rule2, async function () {
            rp(requestOptions).then((response) => {
                console.log(response)
                let res = JSON.parse(response)
                let data = res.data;
                data.time = dateFormat(new Date(data.time * 1000), 'yyyy-mm-dd HH:MM:ss');
                data.lastSeen = dateFormat(new Date(data.lastSeen * 1000), 'yyyy-mm-dd HH:MM:ss');
                if (data.reportedHashrate === 0) {
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
