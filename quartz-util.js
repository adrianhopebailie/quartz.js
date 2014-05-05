function QuartzCronExpression(cronString) {

    if (cronString)
        QuartzCronExpression.parse(cronString, this);
}

QuartzCronExpression.prototype =
{
    Frequency: 'Daily',
    Time: new Date(1900, 0, 1, 8, 0, 0),
    HourlyInterval: 1,
    DailyLiteralOccurrence: 'Occurrence',
    DailyInterval: 1,
    WeeklyIsSundays: false,
    WeeklyIsMondays: false,
    WeeklyIsTuesdays: false,
    WeeklyIsWednesdays: false,
    WeeklyIsThursdays: false,
    WeeklyIsFridays: false,
    WeeklyIsSaturdays: false,
    MonthlyLiteralOccurrence: 'Literal',
    MonthlyDay: 1,
    MonthlyMonthInterval: 1,
    MonthlyOffset: '1',
    MonthlyWeekday: '?',

    Frequencies: function () { return ['Hourly', 'Daily', 'Weekly', 'Monthly']; }
}

QuartzCronExpression.prototype.parse = function (cronString, expr) {

    expr = (expr) ? expr : this;

    if (cronString) {
        var elementExpr = cronString.split(" ");
        var secondsExpr = elementExpr[0];
        var minutesExpr = elementExpr[1];
        var hoursExpr = elementExpr[2];
        var dayOfMonthExpr = elementExpr[3];
        var monthExpr = elementExpr[4];
        var dayOfWeekExpr = elementExpr[5];
        var yearExpr = elementExpr.length == 7 ? elementExpr[6] : null;

        if (secondsExpr != "*" &&
            secondsExpr.indexOf("/") == -1 &&
            secondsExpr.indexOf(",") == -1 &&
            secondsExpr.indexOf("-") == -1 &&

            minutesExpr != "*" &&
            minutesExpr.indexOf("/") == -1 &&
            minutesExpr.indexOf(",") == -1 &&
            minutesExpr.indexOf("-") == -1) {
            if ((dayOfMonthExpr != "*" &&
                    dayOfMonthExpr != "?" &&
                    dayOfMonthExpr.indexOf("/") == -1 &&
                    dayOfMonthExpr != "W") ||
                dayOfWeekExpr.indexOf("#") != -1 ||
                dayOfWeekExpr.indexOf("L") > 0) {
                expr.Frequency = 'Monthly';
                expr.Time = new Date(1900, 0, 1, hoursExpr, minutesExpr, secondsExpr);

                if (dayOfMonthExpr.indexOf("LW") == 0) {
                    expr.MonthlyLiteralOccurrence = "Occurrence";
                    expr.MonthlyOffset = 'L';
                    expr.MonthlyWeekday = 'W';
                } else if (dayOfMonthExpr.indexOf("L") == 0) {
                    expr.MonthlyLiteralOccurrence = "Occurrence";
                    expr.MonthlyOffset = 'L';
                    expr.MonthlyWeekday = '';
                } else if (dayOfWeekExpr.indexOf("#") != -1) {
                    var dayOfWeekElementsExpr = dayOfWeekExpr.split("#");
                    expr.MonthlyLiteralOccurrence = "Occurrence";
                    expr.MonthlyOffset = dayOfWeekElementsExpr[1];
                    expr.MonthlyWeekday = dayOfWeekElementsExpr[0];
                } else if (dayOfWeekExpr.indexOf("L") > 0) {
                    dayOfWeekElementsExpr = dayOfWeekExpr.split("L");
                    expr.MonthlyLiteralOccurrence = "Occurrence";
                    expr.MonthlyOffset = "L";
                    expr.MonthlyWeekday = dayOfWeekElementsExpr[0];
                } else {
                    expr.MonthlyLiteralOccurrence = "Literal";
                    expr.MonthlyDay = parseInt(dayOfMonthExpr);
                    expr.MonthlyOffset = 1;
                    expr.MonthlyWeekday = '?';
                }

                if (monthExpr.indexOf("/") != -1) {
                    var monthElementsExpr = monthExpr.split("/");
                    expr.MonthlyMonthInterval = parseInt(monthElementsExpr[1]);
                } else {
                    expr.MonthlyMonthInterval = 1;
                }

            } else if (dayOfWeekExpr != "*" && dayOfWeekExpr != "?") {
                expr.Frequency = "Weekly";
                expr.Time = new Date(1900, 0, 1, hoursExpr, minutesExpr, secondsExpr);
                expr.WeeklyIsSundays = dayOfWeekExpr.indexOf("1") != -1;
                expr.WeeklyIsMondays = dayOfWeekExpr.indexOf("2") != -1;
                expr.WeeklyIsTuesdays = dayOfWeekExpr.indexOf("3") != -1;
                expr.WeeklyIsWednesdays = dayOfWeekExpr.indexOf("4") != -1;
                expr.WeeklyIsThursdays = dayOfWeekExpr.indexOf("5") != -1;
                expr.WeeklyIsFridays = dayOfWeekExpr.indexOf("6") != -1;
                expr.WeeklyIsSaturdays = dayOfWeekExpr.indexOf("7") != -1;

            } else if (((dayOfMonthExpr == "*" ||
                            dayOfMonthExpr == "?" ||
                            dayOfMonthExpr == "W") &&
                        hoursExpr != "*" &&
                        hoursExpr.indexOf("/") == -1) ||
                    dayOfMonthExpr.indexOf("/") != -1) {

                expr.Frequency = "Daily";
                expr.Time = new Date(1900, 0, 1, hoursExpr, minutesExpr, secondsExpr);

                if (dayOfMonthExpr == "W") {
                    expr.DailyLiteralOccurrence = "Literal";
                } else {
                    expr.DailyLiteralOccurrence = "Occurrence";

                    if (dayOfMonthExpr != "*" && dayOfMonthExpr != "?") {
                        var dayOfMonthElementsExpr = dayOfMonthExpr.split('/');
                        expr.DailyInterval = parseInt(dayOfMonthElementsExpr[1]);
                    } else {
                        expr.DailyInterval = 1;
                    }
                }
            } else {
                expr.Frequency = "Hourly";

                if (hoursExpr.indexOf("/") != -1) {
                    var hoursElementsExpr = hoursExpr.split("/");
                    expr.HourlyInterval = parseInt(hoursElementsExpr[1]);
                } else {
                    expr.HourlyInterval = 1;
                }
            }

        }
    }

    return expr;
}
QuartzCronExpression.parse = QuartzCronExpression.prototype.parse;

