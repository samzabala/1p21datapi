//sana 2d lang
export const Coordinates = ['x', 'y'];

//kwan has scales domains and shit
export const DatumKeys = [0, 1, 'color', 'area'];
export const CoordDatumKeys = [0, 1];

/*****************************************************************************
 *DATA HELPEE
 *****************************************************************************/

// kinkily get data but with aility to get down deep because we never know where the fuck the date will be at
// @param obj : duh
// @param keystring : hooman provided object key string that is hopefully correct
// @param isNum : if the data is a number

//kinkily merge defaults with custom
export const DeepValidate = (defaults, arr) => {
	const args = defaults;

	Object.keys(arr).forEach((prop, i) => {
		//ha?
		if (prop == 'key' || prop == 'reverse') {
			// if(Object.prototype.toString.call(arr[prop]) == '[object Object]'){
			args[prop] = DeepValidate(args[prop], arr[prop]);
		} else if (arr.hasOwnProperty.call(arr, prop)) {
			// Push each value from `obj` into `extended`
			args[prop] = arr[prop];
		}
	});

	return args;
};

//get the length attribute to associate with the axis bro
export const ToSide = (axisName, opposite) => {
	return opposite
		? axisName == 'x'
			? 'height'
			: 'width'
		: axisName == 'x'
		? 'width'
		: 'height';
};

export const ToOppoAxis = (axisName) => {
	return axisName == 'x' ? 'y' : 'x';
};

//d3 does not support ie 11. kill it
export const VaildateBrowser = () => {
	const ua = navigator.userAgent;
	return ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
};

//string helpers
export const Str = {
	// duh
	fileExtension: (str) => {
		return str.split('.').pop();
	},

	// convert boi to
	hash: (str) => {
		const url = str;
		const type = url.split('#');
		const hash = type[type.length - 1] || '';
		return hash;
	},

	// is dis json enough for u?
	isValidJSONString: (str) => {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}

		return true;
	},

	//kemel
	toCamelCase: (str) => {
		return str
			.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
				return index == 0 ? word.toLowerCase() : word.toUpperCase();
			})
			.replace(/\s+/g, '')
			.replace('-', '');
	},

	//duh
	toCapitalize: (str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	},
};

export const ColorIsDark = (hexString) => {
	// Variables for red, green, blue values
	let r, g, b, hsp;

	// Check the format of the hexString, HEX or RGB?
	if (hexString.match(/^rgb/)) {
		// If HEX --> store the red, green, blue values in separate variables
		hexString = hexString.match(
			/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
		);
		r = hexString[1];
		g = hexString[2];
		b = hexString[3];
	} else {
		// If RGB --> Convert it to HEX: http://gist.github.com/983661
		hexString = +(
			'0x' + hexString.slice(1).replace(hexString.length < 5 && /./g, '$&$&')
		);
		r = hexString >> 16;
		g = (hexString >> 8) & 255;
		b = hexString & 255;
	}

	// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
	hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

	// Using the HSP value, determine whether the hexString is light or dark
	if (hsp > 170) {
		//127.5
		return false;
	} else {
		return true;
	}
};

export const ValidMargin = (variable) => {
	if (typeof variable === 'number') {
		return variable;
	}
};

export const GetNearest = (num) => {
	if (num > 10) {
		return Math.pow(10, num.toString().length - 1) * 10;
	} else {
		return 1;
	}
};

