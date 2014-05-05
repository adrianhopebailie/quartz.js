var qunit = require('qunit');

qunit.run({
    code: {
        path: 'quartz-node.js',
        namespace: "QuartzCronExpression"
    },
    tests: [
        'tests/quartz-constructors.js',
        'tests/quartz-hourly.js',
        'tests/quartz-daily.js',
        'tests/quartz-weekly.js',
        'tests/quartz-monthly.js',
        'tests/quartz-pretty-string.js'
    ]
});