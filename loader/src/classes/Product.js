
const Category = require('./Category');

class Product extends Category{
	constructor(categoryName, code, description, price, details = null){
		super(categoryName);
		this._code = code;
		this._descriptions = [description];
		this._price = price;
		this._details = details;
		this._images = [];
	}
	get code(){
		return this._code;
	}
	get descriptions(){
		return this._descriptions;
	}
	get price(){
		return this._price;
	}
	get details(){
		return this._details !== null
		? ` /*/ ${this._details}`
		: '';
	}
	get images(){
		return this._images;
	}
	get toString(){
		return `${this._category} '${this._code}' '${this._descriptions}${this.details}' ${this._price}`;
	}

	addDescription(description){
		if (!this.productHasDescription(description)){
			this._descriptions.push(description);
		}
	}
	addImage(url){
		this._images.push(url);
	}
	productHasDescription(description){
		return this._descriptions.some(
			desc => desc.trim().toLowerCase() === description.trim().toLowerCase()
		);
	}
}

module.exports = Product;
