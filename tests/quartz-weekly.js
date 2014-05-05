///<reference path="/../Stanchion.Gyrus.Web/Scripts/quartz.js"/>

//Pause R# to allow debugging - Comment out to test fully
//QUnit.moduleDone(function () { });

//Weekly Tests
QUnit.module("quartz - parse cron strings - WEEKLY");

test("Parse the following 0 m h ? * dow [ .. , dow ] *. Cron triggers at h:m on dow [where 1 (Sunday) <= dow <= 7 (Saturday), and dow.length > 0].", function () {


    var cronIn = "0 0 9 ? * 1 *"; //9:00 AM on Sundays
    var quartz = new QuartzCronExpression().parse(cronIn);

    equal(quartz.Frequency, "Weekly");
    equal(quartz.Time.getHours(), 9);
    equal(quartz.Time.getMinutes(), 0);
    equal(quartz.WeeklyIsSundays, true, "WeeklyIsSundays = TRUE");
    equal(quartz.WeeklyIsMondays, false);
    equal(quartz.WeeklyIsTuesdays, false);
    equal(quartz.WeeklyIsWednesdays, false);
    equal(quartz.WeeklyIsThursdays, false);
    equal(quartz.WeeklyIsFridays, false);
    equal(quartz.WeeklyIsSaturdays, false);

    var cronOut = quartz.toCronString();

    equal(cronIn, cronOut);

});

test("Parse the following 0 m h ? * dow [ .. , dow ] *. Cron triggers at h:m on dow [where 1 (Sunday) <= dow <= 7 (Saturday), and dow.length > 0].", function () {

    var cronIn = "0 13 14 ? * 2,3,4,5,6 *"; //Weekdays at 14:13.
    var quartz = new QuartzCronExpression().parse(cronIn);

    equal(quartz.Frequency, "Weekly");
    equal(quartz.Time.getHours(), 14);
    equal(quartz.Time.getMinutes(), 13);
    equal(quartz.WeeklyIsSundays, false);
    equal(quartz.WeeklyIsMondays, true);
    equal(quartz.WeeklyIsTuesdays, true);
    equal(quartz.WeeklyIsWednesdays, true);
    equal(quartz.WeeklyIsThursdays, true);
    equal(quartz.WeeklyIsFridays, true);
    equal(quartz.WeeklyIsSaturdays, false);

    var cronOut = quartz.toCronString();

    equal(cronIn, cronOut);

});
