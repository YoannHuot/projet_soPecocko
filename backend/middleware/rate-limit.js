const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
	windowMs: 1000 * 60, // 100 requête en une minute
	max: 100,
	message: "You have exceeded the 100 requests in one minute",
	headers: true
});

module.exports.rateLimiter;
