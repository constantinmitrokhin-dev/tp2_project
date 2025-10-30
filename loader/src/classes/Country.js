
const Category = require("./Category");

class Country{
	constructor(name, iso3, iso2, currency, currency_name, currency_symbol, tld, phone_code){
        this._name = name;
        this._iso3 = iso3;
        this._iso2 = iso2;
        this._currency = currency;
        this._currency_name = currency_name;
        this._currency_symbol = currency_symbol;
        this._tld = tld;
        this._phone_code = phone_code;
    }
    get name(){
        return this._name;
    }
    get iso3(){
        return this._iso3;
    }
    get iso2(){
        return this._iso2;
    }
    get currency(){
        return this._currency;
    }
    get currency_name(){
        return this._currency_name;
    }
    get currency_symbol(){
        return this._currency_symbol;
    }
    get tld(){
        return this._tld;
    }
    get phone_code(){
        return this._phone_code;
    }
    get toString(){
        return `${this._name} (${this._iso3}, ${this._iso2}) - Currency: ${this._currency} (${this._currency_name}, ${this._currency_symbol}) - TLD: ${this._tld} - Phone Code: ${this._phone_code}`;
    }
}

module.exports = Country;
