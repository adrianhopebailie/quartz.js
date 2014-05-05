///<reference path="/../Stanchion.Gyrus.Web/Scripts/quartz.js"/>

//Pause R# to allow debugging - Comment out to test fully
//QUnit.moduleDone(function () { });

//Daily Tests
QUnit.module("quartz - parse cron strings - DAILY");

test("Parse the following 0 m h * * * *. Cron triggers every day at h:m.", function () {

    var cronIn = "0 12 19 * * * *";
    var quartz = new QuartzCronExpression().parse(cronIn);

    equal(quartz.Frequency, "Daily");
    equal(quartz.DailyInterval, 1);
    equal(quartz.Time.getHours(), 19);
    equal(quartz.Time.getMinutes(), 12);

    var cronOut = quartz.toCronString();

    equal(cronIn, cronOut);
});

test("Parse the following 0 m h 0/n * * *. Cron triggers every n days at h:m [where n > 1 <= 15].", function () {

    var quartz = new QuartzCronExpression().parse("0 13 14 0/2 * * *");

    equal(quartz.Frequency, "Daily");
    equal(quartz.DailyInterval, 2);
    equal(quartz.Time.getHours(), 14);
    equal(quartz.Time.getMinutes(), 13);

    var cronIn = "0 14 15 0/5 * * *";
    quartz.parse(cronIn);

    equal(quartz.Frequency, "Daily");
    equal(quartz.DailyInterval, 5);
    equal(quartz.Time.getHours(), 15);
    equal(quartz.Time.getMinutes(), 14);

    var cronOut = quartz.toCronString();

    equal(cronIn, cronOut);

});

test("Parse the following 0 m h W * ? *. Cron triggers every weekday at h:m.", function () {

    var cronIn = "0 0 23 W * ? *";
    var quartz = new QuartzCronExpression().parse(cronIn);

    equal(quartz.Frequency, "Daily");
    equal(quartz.DailyLiteralOccurrence, 'Literal');
    equal(quartz.Time.getHours(), 23);
    equal(quartz.Time.getMinutes(), 0);

    var cronOut = quartz.toCronString();

    equal(cronIn, cronOut);
});

/*
WEEKLY
0 m h ? * dow [ .. , dow ] *
At h:m AM/PM on dow [ .. , dow ] [where 1 (Sunday) <= dow <= 7 (Saturday), and dow.length > 0]

MONTHLY
0 m h n * * *
At h:m AM/PM on the n(th) day of every month [where 1 < n <= 31]

0 m h n * 0/k *
At h:m AM/PM on the n(th) day of every k(th) month [where 1 < n <= 31, and 1 <= k <= 6]

0 m h L * * *
At h:m AM/PM on the last day of every month [where 1 < n <= 31]

0 m h L * 0/k *
At h:m AM/PM on the last day of every k(th) month [where 1 < n <= 31, and 1 <= k <= 6]

0 m h * * dow#n *
At h:m AM/PM on the n(th) dow of every month [where 1 < n <= 4, and 1 (Sunday) <= dow <= 7 (Saturday)]

0 m h * * W#n *
At h:m AM/PM on the n(th) weekday of every month [where 1 < n <= 4]

0 m h * * dowL *
At h:m AM/PM on the last dow of every month [where 1 < n <= 4], and 1 (Sunday) <= dow <= 7 (Saturday)]

0 m h LW * ? *
At h:m AM/PM on the last weekday of every month

0 m h LW * 0/k *
At h:m AM/PM on the last weekday of every k(th) month [1 <= k <= 6]
*/