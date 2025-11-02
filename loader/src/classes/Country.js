
const Category = require("./Category");

class Country{
	constructor(name, iso3, iso2, currency, currency_name, currency_symbol, tld, phone_code){
		this.name = name;
		this.iso3 = iso3;
		this.iso2 = iso2;
		this.currency = currency;
		this.currency_name = currency_name;
		this.currency_symbol = currency_symbol;
		this.tld = tld;
		this.phone_code = phone_code;
	}

	get toString(){
		return `${this.name} (${this.iso3}, ${this.iso2}) - Currency: ${this.currency} (${this.currency_name}, ${this.currency_symbol}) - TLD: ${this.tld} - Phone Code: ${this.phone_code}`;
	}
}

module.exports = Country;