QuartzCronExpression.prototype.toCronString = function (obj) {

    obj = (obj) ? obj : this;

    var expr = ['*', '*', '*', '*', '*', '*', '*'];

    switch (obj.Frequency) {
        case "Hourly":
            {
                expr[0] = '0';
                expr[1] = '0';
                if (obj.HourlyInterval != 1) {
                    expr[2] = "0/" + obj.HourlyInterval;
                }
            }

            break;

        case "Daily":
            {
                expr[0] = '0';
                expr[1] = obj.Time.getMinutes().toString();
                expr[2] = obj.Time.getHours().toString();

                if (obj.DailyLiteralOccurrence == "Occurrence") {
                    if (obj.DailyInterval != 1) {
                        expr[3] = "0/" + obj.DailyInterval;
                    }
                } else if (obj.DailyLiteralOccurrence == "Literal") {
                    expr[3] = 'W';
                    expr[5] = '?';
                }

            }
            break;

        case "Weekly":
            {
                expr[0] = '0';
                expr[1] = obj.Time.getMinutes().toString();
                expr[2] = obj.Time.getHours().toString();
                expr[3] = '?';

                var dayOfWeekExpr = "";

                if (obj.WeeklyIsSundays) {
                    dayOfWeekExpr += "1";
                }

                if (obj.WeeklyIsMondays) {
                    if (dayOfWeekExpr.length != 0) {
                        dayOfWeekExpr += ",";
                    }

                    dayOfWeekExpr += "2";
                }

                if (obj.WeeklyIsTuesdays) {
                    if (dayOfWeekExpr.length != 0) {
                        dayOfWeekExpr += ",";
                    }

                    dayOfWeekExpr += "3";
                }

                if (obj.WeeklyIsWednesdays) {
                    if (dayOfWeekExpr.length != 0) {
                        dayOfWeekExpr += ",";
                    }

                    dayOfWeekExpr += "4";
                }

                if (obj.WeeklyIsThursdays) {
                    if (dayOfWeekExpr.length != 0) {
                        dayOfWeekExpr += ",";
                    }

                    dayOfWeekExpr += "5";
                }

                if (obj.WeeklyIsFridays) {
                    if (dayOfWeekExpr.length != 0) {
                        dayOfWeekExpr += ",";
                    }

                    dayOfWeekExpr += "6";
                }

                if (obj.WeeklyIsSaturdays) {
                    if (dayOfWeekExpr.length != 0) {
                        dayOfWeekExpr += ",";
                    }

                    dayOfWeekExpr += "7";
                }

                expr[5] = dayOfWeekExpr;

            }
            break;

        case "Monthly":
            {
                expr[0] = '0';
                expr[1] = obj.Time.getMinutes().toString();
                expr[2] = obj.Time.getHours().toString();

                //Monthly interval
                if (obj.MonthlyMonthInterval != 1) {
                    expr[4] = " 0/" + obj.MonthlyMonthInterval;
                }

                if (obj.MonthlyLiteralOccurrence == "Literal") {

                    expr[3] = obj.MonthlyDay.toString();

                } else if (obj.MonthlyLiteralOccurrence == "Occurrence") {
                    if (obj.MonthlyOffset == "L") {

                        if (obj.MonthlyMonthInterval != 1) {
                            expr[4] = " 0/" + obj.MonthlyMonthInterval;
                        }

                        if (obj.MonthlyWeekday == "?") {

                            expr[3] = 'L';
                            expr[5] = '?';

                        } else if (obj.MonthlyWeekday == "W") {

                            expr[3] = 'LW';
                            expr[5] = '?';

                        } else {

                            expr[3] = '?';
                            expr[5] = obj.MonthlyWeekday + "L";

                        }

                    } else if (obj.MonthlyWeekday != "?") {

                        expr[3] = '?';
                        expr[5] = obj.MonthlyWeekday + "#" + obj.MonthlyOffset;

                    } else {

                        expr[3] = obj.MonthlyOffset.toString();
                        expr[5] = '?';

                    }
                }
                break;
            }

    }

    return expr.join(' ');
}
QuartzCronExpression.toCronString = QuartzCronExpression.prototype.toCronString;

