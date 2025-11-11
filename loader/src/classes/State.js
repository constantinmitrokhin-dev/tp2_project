
class State{
	constructor(name, iso3, iso2, country_code, country_name, type){
		this.name = name;
		this.iso3 = iso3;
		this.iso2 = iso2;
        this.country_code = country_code;
        this.country_name = country_name;
        this.type = type;
	}

}

module.exports = State;
