
module.exports = {
	REGEX_ALPHABETICAL_FULL: /^(?!.*[- '’]{2})([A-Za-zÀ-ÖØ-öø-ÿ]+(?:[- '’][A-Za-zÀ-ÖØ-öø-ÿ]+)*)$/,
	REGEX_USERNAME: /^(?!.*[-_]{2})[A-Za-z0-9](?:[A-Za-z0-9-_]{1,18}[A-Za-z0-9])?$/,
	USER_PASSWORD_LEN: [8, 24],
	USER_STATUS_ENUM: ['pending', 'active', 'inactive'],
	PRODUCT_PRICE_MIN: [0],
}
