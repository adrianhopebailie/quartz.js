///<reference path="/../Stanchion.Gyrus.Web/Scripts/quartz.js"/>

//Pause R# to allow debugging - Comment out to test fully
//QUnit.moduleDone(function () { });

//Monthly Tests
QUnit.module("quartz - parse cron strings - MONTHLY");

test("Parse the following 0 m h n * * *. Cron triggers at h:m AM/PM on the n(th) day of every month [where 1 < n <= 31].", function () {


    var cronIn = "0 0 0 1 * * *"; //00:00 on the first of the month
    var quartz = new QuartzCronExpression().parse(cronIn);

    equal(quartz.Frequency, "Monthly", "Occurs monthly");
    equal(quartz.MonthlyDay, 1, "on the first day of the month");
    equal(quartz.Time.getHours(), 0, "Hours = 0");
    equal(quartz.Time.getMinutes(), 0, "Minutes = 0");
    
    var cronOut = quartz.toCronString();

    equal(cronIn, cronOut, "toCronString matches original");

});

/*
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