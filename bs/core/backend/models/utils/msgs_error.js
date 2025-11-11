
const { USER_PASSWORD_LEN, PRODUCT_PRICE_MIN } = require('./constants');

module.exports = {
	ERR_REGEX_ALPHABETICAL_FULL: 'Must contain only alphabetic characters, may include accents, single spaces or single hyphens.',
	ERR_REGEX_USERNAME: 'Username must be 3–20 characters long, contain only letters, numbers, hyphens or underscores, and cannot start or end with a symbol.',
	ERR_IS_EMAIL: 'Invalid email format. Please enter a valid email address (e.g., user@example.com).',
	ERR_USER_PASSWORD_LEN: `Password must be between ${USER_PASSWORD_LEN[0]} and ${USER_PASSWORD_LEN[1]} characters long.`,
	ERR_NOT_NULL: 'This field is required and cannot be empty.',
	ERR_UNIQUE: 'This value already exists.',
	ERR_IS_NUMERIC: 'This value must be numeric.',
	ERR_PRODUCT_PRICE_MIN: `The price must be ${PRODUCT_PRICE_MIN} or higher.`
};
