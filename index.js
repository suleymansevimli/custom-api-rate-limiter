'use strict';

/**
 *  Constants
 */
const CustomRateLimiter = require('./middleware/custom-rate-limiter');
const express = require('express');
const app = express();
const router = express.Router();

/**
 * Rate Limiter Middleware Options
 * rate limiter için gerekli optionlar bu alanda tanımlanır.
 * 
 * @author [suleymansevimli](https://github.com/suleymansevimli)
 */
const customRateLimiter = new CustomRateLimiter({
    WINDOW_SIZE_IN_HOURS: 1 * 60 * 1000, // 1min in milliseconds
    MAX_WINDOW_REQUEST_COUNT: 2,
    WINDOW_LOG_INTERVAL_IN_HOURS: 1 * 60 * 1000, // 1min in milliseconds
    data: [],
    REMOVE_SUSPEND: 1 * 30 * 1000, // 30 seconds in milliseconds
});


/**
 * Rate Limiter için handler fonksiyon bind edilir.
 * 
 * @author [suleymansevimli](https://github.com/suleymansevimli)
 */
const limiter = customRateLimiter.isRateLimited.bind(customRateLimiter);


/**
 * Middleware node uygulamasına entegre edilir.
 * 
 * @author [suleymansevimli](https://github.com/suleymansevimli)
 */
app.use(limiter);


/**
 * Application routes
 * 
 * @author [suleymansevimli](https://github.com/suleymansevimli)
 */
router.get('/', function (req, res) {
    res.json({
        message: 'hello !'
    });
});


/**
 * Router
 */
app.use('/', router);


/**
 * Server start
 */
app.listen(8080, function () {
    console.log('Sunucu çalışıyor...');
});