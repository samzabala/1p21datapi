

// get data but with aility to get down deep because we never know where the fuck the date will be at
// @param obj : duh 
// @param keystring : hooman provided object key string that is hopefully correct 
// @param isNum : if the data is a number
export const deepGet = (obj,keyString, isNum) => {
	isNum = isNum || false;

	let splitString = keyString.toString().split('.');

	//remove empty instances because they just mess with the loop
	splitString.forEach((key,i)=>{
		(key == '') && splitString.splice(i, 1);
	});
		
	const value = multiIndex(obj,splitString);
	
	if(isNum == true && isNaN(value)){
		console.warn(`${selector} data with the key source of '${keyString}' was passed as numeric but is not.` )
	}

	return value;
};
	const multiIndex = (obj,is)=>{

		var toReturn = null;

		if(is.length){
			toReturn = multiIndex(obj[is[0]],is.slice(1));

		}else{
			toReturn = ( isNum == true ) ? parseFloat(obj) : obj;
		}

		return toReturn;
	};

//merge defaults with custom
export const deepValidate = (defaults,arr) => {
	const settings = defaults;

	Object.keys(arr).forEach((prop,i)=>{
		//ha?
		if(prop == 'key' || prop == 'reverse'){
		// if(Object.prototype.toString.call(arr[prop]) == '[object Object]'){
			settings[prop] = deepValidate(settings[prop],arr[prop]);

		}else if(arr.hasOwnProperty.call(arr,prop)) {
			// Push each value from `obj` into `extended`
			settings[prop] = arr[prop];
		}
	}); 

	return settings;
};

//get the length attribute to associate with the axis bro
export const getDimension = (axisString,opposite) => {
	return opposite
	? (
		(axisString == 'x')
		? 'height'
		: 'width'
	)
	: (
		(axisString == 'x')
		? 'width' 
		: 'height'
	);
};

// get the opposite boi for alignmeny purposes
export const getOppoAxis = (axisString)=>{
	return (axisString == 'x') ? 'y' : 'x';
};

//d3 does not support ie 11. kill it
export const isIE = () => {
	const ua = navigator.userAgent;
	return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1
};

//string helpers
// duh
export const strGetFileExtension = (str)=>{
	return str.split('.').pop();
};

// convert boi to 
export const strGetHash = (str)=>{
	const url = str;
	const type = url.split('#');
	const hash = type[ (type.length - 1 )] || '';
	return hash;
};

				const self = this;
// is dis json enough for u?
export const strIsValidJSONString = (str)=>{
	try {
		JSON.parse(str);

	} catch (e) {
		return false;
	}

	return true;
};

//kemel
export const strToCamelCase = (str)=>{
	return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index)=> {
		return index == 0 ? word.toLowerCase() : word.toUpperCase();
	}).replace(/\s+/g, '');
};

//is that bitch boi dark? thank u internet
export const isDark = (color)=>{

		// Variables for red, green, blue values
	let r, g, b, hsp;
	
	// Check the format of the color, HEX or RGB?
	if(color.match(/^rgb/)) {
		// If HEX --> store the red, green, blue values in separate variables
		color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
		r = color[1];
		g = color[2];
		b = color[3];

	} else {
		// If RGB --> Convert it to HEX: http://gist.github.com/983661
		color = +("0x" + color.slice(1).replace( 
		color.length < 5 && /./g, '$&$&'));
		r = color >> 16;
		g = color >> 8 & 255;
		b = color & 255;
	}
	
	// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
	hsp = Math.sqrt(
		0.299 * (r * r)
		+ 0.587 * (g * g)
		+ 0.114 * (b * b)
	);

	// Using the HSP value, determine whether the color is light or dark
	if(hsp>170) { //127.5
		return false;

	} else {
		return true;
	}
};

export const numNearest = (num)=>{

	if(num > 10){
		return Math.pow(10, num.toString().length - 1) * 10;

	}else{
		return 1;
	}

}