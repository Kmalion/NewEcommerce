import winston from "winston"

// const logger  = winston.createLogger({

//     transports:[
//         new winston.transports.Console({level: "http"}),
//         new winston.transports.File({filename: 'errors.log', level: 'warn'})
//     ]
// })

//Configuraciones personalizadas

const levelOptions = {
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        debug: 4,
    }, 
    colors:{
        fatal:'red',
        error:'orange',
        warning:'yellow',
        info:'blue',
        debug: 'white',
    }
}
const logger  = winston.createLogger({
    levels:levelOptions.levels,
    transports:
    new winston.transports.Console({
            level:"debug",
        format: winston.format.combine(
            winston.format.colorize({colors: levelOptions.colors}),
            winston.format.simple()
        )
    }),
    // new winston.transports.File({
    //     filename:'errors.log',
    //     level: 'warning',
    //     format: winston.format.simple()
    // })]
})
export const addLogger = (req,res, next)=>{
    req.logger=logger
    // req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    req.logger.debug(`Esto es un Warning ${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next();
}
