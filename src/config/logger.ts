import log4js from "log4js";

const logger = {
    appenders : {
        debug : {
            type : "file",
            filename : "./logs/debug.log",
            pattern : "yyyy-mm-dd",
            compress : true
        },
        error : {
            type: "file",
            filename: "./logs/error.log",
            pattern: "yyyy-MM-dd",
            compress: true,
        },
    },
    categories : {
        default: { appenders: ["debug"], level: "debug" },
        error: { appenders: ["error"], level: "error" },
    }
}

export default logger ; 

export const debugLogger = log4js.getLogger("default");
export const errorLogger = log4js.getLogger("error");