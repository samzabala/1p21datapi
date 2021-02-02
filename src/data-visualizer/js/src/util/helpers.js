 //sana 2d lang
export const Coordinates = ['x','y'];

 //kwan has scales domains and shit
export const DatumKeys = [0,1,'color','area'];



/*****************************************************************************
 *DATA HELPEE
*****************************************************************************/




// kinkily get data but with aility to get down deep because we never know where the fuck the date will be at
// @param obj : duh 
// @param keystring : hooman provided object key string that is hopefully correct 
// @param isNum : if the data is a number

//kinkily merge defaults with custom
export const DeepValidate = (defaults,arr) => {
	const args = defaults;

	Object.keys(arr).forEach((prop,i)=>{
		//ha?
		if(prop == 'key' || prop == 'reverse'){
		// if(Object.prototype.toString.call(arr[prop]) == '[object Object]'){
			args[prop] = DeepValidate(args[prop],arr[prop]);

		}else if(arr.hasOwnProperty.call(arr,prop)) {
			// Push each value from `obj` into `extended`
			args[prop] = arr[prop];
		}
	}); 

	return args;
}

//get the length attribute to associate with the axis bro
export const ToSide = (axisName,opposite) => {
	return opposite
	? (
		(axisName == 'x')
		? 'height'
		: 'width'
	)
	: (
		(axisName == 'x')
		? 'width' 
		: 'height'
	);
}

export const ToOppoAxis = (axisName)=>{
	return (axisName == 'x') ? 'y' : 'x';
}

//d3 does not support ie 11. kill it
export const VaildateBrowser = () => {
	const ua = navigator.userAgent;
	return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1
}

//string helpers
export const Str = {
	// duh
		fileExtension: (str)=>{
			return str.split('.').pop();
		},

	// convert boi to 
		hash: (str)=>{
			const url = str;
			const type = url.split('#');
			const hash = type[ (type.length - 1 )] || '';
			return hash;
		},

	// is dis json enough for u?
		IsValidJSONString: (str)=>{
			try {
				JSON.parse(str);

			} catch (e) {
				return false;
			}

			return true;
		},

	//kemel
		toCamelCase: (str)=>{
			return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index)=> {
				return index == 0 ? word.toLowerCase() : word.toUpperCase();
			}).replace(/\s+/g, '');
		},

	//duh
		toCapitalize:(str)=>{
			return str.charAt(0).toUpperCase() + str.slice(1)
		}
}

export const ColorIsDark = (hexString)=>{

	// Variables for red, green, blue values
	let r, g, b, hsp;
	
	// Check the format of the hexString, HEX or RGB?
	if(hexString.match(/^rgb/)) {
		// If HEX --> store the red, green, blue values in separate variables
		hexString = hexString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
		r = hexString[1];
		g = hexString[2];
		b = hexString[3];

	} else {
		// If RGB --> Convert it to HEX: http://gist.github.com/983661
		hexString = +("0x" + hexString.slice(1).replace( 
		hexString.length < 5 && /./g, '$&$&'));
		r = hexString >> 16;
		g = hexString >> 8 & 255;
		b = hexString & 255;
	}
	
	// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
	hsp = Math.sqrt(
		0.299 * (r * r)
		+ 0.587 * (g * g)
		+ 0.114 * (b * b)
	);

	// Using the HSP value, determine whether the hexString is light or dark
	if(hsp>170) { //127.5
		return false;

	} else {
		return true;
	}
}

export const ValidMargin = (variable) => {
	if(typeof variable === 'number'){
		return variable
	}
}

export const GetNearest = (num)=>{

	if(num > 10){
		return Math.pow(10, num.toString().length - 1) * 10;

	}else{
		return 1;
	}

};