export const PlaceholderColors = [
	'#0480FE',
	'#F204A2',
	'#894EC7',
	'#00b754',
	'#fd7f03',
	'#fd0303',
	'#0037B4',
	'#5E01A8',
	'#FE85D6',
	'#FFF200',
	'#D7C368',
	'#0480FE',
	'#A168D9',
	'#FD7F03',
	'#16B900',
	'#01C6AB',
	'#FB1818',
	'#006943',
	'#F7BC00',
	'#B6E4B6',
	'#FEC87C',
	'#E18256',
	'#313F76',
	'#547B80',
	'#8F4139',
	'#ECC65F',
	'#D069A9',
	'#008EB0',
	'#5F6046',
	'#C26558',
	'#B00B69',
	'#042069',
	'#B00B1E',
	'#30261C',
	'#403831',
	'#36544F',
	'#1F5F61',
	'#0B8185',
	'#59B390',
	'#F0DDAA',
	'#E47C5D',
	'#E32D40',
	'#152B3C',
	'#E94E77',
	'#D68189',
	'#C6A49A',
	'#C6E5D9',
	'#F4EAD5',
	'#4B1139',
	'#3B4058',
	'#2A6E78',
	'#7A907C',
	'#C9B180',
	'#027B7F',
	'#FFA588',
	'#D62957',
	'#BF1E62',
	'#572E4F',
	'#A1DBB2',
	'#FEE5AD',
	'#FACA66',
	'#F7A541',
	'#F45D4C',
	'#59B390',
	'#F0DDAA',
	'#E47C5D',
	'#E32D40',
	'#152B3C',
	'#A69E80',
	'#E0BA9B',
	'#E7A97E',
	'#D28574',
	'#3B1922',
	'#2B222C',
	'#5E4352',
	'#965D62',
	'#C7956D',
	'#F2D974',
	'#9DC9AC',
	'#FFFEC7',
	'#F56218',
	'#FF9D2E',
	'#919167',
	'#E6B39A',
	'#E6CBA5',
	'#EDE3B4',
	'#8B9E9B',
	'#6D7578',
	'#D1313D',
	'#E5625C',
	'#F9BF76',
	'#8EB2C5',
	'#615375',
	'#75616B',
	'#BFCFF7',
	'#DCE4F7',
	'#F8F3BF',
	'#D34017',
	'#5E412F',
	'#FCEBB6',
	'#78C0A8',
	'#F07818',
	'#F0A830',
	'#EFEECC',
	'#FE8B05',
	'#FE0557',
	'#400403',
	'#0AABBA',
	'#FE4365',
	'#FC9D9A',
	'#F9CDAD',
	'#C8C8A9',
	'#83AF9B',
	'#D3D5B0',
	'#B5CEA4',
	'#9DC19D',
	'#8C7C62',
	'#71443F',
	'#F38A8A',
	'#55443D',
	'#A0CAB5',
	'#CDE9CA',
	'#F1EDD0',
	'#8C2318',
	'#5E8C6A',
	'#88A65E',
	'#BFB35A',
	'#F2C45A',
	'#FBC599',
	'#CDBB93',
	'#9EAE8A',
	'#335650',
	'#F35F55',
	'#75616B',
	'#BFCFF7',
	'#DCE4F7',
	'#F8F3BF',
	'#D34017',
	'#360745',
	'#D61C59',
	'#E7D84B',
	'#EFEAC5',
	'#1B8798',
	'#261C21',
	'#6E1E62',
	'#B0254F',
	'#DE4126',
	'#EB9605',
	'#FCFEF5',
	'#E9FFE1',
	'#CDCFB7',
	'#D6E6C3',
	'#FAFBE3',
	'#046D8B',
	'#309292',
	'#2FB8AC',
	'#93A42A',
	'#ECBE13',
	'#C6CCA5',
	'#8AB8A8',
	'#6B9997',
	'#54787D',
	'#615145',
	'#E7EDEA',
	'#FFC52C',
	'#FB0C06',
	'#030D4F',
	'#CEECEF',
	'#4E395D',
	'#827085',
	'#8EBE94',
	'#CCFC8E',
	'#DC5B3E',
	'#9DC9AC',
	'#FFFEC7',
	'#F56218',
	'#FF9D2E',
	'#919167',
	'#607848',
	'#789048',
	'#C0D860',
	'#F0F0D8',
	'#604848',
	'#C75233',
	'#C78933',
	'#D6CEAA',
	'#79B5AC',
	'#5E2F46',
	'#EFF3CD',
	'#B2D5BA',
	'#61ADA0',
	'#248F8D',
	'#605063',
	'#FFFBB7',
	'#A6F6AF',
	'#66B6AB',
	'#5B7C8D',
	'#4F2958',
	'#B1E6D1',
	'#77B1A9',
	'#3D7B80',
	'#270A33',
	'#451A3E',
	'#395A4F',
	'#432330',
	'#853C43',
	'#F25C5E',
	'#FFA566',
	'#382F32',
	'#FFEAF2',
	'#FCD9E5',
	'#FBC5D8',
	'#F1396D',
	'#E9E0D1',
	'#91A398',
	'#33605A',
	'#070001',
	'#68462B',
	'#FF9900',
	'#424242',
	'#E9E9E9',
	'#BCBCBC',
	'#3299BB',
	'#230F2B',
	'#F21D41',
	'#EBEBBC',
	'#BCE3C5',
	'#82B3AE',
	'#2B2726',
	'#0A516D',
	'#018790',
	'#7DAD93',
	'#BACCA4',
	'#D1E751',
	'#FFFFFF',
	'#000000',
	'#4DBCE9',
	'#26ADE4',
	'#CFB590',
	'#9E9A41',
	'#758918',
	'#564334',
	'#49281F',
	'#EFD9B4',
	'#D6A692',
	'#A39081',
	'#4D6160',
	'#292522',
	'#5E3929',
	'#CD8C52',
	'#B7D1A3',
	'#DEE8BE',
	'#FCF7D3',
	'#BBBB88',
	'#CCC68D',
	'#EEDD99',
	'#EEC290',
	'#EEAA88',
	'#0CA5B0',
	'#4E3F30',
	'#FEFEEB',
	'#F8F4E4',
	'#A5B3AA',
	'#75616B',
	'#BFCFF7',
	'#DCE4F7',
	'#F8F3BF',
	'#D34017',
	'#B6D8C0',
	'#C8D9BF',
	'#DADABD',
	'#ECDBBC',
	'#FEDCBA',
	'#1B676B',
	'#519548',
	'#88C425',
	'#BEF202',
	'#EAFDE6',
	'#1C2130',
	'#028F76',
	'#B3E099',
	'#FFEAAD',
	'#D14334',
	'#CC5D4C',
	'#FFFEC6',
	'#C7D1AF',
	'#96B49C',
	'#5B5847',
	'#E7EDEA',
	'#FFC52C',
	'#FB0C06',
	'#030D4F',
	'#CEECEF',
	'#382F32',
	'#FFEAF2',
	'#FCD9E5',
	'#FBC5D8',
	'#F1396D',
	'#75616B',
	'#BFCFF7',
	'#DCE4F7',
	'#F8F3BF',
	'#D34017',
	'#595643',
	'#4E6B66',
	'#ED834E',
	'#EBCC6E',
	'#EBE1C5',
	'#4D3B3B',
	'#DE6262',
	'#FFB88C',
	'#FFD0B3',
	'#F5E0D3',
	'#6DA67A',
	'#99A66D',
	'#A9BD68',
	'#B5CC6A',
	'#C0DE5D',
	'#1C0113',
	'#6B0103',
	'#A30006',
	'#C21A01',
	'#F03C02',
	'#6DA67A',
	'#99A66D',
	'#A9BD68',
	'#B5CC6A',
	'#C0DE5D',
	'#A70267',
	'#F10C49',
	'#FB6B41',
	'#F6D86B',
	'#339194',
	'#311D39',
	'#67434F',
	'#9B8E7E',
	'#C3CCAF',
	'#A51A41',
	'#0CA5B0',
	'#4E3F30',
	'#FEFEEB',
	'#F8F4E4',
	'#A5B3AA',
	'#351330',
	'#424254',
	'#64908A',
	'#E8CAA4',
	'#CC2A41',
	'#7E5686',
	'#A5AAD9',
	'#E8F9A2',
	'#F8A13F',
	'#BA3C3D',
	'#E6B39A',
	'#E6CBA5',
	'#EDE3B4',
	'#8B9E9B',
	'#6D7578',
	'#041122',
	'#259073',
	'#7FDA89',
	'#C8E98E',
	'#E6F99D',
	'#EFFFCD',
	'#DCE9BE',
	'#555152',
	'#2E2633',
	'#99173C',
	'#8DCCAD',
	'#988864',
	'#FEA6A2',
	'#F9D6AC',
	'#FFE9AF',
	'#594F4F',
	'#547980',
	'#45ADA8',
	'#9DE0AD',
	'#E5FCC2',
	'#E8D5B7',
	'#0E2430',
	'#FC3A51',
	'#F5B349',
	'#E8D5B9',
	'#000000',
	'#9F111B',
	'#B11623',
	'#292C37',
	'#CCCCCC',
	'#B1E6D1',
	'#77B1A9',
	'#3D7B80',
	'#270A33',
	'#451A3E',
	'#452E3C',
	'#FF3D5A',
	'#FFB969',
	'#EAF27E',
	'#3B8C88',
	'#B7CBBF',
	'#8C886F',
	'#F9A799',
	'#F4BFAD',
	'#F5DABD',
	'#C1B398',
	'#605951',
	'#FBEEC2',
	'#61A6AB',
	'#ACCEC0',
	'#000000',
	'#9F111B',
	'#B11623',
	'#292C37',
	'#CCCCCC',
	'#0CA5B0',
	'#4E3F30',
	'#FEFEEB',
	'#F8F4E4',
	'#A5B3AA',
	'#322938',
	'#89A194',
	'#CFC89A',
	'#CC883A',
	'#A14016',
	'#00A8C6',
	'#40C0CB',
	'#F9F2E7',
	'#AEE239',
	'#8FBE00',
	'#FFF3DB',
	'#E7E4D5',
	'#D3C8B4',
	'#C84648',
	'#703E3B',
	'#F0D8A8',
	'#3D1C00',
	'#86B8B1',
	'#F2D694',
	'#FA2A00',
	'#B1E6D1',
	'#77B1A9',
	'#3D7B80',
	'#270A33',
	'#451A3E',
	'#774F38',
	'#E08E79',
	'#F1D4AF',
	'#ECE5CE',
	'#C5E0DC',
	'#5E3929',
	'#CD8C52',
	'#B7D1A3',
	'#DEE8BE',
	'#FCF7D3',
	'#594F4F',
	'#547980',
	'#45ADA8',
	'#9DE0AD',
	'#E5FCC2',
	'#A8E6CE',
	'#DCEDC2',
	'#FFD3B5',
	'#FFAAA6',
	'#FF8C94',
	'#9CDDC8',
	'#BFD8AD',
	'#DDD9AB',
	'#F7AF63',
	'#633D2E',
	'#AAFF00',
	'#FFAA00',
	'#FF00AA',
	'#AA00FF',
	'#00AAFF',
	'#6DA67A',
	'#77B885',
	'#86C28B',
	'#859987',
	'#4A4857',
	'#331327',
	'#991766',
	'#D90F5A',
	'#F34739',
	'#FF6E27',
	'#A3A948',
	'#EDB92E',
	'#F85931',
	'#CE1836',
	'#009989',
	'#B3CC57',
	'#ECF081',
	'#FFBE40',
	'#EF746F',
	'#AB3E5B',
	'#774F38',
	'#E08E79',
	'#F1D4AF',
	'#ECE5CE',
	'#C5E0DC',
	'#E8D5B7',
	'#0E2430',
	'#FC3A51',
	'#F5B349',
	'#E8D5B9',
	'#5E9FA3',
	'#DCD1B4',
	'#FAB87F',
	'#F87E7B',
	'#B05574',
	'#FDE6BD',
	'#A1C5AB',
	'#F4DD51',
	'#D11E48',
	'#632F53',
	'#85847E',
	'#AB6A6E',
	'#F7345B',
	'#353130',
	'#CBCFB4',
	'#FF003C',
	'#FF8A00',
	'#FABE28',
	'#88C100',
	'#00C176',
	'#331327',
	'#991766',
	'#D90F5A',
	'#F34739',
	'#FF6E27',
	'#1D1313',
	'#24B694',
	'#D22042',
	'#A3B808',
	'#30C4C9;',
];
