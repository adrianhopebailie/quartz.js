//Hacky way to convert our non-node js file into a node module.
var fs = require('fs');
var code = fs.readFileSync(__dirname + "/quartz-util.js").toString() +
    "module.exports = QuartzCronExpression;";
eval(code);