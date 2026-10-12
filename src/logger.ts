import util from 'util';
import winston from 'winston';
import moment from 'moment';

export class Logger {
    private logger: any;
    public logLevel: string;

    constructor(options?: any) {
        this.logLevel = options.logLevel || 'info';

        const formatTime = winston.format((i) => {
            i.timestamp = moment(new Date()).format('HH:mm:ss');
            let ts = `${i.timestamp}`;
            switch (i.level) {
                case 'debug':
                    ts += ' ⚙ ';
                    break;
                case 'info':
                    ts += ' ⓘ ';
                    break;
                case 'error':
                    ts += ' 🔥 ';
                    break;
                case 'warn':
                    ts += ' ⚠️ ';
                    break;
                case 'silly':
                    ts += ' 💩 ';
                    break;
            }
            i.timestamp = ts;
            return i;
        });

        const formatter = winston.format.printf(({ level, message, label, timestamp, ...meta}: any) => {
            let ts = `${timestamp}`;
            if (!message.length && meta instanceof Error) {
                message = meta + meta.stack!;
            }
            let msg = ts + ' ' + level + ': ' + (undefined !== message ? message : '') +
            (meta && Object.keys(meta).length
            ? '\n\t' + util.inspect(meta)
            : '');
            return msg;
        });
        
        this.logger = winston.createLogger({
            level: this.logLevel,
            format: winston.format.json(),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        formatTime(),
                        winston.format.colorize(),
                        winston.format.errors({ stack: true }),
                        formatter
                    ),
                }),
            ],
        });

        const ret = this.logger;
        ret.error = console.error;
        return ret;
    }
}
