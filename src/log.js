


function Logger (name) {
    if (!this) return new Logger(name);
    this.name = name;
    this.trace = constructPerformer(this, console.debug, Logger.Level.trace);
    this.debug = constructPerformer(this, console.debug, Logger.Level.debug);
    this.info = constructPerformer(this, console.info, Logger.Level.info);
    this.log = constructPerformer(this, console.log, Logger.Level.info);
    this.warn = constructPerformer(this, console.warn, Logger.Level.warning);
    this.error = constructPerformer(this, console.error, Logger.Level.error);
    this.fatal = constructPerformer(this, console.error, Logger.Level.fatal);
}

var logLevels = {};

function constructPerformer (logger, f, level) {
    var performer = function (message) {
        logger.performLog(f, level, message, arguments);
    };
    Object.defineProperty(performer, 'isEnabled', {
        get: function () {
            var currentLevel = logger.currentLevel();
            console.log(currentLevel, level);
            return level >= currentLevel;
        },
        enumerable: true,
        configurable: true
    });
    return performer;
}

Logger.Level = {
    trace: 0,
    debug: 1,
    info: 2,
    warning: 3,
    warn: 3,
    error: 4,
    fatal: 5
};

Logger.LevelText = {};
Logger.LevelText [Logger.Level.trace] = 'TRACE';
Logger.LevelText [Logger.Level.debug] = 'DEBUG';
Logger.LevelText [Logger.Level.info] = 'INFO ';
Logger.LevelText [Logger.Level.warning] = 'WARN ';
Logger.LevelText [Logger.Level.error] = 'ERROR';

Logger.levelAsText = function (level) {
    return this.LevelText[level];
};

Logger.loggerWithName = function (name) {
    return new Logger(name);
};

Logger.prototype.currentLevel = function () {
    var logLevel = logLevels[this.name];
    return  logLevel ? logLevel : Logger.Level.trace;
};

Logger.prototype.setLevel = function (level) {
    logLevels[this.name] = level;
};

Logger.prototype.performLog = function (logFunc, level, message, otherArguments) {
    var currentLevel = this.currentLevel();
    if (currentLevel <= level) {
        logFunc = _.partial(logFunc, Logger.levelAsText(level) + ' [' + this.name + ']: ' + message);
        var args = [];
        for (var i=0; i<otherArguments.length; i++) {
            args[i] = otherArguments[i];
        }
        args.splice(0, 1);
        logFunc.apply(logFunc, args);
    }
};

module.exports = Logger;