///<reference path="/../Stanchion.Gyrus.Web/Scripts/quartz.js"/>

//Pause R# to allow debugging - Comment out to test fully
//QUnit.moduleDone(function () { });

QUnit.module("quartz - constructors");
test("Construct with no arguments then parse cron.", function () {
    var quartz = new QuartzCronExpression();
    quartz.parse("0 0 0 * * * *");
    ok(quartz.Time, "Constructed and parsed.");
});

test("Construct with argument.", function () {
    var quartz = new QuartzCronExpression("0 0 0 * * * *");
    ok(quartz.Time, "Constructed and parsed.");
});
