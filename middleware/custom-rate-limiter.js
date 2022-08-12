const moment = require('moment');

/**
 * @class CustomRateLimiter
 * @classdesc CustomRateLimiter class
 * @param {object} options - Options for CustomRateLimiter class
 * @param {number} options.WINDOW_SIZE_IN_HOURS - Window size in hours
 */
class CustomRateLimiter {

    /**
     * Constructor Method
     * 
     * @param {object} options - CustomRateLimiter için options
     * @author [suleymansevimli](https://github.com/suleymansevimli)
     */
    constructor(options) {
        this.options = options;
    }

    /**
     * Rate limit Control Method
     * 
     * @desc Tanımlanan optionlara göre rate limit kontrolü yapılır.
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     * 
     * @author [suleymansevimli](https://github.com/suleymansevimli)
     */
    isRateLimited(req, res, next) {
        
        // time kontrolleri.
        const currentRequestTime = moment();
        const windowStartTimestamp = moment().subtract(this.options.WINDOW_SIZE_IN_HOURS, 'milliseconds').unix();
        
        // Burada isteklerin arrayi oluşturulur.
        const requestsWithinWindow = this.options.data.filter((entry) => {
            return entry.requestTimeStamp < windowStartTimestamp;
        });

        if (requestsWithinWindow.length >= this.options.MAX_WINDOW_REQUEST_COUNT) {
            // Eğer kullanıcı belirlenen istekten fazlasını göndermişse suspend edilir.
            
            this.clearSuspend(requestsWithinWindow);
            res.status(429).send({
                message: `You have exceeded the ${this.options.MAX_WINDOW_REQUEST_COUNT} requests in ${this.options.WINDOW_SIZE_IN_HOURS} hrs limit!`
            });

        } else {
            // Eğer kullanıcı belirlenen istekten fazlasını göndermemişse istek kaydedilir.
            let lastRequestLog = this.options.data[this.options.data.length - 1] ?? {currentRequestTime};
            let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.subtract(this.options.WINDOW_LOG_INTERVAL_IN_HOURS, 'hours').unix();
            
            if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                // Eğer son istek zaten bu pencere içinde ise data içerisindeki last request count arttırılır.
                lastRequestLog.requestCount++;
                this.options.data[this.options.data.length - 1] = lastRequestLog;
            } else {
                // ilk defa istek atılıyorsa kayıt edilir.
                this.options.data.push({
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1,
                });
            }

            // istek devam ettirilir.
            next();
        }
    }

    /**
     * Suspend Clear Method
     * 
     * @desc Suspend durumunu kaldırır.
     * @param {array} requestsWithinWindow - Suspend edilen isteklerin arrayi
     * @author [suleymansevimli](https://github.com/suleymansevimli)
     */
    clearSuspend(requestsWithinWindow) {
        setTimeout(() => {
            this.options.data = this.options.data.filter((entry) => {
                return !requestsWithinWindow.includes(entry);
            });
        }, this.options.REMOVE_SUSPEND);
    }
}

module.exports = CustomRateLimiter;