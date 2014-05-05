///<reference path="/../Stanchion.Gyrus.Web/Scripts/quartz.js"/>

//Pause R# to allow debugging - Comment out to test fully
//QUnit.moduleDone(function () { });

var cronStrings = {
    "0 0 9 ? * 1 *": "at 09:00:00 AM on Sundays",
    "0 0 * * * * *": "every hour",
    "0 * * * * 2,3,4,5,6 *": "every minute on Mondays, Tuesdays, Wednesdays, Thursdays and Fridays",
    "0 * * * * 4 *": "every minute on Wednesdays",
    "0 * * L * ? *": "every minute on the last day of every month",
    "0 * * LW * ? *": "every minute on the last weekday of every month",
    "0 * * ? * 1#2 *": "every minute on the 2nd Sunday of every month",
}
QUnit.module("quartz - render pretty strings");
test("Convert all cron strings to pretty strings", function () {
    
    for (var cronString in cronStrings) {
        equal(
            QuartzCronExpression.toPrettyString(cronString),
            cronStrings[cronString],
            "Testing: " + cronString
        );
    }

});
