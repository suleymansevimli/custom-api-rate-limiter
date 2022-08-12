# Custom API RATE LIMITER

Api ve client arasında gerçekleşen isteklerin sınırlandırılması için kullanılır.


## Usage

```js
    ...
    const CustomRateLimiter = require('./middleware/custom-rate-limiter');
    ...

    // example configurations
    const customRateLimiter = new CustomRateLimiter({
        WINDOW_SIZE_IN_HOURS: 1 * 60 * 1000, // 1min in milliseconds
        MAX_WINDOW_REQUEST_COUNT: 2,
        WINDOW_LOG_INTERVAL_IN_HOURS: 1 * 60 * 1000, // 1min in milliseconds
        data: [],
        REMOVE_SUSPEND: 1 * 30 * 1000, // 30 seconds in milliseconds
    });

    // set options for rate limiter
    const limiter = customRateLimiter.isRateLimited.bind(customRateLimiter);

    // set middleware for app
    app.use(limiter);

```