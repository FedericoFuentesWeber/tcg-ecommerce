import winston from 'winston';

const levelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'yellow',
        info: 'blue',
        http: 'greens',
        debug: 'white'
    }
};

const devLogger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.colors }),
                winston.format.simple()
            )
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        new winston.transports.Console({ 
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ 
            filename: './errors.log', 
            level:'error',
            format: winston.format.simple()
        })
    ]
});

const addLogger = (req, res, next) => {
    req.logger = devLogger;
    req.logger.debug(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString}`);
    next();
};

export {
    addLogger,
    devLogger,
    prodLogger
}