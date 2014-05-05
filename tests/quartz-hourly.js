///<reference path="/../Stanchion.Gyrus.Web/Scripts/quartz.js"/>

//Pause R# to allow debugging - Comment out to test fully
//QUnit.moduleDone(function () { });

//Hourly Tests
QUnit.module("quartz - parse cron strings - HOURLY");

test("Parse the following 0 0 * * * * *. Cron triggers every hour.", function () {
    var cronIn = "0 0 * * * * *";
    var quartz = new QuartzCronExpression().parse(cronIn);

    equal(quartz.Frequency, "Hourly");
    equal(quartz.HourlyInterval, 1);

    var cronOut = quartz.toCronString();

    equal(cronIn, cronOut);

});

test("Parse the following 0 0 0/n * * * *. Cron triggers every n hours every n hours [where n > 1 <= 12].", function () {

    var quartz = new QuartzCronExpression().parse("0 0 0/2 * * * *");

    equal(quartz.Frequency, "Hourly");
    equal(quartz.HourlyInterval, 2);

    var cronIn = "0 0 0/6 * * * *";
    quartz.parse(cronIn);

    equal(quartz.Frequency, "Hourly");
    equal(quartz.HourlyInterval, 6);

    var cronOut = quartz.toCronString();

    equal(cronIn, cronOut);

});