QuartzCronExpression.prototype.toPrettyString = function(obj) {

    obj = (obj) ? obj : this;

    var cronString = (typeof obj === "string") ? obj : obj.toCronString();

    var dateFormatRegExp = /dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|HH|H|hh|h|mm|m|fff|ff|f|tt|ss|s|"[^"]*"|'[^']*'/g;
    var calendar = {
        days: {
            names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            namesShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
        },
        months: {
            names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
            namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""]
        },
        AM: ["AM", "am", "AM"],
        PM: ["PM", "pm", "PM"],
        patterns: {
            d: "yyyy/MM/dd",
            D: "dd MMMM yyyy",
            F: "dd MMMM yyyy hh:mm:ss tt",
            g: "yyyy/MM/dd hh:mm tt",
            G: "yyyy/MM/dd hh:mm:ss tt",
            m: "dd MMMM",
            M: "dd MMMM",
            s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
            t: "hh:mm tt",
            T: "hh:mm:ss tt",
            u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
            y: "MMMM yyyy",
            Y: "MMMM yyyy"
        },
        "/": "/",
        ":": ":",
        firstDay: 0
    }

    return cronExpressionToString(cronString);

    function pad(number, digits, end) {

        var zeros = ["", "0", "00", "000", "0000"];
        number = number + "";
        digits = digits || 2;
        end = digits - number.length;

        if (end) {
            return zeros[digits].substring(0, end) + number;
        }

        return number;
    }

    function formatDate(date, format) {


        return format.replace(dateFormatRegExp, function (match) {
            var result;

            if (match === "d") {
                result = date.getDate();
            } else if (match === "dd") {
                result = pad(date.getDate());
            } else if (match === "ddd") {
                result = calendar.days.namesAbbr[date.getDay()];
            } else if (match === "dddd") {
                result = calendar.days.names[date.getDay()];
            } else if (match === "M") {
                result = date.getMonth() + 1;
            } else if (match === "MM") {
                result = pad(date.getMonth() + 1);
            } else if (match === "MMM") {
                result = calendar.months.namesAbbr[date.getMonth()];
            } else if (match === "MMMM") {
                result = calendar.months.names[date.getMonth()];
            } else if (match === "yy") {
                result = pad(date.getFullYear() % 100);
            } else if (match === "yyyy") {
                result = pad(date.getFullYear(), 4);
            } else if (match === "h") {
                result = date.getHours() % 12 || 12;
            } else if (match === "hh") {
                result = pad(date.getHours() % 12 || 12);
            } else if (match === "H") {
                result = date.getHours();
            } else if (match === "HH") {
                result = pad(date.getHours());
            } else if (match === "m") {
                result = date.getMinutes();
            } else if (match === "mm") {
                result = pad(date.getMinutes());
            } else if (match === "s") {
                result = date.getSeconds();
            } else if (match === "ss") {
                result = pad(date.getSeconds());
            } else if (match === "f") {
                result = Math.floor(date.getMilliseconds() / 100);
            } else if (match === "ff") {
                result = date.getMilliseconds();
                if (result > 99) {
                    result = Math.floor(result / 10);
                }
                result = pad(result);
            } else if (match === "fff") {
                result = pad(date.getMilliseconds(), 3);
            } else if (match === "tt") {
                result = date.getHours() < 12 ? calendar.AM[0] : calendar.PM[0];
            }

            return result !== undefined ? result : match.slice(1, match.length - 1);
        });
    }

    function cronExpressionToString(expr) {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var weekdayNamesPlural = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];

        var elementExpr = expr.split(" ");

        if (elementExpr.length < 6 || elementExpr.length > 7) {
            return "error";
        }

        var secondsExpr = elementExpr[0];
        var minutesExpr = elementExpr[1];
        var hoursExpr = elementExpr[2];
        var dayOfMonthExpr = elementExpr[3];
        var monthExpr = elementExpr[4];
        var dayOfWeekExpr = elementExpr[5];
        var yearExpr = elementExpr.length == 7 ? elementExpr[6] : null;

        var timeStr = "";

        var allowMinutes = true;
        var allowHours = true;

        var requireMinutes = true;
        var requireHours = true;
        var requireDayOfMonth = true;
        var requireMonth = true;
        var requireDayOfWeek = true;
        var requireYear = true;

        if (secondsExpr != "*" && secondsExpr.indexOf("/") == -1 && secondsExpr.indexOf(",") == -1 && secondsExpr.indexOf("-") == -1 &&
            minutesExpr != "*" && minutesExpr.indexOf("/") == -1 && minutesExpr.indexOf(",") == -1 && minutesExpr.indexOf("-") == -1 &&
            hoursExpr != "*" && hoursExpr.indexOf("/") == -1 && hoursExpr.indexOf(",") == -1 && hoursExpr.indexOf("-") == -1) {
            timeStr += "at " + formatDate(new Date(1900, 1, 1, parseInt(hoursExpr), parseInt(minutesExpr), parseInt(secondsExpr)), "HH:mm:ss tt");

            allowMinutes =
                allowHours = false;
        }
        else {
            if (secondsExpr == "*" || secondsExpr == "0/1" || secondsExpr == "*/1") {
                timeStr += "every second";

                requireMinutes =
                    requireHours =
                    requireDayOfMonth =
                    requireMonth =
                    requireDayOfWeek =
                    requireYear = false;
            }
            else if (secondsExpr.indexOf("/") != -1) {
                var secondsElementExpr = secondsExpr.split("/");
                var secondsSeed = secondsElementExpr[0] == "*" ? 0 : parseInt(secondsElementExpr[0]);
                var secondsIncrement = parseInt(secondsElementExpr[1]);

                timeStr += "every " + (secondsIncrement == "1" ? "second" : (secondsIncrement + " seconds"));

                if (secondsSeed != "0" && secondsSeed != "*") {
                    timeStr += " starting on the " + secondsSeed + nth(secondsSeed) + " second";
                    requireMinutes = true;
                }
                else {
                    requireMinutes =
                        requireHours =
                        requireDayOfMonth =
                        requireMonth =
                        requireDayOfWeek =
                        requireYear = false;
                }
            }
            else if (secondsExpr.indexOf(",") != -1) {
                var seconds = secondsExpr.split(",");

                if (timeStr != "") {
                    timeStr += " ";
                }

                timeStr += "at the ";

                for (var j = 0; j < seconds.length; j++) {
                    if (j > 0) {
                        if (j == seconds.length - 1) {
                            timeStr += " and ";
                        }
                        else {
                            timeStr += ", ";
                        }
                    }

                    timeStr += (parseInt(seconds[j]) + 1) + nth(parseInt(seconds[j]) + 1);
                }

                timeStr += " second";
                requireMinutes = true;
            }
            else if (secondsExpr.indexOf("-") != -1) {
                seconds = secondsExpr.split("-");

                if (seconds[0] == "0") {
                    timeStr += "every second until the " + (parseInt(seconds[1]) + 1) + nth(parseInt(seconds[1]) + 1) + " second";
                }
                else {
                    timeStr += "every second between the " + (parseInt(seconds[0]) + 1) + nth(parseInt(seconds[0]) + 1) + " and " + (parseInt(seconds[1]) + 1) + nth(parseInt(seconds[1]) + 1) + " second";
                }

                requireMinutes = true;
            }
            else {
                if (minutesExpr != "*" && minutesExpr.indexOf("/") == -1 && minutesExpr.indexOf(",") == -1 && minutesExpr.indexOf("-") == -1 &&
                    hoursExpr != "*" && hoursExpr.indexOf("/") == -1 && hoursExpr.indexOf(",") == -1 && hoursExpr.indexOf("-") == -1) {
                    timeStr += "at " + formatDate(new Date(1900, 1, 1, hoursExpr, minutesExpr, secondsExpr), "HH:mm:ss tt");
                    allowMinutes = false;
                    allowHours = false;
                }
                else if (secondsExpr != "0") {
                    timeStr += "after the " + parseInt(secondsExpr) + nth(parseInt(secondsExpr)) + " second";
                    requireMinutes = true;
                }
            }

            if (allowMinutes) {
                if (minutesExpr == "*" || minutesExpr == "0/1" || minutesExpr == "*/1") {
                    if (requireMinutes) {
                        if (timeStr != "") {
                            timeStr += " of ";
                        }

                        timeStr += "every minute";

                        requireHours =
                            requireDayOfMonth =
                            requireMonth =
                            requireDayOfWeek =
                            requireYear = false;
                    }
                }
                else if (minutesExpr.indexOf("/") != -1) {
                    if (timeStr != "") {
                        timeStr += " of ";
                    }

                    var minutesElementExpr = minutesExpr.split("/");
                    var minutesSeed = minutesExpr[0] == "*" ? 0 : parseInt(minutesExpr[0]);
                    var minutesIncrement = parseInt(minutesElementExpr[1]);

                    timeStr += "every " + (minutesIncrement == "1" ? "minute" : (minutesIncrement + " minutes"));

                    if (minutesSeed != "0" && minutesSeed != "*") {
                        timeStr += " starting on the " + minutesSeed + nth(minutesSeed) + " minute";
                        requireHours = true;
                    }
                    else {
                        requireHours =
                            requireDayOfMonth =
                            requireMonth =
                            requireDayOfWeek =
                            requireYear = false;
                    }
                }
                else if (minutesExpr.indexOf(",") != -1) {
                    var minutes = minutesExpr.split(",");

                    if (timeStr != "") {
                        timeStr += " ";
                    }

                    timeStr += "in the ";

                    for (var j = 0; j < minutes.length; j++) {
                        if (j > 0) {
                            if (j == minutes.length - 1) {
                                timeStr += " and ";
                            }
                            else {
                                timeStr += ", ";
                            }
                        }

                        timeStr += (parseInt(minutes[j]) + 1) + nth(parseInt(minutes[j]) + 1);
                    }

                    timeStr += " minute";
                    requireHours = true;
                }
                else if (minutesExpr.indexOf("-") != -1) {
                    if (timeStr != "") {
                        timeStr += " of ";
                    }

                    minutes = minutesExpr.split("-");

                    if (minutes[0] == "0") {
                        timeStr += "every minute until the " + (parseInt(minutes[1]) + 1) + nth(parseInt(minutes[1]) + 1) + " minute";
                    }
                    else {
                        timeStr += "every minute between the " + (parseInt(minutes[0]) + 1) + nth(parseInt(minutes[0]) + 1) + " and " + (parseInt(minutes[1]) + 1) + nth(parseInt(minutes[1]) + 1) + " minute";
                    }

                    requireHours = true;
                }
                else {
                    if (hoursExpr != "*" && hoursExpr.indexOf("/") == -1 && hoursExpr.indexOf(",") == -1 && hoursExpr.indexOf("-") == -1) {
                        if (timeStr != "") {
                            timeStr += " for ";
                        }

                        timeStr += "the minute starting at " + formatDate(new Date(1900, 1, 1, hoursExpr, minutesExpr, 0), "HH:mm tt");
                        allowHours = false;
                    }
                    else if (minutesExpr != "0") {
                        if (timeStr != " ") {
                            timeStr += " for ";
                        }

                        timeStr += "in the " + (parseInt(minutesExpr) + 1) + nth(parseInt(minutesExpr) + 1) + " minute";
                        requireHours = true;
                    }
                }
            }

            if (allowHours) {
                if (hoursExpr == "*") {
                    if (requireHours) {
                        if (timeStr != "") {
                            timeStr += " of ";
                        }

                        timeStr += "every hour";

                        requireDayOfMonth =
                            requireMonth =
                            requireDayOfWeek =
                            requireYear = false;
                    }
                }
                else if (hoursExpr.indexOf("/") != -1) {
                    if (timeStr != "") {
                        timeStr += " of ";
                    }

                    var hoursElementExpr = hoursExpr.split("/");
                    var hoursSeed = hoursExpr[0] == "*" ? 0 : parseInt(hoursExpr[0]);
                    var hoursIncrement = parseInt(hoursElementExpr[1]);

                    timeStr += "every " + (hoursIncrement == "1" ? "hour" : (hoursIncrement + " hours"));

                    if (hoursSeed != "0" && hoursSeed != "*") {
                        timeStr += " starting on the " + hoursSeed + nth(hoursSeed) + " hour";

                        requireDayOfMonth =
                            requireDayOfWeek = true;
                    }
                    else {
                        requireDayOfMonth =
                            requireMonth =
                            requireDayOfWeek =
                            requireYear = false;
                    }
                }
                else if (hoursExpr.indexOf(",") != -1) {
                    var hours = hoursExpr.split(",");

                    if (timeStr != "") {
                        timeStr += " ";
                    }

                    timeStr += "in the ";

                    for (var j = 0; j < hours.length; j++) {
                        if (j > 0) {
                            if (j == hours.length - 1) {
                                timeStr += " and ";
                            }
                            else {
                                timeStr += ", ";
                            }
                        }

                        timeStr += (parseInt(hours[j]) + 1) + nth(parseInt(hours[j]) + 1);
                    }

                    timeStr += " hour";

                    requireDayOfMonth =
                        requireDayOfWeek = true;
                }
                else if (hoursExpr.indexOf("-") != -1) {
                    if (timeStr != "") {
                        timeStr += " of ";
                    }

                    hours = hoursExpr.split("-");

                    if (hours[0] == "0") {
                        timeStr += "every hour until the " + (parseInt(hours[1]) + 1) + nth(parseInt(hours[1]) + 1) + " hour";
                    }
                    else {
                        timeStr += "every hour between the " + (parseInt(hours[0]) + 1) + nth(parseInt(hours[0]) + 1) + " and " + (parseInt(hours[1]) + 1) + nth(parseInt(hours[1]) + 1) + " hour";
                    }

                    requireDayOfMonth =
                        requireDayOfWeek = true;
                }
                else {
                    if (timeStr != "") {
                        timeStr += " for the hour starting at ";
                    }

                    timeStr += formatDate(new Date(1900, 1, 1, hoursExpr, 0, 0), "HH:mm tt");

                    requireDayOfMonth =
                        requireDayOfWeek = true;
                }
            }
        }

        var dateStr = "";

        if ((dayOfMonthExpr == "?" || dayOfMonthExpr == "*") && (dayOfWeekExpr == "?" || dayOfWeekExpr == "*")) {
            if (requireDayOfMonth || requireDayOfWeek) {
                dateStr += "every day";

                requireMonth =
                    requireYear = false;
            }
        }
        else {
            if (dayOfMonthExpr != "?" && dayOfMonthExpr != "*") {
                if (dayOfMonthExpr.indexOf("/") != -1) {
                    var dayOfMonthElementExpr = dayOfMonthExpr.split("/");
                    var dayOfMonthSeed = dayOfMonthElementExpr[0] == "*" ? 0 : parseInt(dayOfMonthElementExpr[0]);
                    var dayOfMonthIncrement = parseInt(dayOfMonthElementExpr[1]);

                    dateStr += "on every " + dayOfMonthIncrement + " days";

                    if (dayOfMonthSeed != "0" && dayOfMonthSeed != "*") {
                        dateStr += " starting on the " + dayOfMonthSeed + nth(dayOfMonthSeed) + " day";
                        requireMonth = true;
                    }
                }
                else if (dayOfMonthExpr.indexOf("LW") == 0) {
                    dateStr += "on the last weekday";
                    requireMonth = true;
                }
                else if (dayOfMonthExpr.indexOf("L") == 0) {
                    dayOfMonthElementExpr = dayOfMonthExpr.split("-");

                    if (dayOfMonthElementExpr.length != 1) {
                        var dayOfMonthToLast = dayOfMonthElementExpr[1];
                        dateStr += "on the " + (parseInt(dayOfMonthToLast) + 1) + nth(parseInt(dayOfMonthToLast) + 1) + "-to-last day";
                    }
                    else {
                        dateStr += "on the last day";
                    }

                    requireMonth = true;
                }
                else if (dayOfMonthExpr.indexOf("W") == 0) {
                    dateStr += "on weekdays";
                    requireMonth = true;
                }
                else if (dayOfMonthExpr.indexOf("W") > 0) {
                    var dayOfMonthNearest = dayOfMonthExpr.substring(0, dayOfMonthExpr.length - 1);
                    dateStr += "on the weekday nearest to the " + dayOfMonthNearest + nth(dayOfMonthNearest) + " day";
                    requireMonth = true;
                }
                else {
                    dateStr += "on the " + dayOfMonthExpr + nth(dayOfMonthExpr) + " day";
                    requireMonth = true;
                }
            }

            if (dayOfWeekExpr != "?" && dayOfWeekExpr != "*") {
                if (dateStr != "") {
                    dateStr += " ";
                }

                if (dayOfWeekExpr.indexOf("/") != -1) {
                    var dayOfWeekElementExpr = dayOfWeekExpr.split("/");
                    var dayOfWeekSeed = dayOfWeekElementExpr[0] == "*" ? 0 : parseInt(dayOfWeekElementExpr[0]);
                    var dayOfWeekIncrement = parseInt(dayOfWeekElementExpr[1]);

                    dateStr += "on ";

                    for (var i = dayOfWeekSeed; i < 8; i += dayOfWeekIncrement) {
                        if (i > dayOfWeekSeed) {
                            if (i + dayOfWeekIncrement >= 8) {
                                dateStr += " and ";
                            }
                            else {
                                dateStr += ", ";
                            }
                        }

                        dateStr += weekdayNamesPlural[parseInt([i]) - 1];
                    }

                    requireMonth =
                        requireYear = false;
                }
                if (dayOfWeekExpr.indexOf("#") != -1) {
                    dayOfWeekElementExpr = dayOfWeekExpr.split("#");
                    var dayOfWeek = dayOfWeekElementExpr[0];
                    var dayOfWeekInstance = dayOfWeekElementExpr[1];

                    dateStr += "on the " + dayOfWeekInstance + nth(dayOfWeekInstance) + " ";

                    if (dayOfWeek == "W") {
                        dateStr += "weekday";
                    }
                    else {
                        dateStr += weekdayNames[parseInt(dayOfWeek) - 1];
                    }

                    requireMonth = true;
                }
                else if (dayOfWeekExpr.indexOf("L") == 0) {
                    dayOfWeekElementExpr = dayOfWeekExpr.split("-");
                    dateStr += "on ";

                    if (dayOfWeekElementExpr.length != 1) {
                        var dayOfWeekToLast = dayOfWeekElementExpr[1];
                        dateStr += weekdayNamesPlural[6 - parseInt(dayOfWeekToLast)];
                    }
                    else {
                        dateStr += weekdayNamesPlural[6];
                    }

                    requireMonth =
                        requireYear = false;
                }
                else if (dayOfWeekExpr.indexOf("L") > 0) {
                    dayOfWeekElementExpr = dayOfWeekExpr.split("L");
                    dayOfWeek = dayOfWeekElementExpr[0];
                    dateStr += "on the last " + weekdayNames[parseInt(dayOfWeek) - 1];
                    requireMonth = true;
                }
                else if (dayOfWeekExpr.indexOf(",") > 0) {
                    dayOfWeekElementExpr = dayOfWeekExpr.split(",");
                    dateStr += "on ";

                    for (var k = 0; k < dayOfWeekElementExpr.length; k++) {
                        if (k > 0) {
                            if (k == dayOfWeekElementExpr.length - 1) {
                                dateStr += " and ";
                            }
                            else {
                                dateStr += ", ";
                            }
                        }

                        dateStr += weekdayNamesPlural[parseInt(dayOfWeekElementExpr[k]) - 1];
                    }
                }
                else {
                    dateStr += "on " + weekdayNamesPlural[parseInt(dayOfWeekExpr) - 1];

                    requireMonth =
                        requireYear = false;
                }
            }
        }

        var requireInKeyword = true;

        if (monthExpr == "*") {
            if (requireMonth) {
                if (dateStr != "") {
                    dateStr += " of ";
                }

                dateStr += "every month";
                requireYear = false;
            }
        }
        else {
            if (dateStr != "") {
                dateStr += " ";
            }

            if (monthExpr.indexOf("/") != -1) {
                var monthElementExpr = monthExpr.split("/");
                var monthSeed = monthElementExpr[0] == "*" ? 0 : parseInt(monthElementExpr[0]);
                var monthIncrement = parseInt(monthElementExpr[1]);

                dateStr += "of every " + monthIncrement + nth(monthIncrement) + " month";

                if (monthSeed != "0" && monthSeed != "*") {
                    dateStr += " starting in " + monthNames[parseInt(monthSeed) - 1];
                    requireInKeyword = false;
                }

                requireYear = true;
            }
            else {
                dateStr += "in " + monthNames[parseInt(monthExpr) - 1];
                requireInKeyword = false;
                requireYear = true;
            }
        }

        if (yearExpr == null || yearExpr == "*") {
            if (requireYear) {
                if (dateStr != "") {
                    dateStr += " ";
                }

                if (requireInKeyword) {
                    dateStr += "in ";
                }

                dateStr += "every year";
            }
        }
        else {
            if (dateStr != "") {
                dateStr += " ";
            }

            if (yearExpr.indexOf("/") != -1) {
                var yearElementExpr = yearExpr.split("/");
                var yearSeed = yearElementExpr[0] == "*" ? 0 : parseInt(yearElementExpr[0]);
                var yearIncrement = parseInt(yearElementExpr[1]);

                dateStr += "of every " + yearIncrement + nth(yearIncrement) + " year";

                if (yearSeed != "0" && yearSeed != "*") {
                    dateStr += " starting in " + yearSeed;
                }
            }
            else {
                if (requireInKeyword) {
                    dateStr += "in ";
                }

                dateStr += yearExpr;
            }
        }

        var str = "";

        if (timeStr != "") {
            str += timeStr;
        }

        if (dateStr != "") {
            if (str != "") {
                str += " ";
            }

            str += dateStr;
        }

        return str;
    }

    function nth(number) {
        if (number < 1) {
            return "error";
        }

        if (number % 100 >= 11 && number % 100 <= 13) {
            return "th";
        }

        if (number % 10 == 1) {
            return "st";
        }

        if (number % 10 == 2) {
            return "nd";
        }

        if (number % 10 == 3) {
            return "rd";
        }

        return "th";
    }
}
QuartzCronExpression.toPrettyString = QuartzCronExpression.prototype.toPrettyString;
