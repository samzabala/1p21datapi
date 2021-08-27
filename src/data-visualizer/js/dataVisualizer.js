import Axis from 'src/components/axis.js';
import Shape from 'src/components/shape.js';
import Label from 'src/components/label.js';
import Line from 'src/components/line.js';
import Pi from 'src/components/pi.js';
import Ticks from 'src/components/ticks.js';
import Tip from 'src/components/tip.js';
import {
	Coordinates,
	DatumKeys,
	DeepValidate,
	GetNearest,
	ToSide,
	ToOppoAxis,
	VaildateBrowser,
	Str,
	ColorIsDark,
	ValidMargin
} from 'src/util/helpers.js';
/*!
* 1point21 Data Vizualiser Version 1.2.1
* Render Script
* @license yes
* DO NOT EDIT min.js
* edit its corresponding unminified js file in /src instead
*/

/* DO NOT TOUCH I DEV ON THIS BOI I ENQUEUE THE MINIFIED ONE ANYWAY  :< */

/*

TODO:
pie does not display a wHOLE PIE
duisplay types for multiple
- compare
- slider
- overlap
- one
*/

/*****************************************************************************
 * ATTR ABD SHIT DEFINITIONS
*****************************************************************************/

const
	//yeeee
	PREFIX = 'dv',

	//for calculating the height and offset for spacing on text elements by the Shape items vertically. value is sum of both sides
	TEXT_PADDING = 2.25,

	BASE_TYPES = ['bar','pie','line','scatter']
	;


const
	CLASS_READY = `${PREFIX}-initialized`,
	CLASS_ERROR = `${PREFIX}-fatality`,

	CLASS_HEADER = `${PREFIX}-heading`,
		CLASS_TITLE = `${PREFIX}-title`,
		CLASS_DESCRIPTION = `${PREFIX}-description`,

	CLASS_BODY = `${PREFIX}-body`,
		CLASS_SVG = `${PREFIX}-svg`,
		CLASS_G_CONTAINER = `${PREFIX}-container`,
			CLASS_LABELS = `${PREFIX}-labels`,
				CLASS_LABEL_PREFIX = `${PREFIX}-label`,
			CLASS_RULERS = `${PREFIX}-rulers`,
				CLASS_RULER_PREFIX = `${PREFIX}-rule`,
				CLASS_RULER_ALIGN_PREFIX = `${CLASS_RULER_PREFIX}-align`,
			CLASS_GRIDS = `${PREFIX}-grid`,
				CLASS_GRID_PREFIX = `${CLASS_GRIDS}-col`,
				CLASS_GRID_INC_PREFIX = `${CLASS_GRID_PREFIX}-increment`,
			CLASS_GRAPH = `${PREFIX}-graph`,
			CLASS_LINE_GRAPH = `${PREFIX}-line`,
				CLASS_ITEM = `${CLASS_GRAPH}-item`,
				CLASS_ITEM_BLOB = `${CLASS_ITEM}-shape`,
				CLASS_ITEM_STAMP = `${CLASS_ITEM}-text`,
				CLASS_POLYLINE = `${CLASS_ITEM}-link`,
			CLASS_LINE_FILL = `${CLASS_LINE_GRAPH}-fill`,
			CLASS_TEXTS = `${PREFIX}-text`,

		CLASS_CURSOR_STALKER = `${PREFIX}-cursor-stalker`,
		CLASS_TOOLTIP = `${PREFIX}-tooltip`,




	OPTIMAL_DEFAULT_DATA_COUNT = 9,
	OPTIMAL_SCALE_LOG_CONST = 10;
;


/*****************************************************************************
 * MAIN BITCH STARTS HERE
*****************************************************************************/

class DataVisualizer {
	constructor(selector,settings){
		if(!window.d3){
			return false;
		}
		const dv = this;

		dv.selector = selector;
		dv.elem = document.querySelector(selector);

		if(VaildateBrowser()){
			const error =  document.createElement('div');

			error.className = `${CLASS_BODY} ${CLASS_ERROR}`;
			error.innerHTML = 'Sorry, this graphic needs D3 to render the data but your browser does not support it.<br><br> Newer versions of Chrome, Edge, Firefox and Safari are recommended. <br><br>See <em><a target="_blank" rel="nofollow" href="https://d3-wiki.readthedocs.io/zh_CN/master/Home/#browser-platform-support">the official wiki</a></em> for more information';

			dv.elem.appendChild(error);
			throw new Error('D3 not supported by browser');
		}

		// fallback + validate color data
		// if color data key aint set put in name

		if(!dv._get(settings,'key.color')){ 
			settings.key.color = settings.key[0];

			//if legend was not fucked with we take the authority to kill legend
			if(!settings.colorLegend){
				settings.colorLegend = false;
			}
		};
		//valisate arwea key i guess
		// if(!dv._get(settings,'key.area')){
		// 	settings.key.area
		// }

		dv.#inpSet = settings;

		dv.isLoaded = false;

		dv.resizeInt = null;

		dv.load();
		
	}

	UiEl(elem){
		if(elem){
			this._resetUiEl(elem);
		}
		return this.elem;
	}

	_resetUiEl(elem){
		if(elem){
			this.elem = elem
		}else{
			throw new Error('Needs a valid element to reset component UI root element');
		}
	}

/*****************************************************************************
 * MAIN BITCH STARTS HERE
*****************************************************************************/

	#inpSet = false

	#data = {
		displayed: false,
		complete: false
	}


	get #is_debuggy(){
		return document.body.classList.contains('logged-in');;
	}

	static #deepGet(obj,stringedKeys, isNum){
		
		isNum = isNum || false;

		if(!stringedKeys){
			return
		}

		let splitString = stringedKeys.toString()
			.replace(/('|"|\s|\t|\n|\r)/g,'') //quotes and spaces
			.replace(/\[(.+?)\]/,'.$1') //brackets
			.split('.') //split
			;

			//remove mt
		splitString
			.forEach((key,i)=>{
				(key == '') && splitString.splice(i, 1);
			})
			;

		const
			multiIndex = (obj,is) => {
				var toReturn = null;
				// console.warn('init multi',obj,is,typeof obj);
				if(is.length > 0 && typeof obj === 'object'){ //if it gooes 0 u ded
					toReturn = multiIndex(obj[is[0]], is.slice(1));
				}else{
					toReturn = ( isNum == true ) ? parseFloat(obj) : obj;
				}
				return toReturn;
			},
	
			value = multiIndex(obj,splitString);
		
		if(isNum == true && isNaN(value)){
			console.warn(`data with the key source of '${stringedKeys}' was passed as numeric but is not.` )
		}
		// console.log(`%c final value to return from ${stringedKeys}: \n${value}`,"color: pink; font-family:sans-serif; font-size: 9px");
	
		return value;
	}

	_get(obj,stringedKeys,isNum){
		return DataVisualizer.#deepGet(obj,stringedKeys,isNum);
	}
	
	_is_base(types){
		let templates = [];

		if(typeof types === 'string'){
			templates.push(types)
		}else if(Array.isArray(types)){
			types.forEach(type=>{
				templates.push(type)
			});
		}

		let toReturn = false;

		templates.forEach(template=>{
			if(this.args('type').includes(`${template}`) && !toReturn){
				toReturn = true;
			}
		});

		return toReturn;
	}

	get _has_nested_data(){
		return !(
			( this.args('srcMultiple') && this._is_base('pie') )
		)
	};

	get _name_is_num(){
		return this.args('nameIsNum')
	}

	get _has_text(){

		if(
			!this.args('toolTip')
			&& (
				(
					this._is_base(['bar','line'])
					&& (
						!this.args('xTicks')
						|| !this.args('yTicks')
					)
				)
				|| (
					this._is_base('pie')
					&& (
						this.args('piLabelStyle')
						|| !this.args('colorLegend')
					)
				)
			)
		){
			return true;

		}else{
			return false;
		}

	}

	get _has_both_text() {

		if(
			this._has_text
			&& (
				(
					this._is_base(['bar','line','scatter'])
					&& (
						!this.args('xTicks')
						&& !this.args('yTicks')
					)
				)
				|| (
					this._is_base('pie')
					&& !this.args('colorLegend')
					&& this.args('piLabelStyle') !== null
				)
			)
		){
			return true;

		}else{
			return false;
		}

	}

	get _has_polyline(){
		return (
			this._is_base('pie') && this.args('piLabelStyle') == 'linked'
		);
	}

	get _has_tooltip(){
		return this.args('tooltipEnable');
	}

	_has_grid(axisName){
		return this._has_ticks(axisName) && this._has_axis_prop('grid',axisName);
	}

	_has_labels(axisName){
		return  this._has_ticks(axisName) && this._has_axis_prop('label',axisName);
	}

	_has_ticks(axisName){
		return this._has_axis_prop('ticks',axisName);
	}

	_has_axis_prop(property,axisName){
		if(property && !this._is_base('pie')){
			if(axisName){
				return this.args( Str.toCamelCase(`${axisName} ${property}`) );
			}else{
				return this.args(  Str.toCamelCase(`x ${property}`)  ) || this.args(  Str.toCamelCase(`y ${property}`)  )
			}
		}
	}

	#renderAG(classToAdd){
		const dv = this;
		dv.g
			.append('g')
			.attr('class',classToAdd);
	}

	#parseData(dataToParse){
		const dv = this;
		// heck if src key exists
		let toReturn;
		
		if (dv.args('srcKey')) {
			if(dv._get(dataToParse,dv.args('srcKey'))){
				toReturn = dv._get(dataToParse,dv.args('srcKey'));
			}else{
				renderError(`${dv.selector} provided source key is invalid`);
			}

		}else{
			toReturn = dataToParse
		}

		// convert to single level for easy AAAAAAAAA-ing
		if(dv.args('srcMultiple') == true && dv.args('srcPreNest')) {

				const arrPreNest = [],
					appendParentProp = (parentKey)=>{
					//add parent key to proops
					toReturn[parentKey].forEach(function(dis,i){
						toReturn[parentKey][i]._parent = parentKey;
						arrPreNest.push(toReturn[parentKey][i]);
					});
				}

				//if they are array
				if(Object.prototype.toString.call(toReturn) === '[object Array]'){

					toReturn.forEach((par,key)=>{
						appendParentProp(key);
					})

				//if they are kwan have keys
				}else{
					Object.keys(toReturn).forEach((key)=>{
						//add parent key to proops
						appendParentProp(key);
					})
				}

			toReturn = arrPreNest;
		}

		
		//filter data that has null value
		toReturn = toReturn.filter((dis,i)=>{

			let toInclude = true;

			DatumKeys.forEach((keyKey)=>{
				const setKey = dv.args(`key['${keyKey}']`);
				if(setKey && dv._get(dis,setKey) == null) {
					toInclude = false;
					if(dv.#is_debuggy){
						const humanForKey = keyKey == 0 ? 'name': keyKey == 1 ? 'value': keyKey;
						console.warn(`${dv.selector} datum index '${i}' was filtered.\ndatum does not have data for the key '${setKey}', which is set as the property for '${humanForKey}'`)
					}
				}
			});

			if(toInclude){
				return dis;
			}

		});
	
		//sort data 0 so that it doesnt go forward then backward then forward on the graph which is weird
		if(dv.args('nameIsNum') == true){
			
			const sortable = [];

			for(let i = 0 ;i < toReturn.length; i++){
				if(toReturn[i]){
					sortable.push(toReturn[i]);
				}
			}
			
			sortable.sort((a, b)=>{
				return dv._get(a,dv.args('key.0'),true) - dv._get(b,dv.args('key.0'),true);
			});

			toReturn = sortable;
		}


		if(!toReturn.length){
			dv.kill(`Data for ${dv.selector} was filtered and all items are invalid for visualizing. check provided data keys and make sure they are correct`)
		}

		return toReturn;
	}

	get drawnData(){
		return this.#data.displayed.length
			? this.#data.displayed
			: this.#data.complete;
	}

	set drawnData(data){
		this.#data.displayed = data;
	}

	get completeData(){
		return this.#data.complete;
	}

	set completeData(data){
		this.#data.complete = data;
	}

	static defaults(key){
		key = key || false;

		const settings = {
			//settings
				width: 600,
				height:600,
				margin: 40, 
				transition: 500,
				delay: 250,
				fontSize: '16px',

			// content
				title:'',
				description:'',

			//src
				srcType: '',
				srcPath: '',
				srcKey: null,
				srcMultiple: false,
				srcPreNest: false,

			//text
				textNameSize: .75,
				textValueSize: 1.25,
				textTicksSize: .75,
				textLegendSize: .75,

			// fields
				type: 'bar',
				nameIsNum: false,

			//keys
				key: {
					multiple: '_parent',
					0:0,
					1: 1,
					color: null,
					area: null,
				},

			//reverse
				reverse: {
					0: false,
					1: false,
					color: false,
					multiple: false,
					area:false,
				},

			//format
				// name
					format0Prepend: '',
					format0Append: '',
					format0Parameter: null,
					format0Divider: 1, //@TODO deprecate
				// value
					format1Prepend: '',
					format1Append: '',
					format1Parameter: null,
					format1Divider: 1, //@TODO deprecate
				// color
					formatColorPrepend: '',
					formatColorAppend: '',
					formatColorParameter: null,

			//scatterplot area
				areaMin: 10,
				areaMax: 20,
				areaOpacity: .8,

			//kulay
				colorBackground: '#eee',
				colorPalette : [],
				colorData: null,
				colorLegend: false,

			//x settings
				xData: 0,
				xAlign: 'bottom',
				xTicks: false,
				xLabel: null,
				xTicksAmount: null,
				xParameter: null,
				xMin: null,
				xMax: null,
				xGrid: false,
				xGridIncrement: 1,
				xPrepend: '',
				xAppend: '',
				xDivider: 1,

			//y settings
				yData: 1,
				yAlign: 'left',
				yTicks: false,
				yLabel: null,
				yTicksAmount: null,
				yParameter: null,
				yMin: null,
				yMax: null,
				yGrid: false,
				yGridIncrement: 1,
				yPrepend: '',
				yAppend: '',
				yDivider: 1,

			//bar
				barTextWithin: false,
				barGutter: .1,

			//line
				lineStyle: '',
				lineWeight: 1,
				lineColor: null,
				linePoints: false,
				lineFill: false,
				linePointsColor: null,
				linePointsSize: null,
				lineFillColor: null,
				lineFillInvert: false,
				lineFillOpacity: .5,
				lineDash: [100,0],

			//pi
				piLabelStyle: 'within',
				piInRadius: 0,

			//tooltip
				tooltipEnable: false,
				tooltipTextAlign: 'left',
				tooltipWidth: 'auto',
				tooltipDirection: 'n',
				tooltipDirectionParameter: null,
				tooltipContent: null,

			//2.0.0 new this.args. not implemented yet
				// multiple
					multipleDisplay: 'overlay', // single,versus,overlap
				//kulay
					colorBy: 'key', //set will influence key.color
				//advanced
					colorScheme: null,
		}

		return key
			? DataVisualizer.#deepGet(settings,key)
			: settings;
	}

	args(key){
		key = key || false;
		const settings = DeepValidate(DataVisualizer.defaults(),this.#inpSet);
		
		return key
			? DataVisualizer.#deepGet(settings,key)
			: settings;
	}

	get baseType(){
		const dv = this;
		let toReturn;

		BASE_TYPES.forEach(type=>{
			if(dv._is_base(type) && !toReturn){
				toReturn = type;
			}
		})

		return toReturn;
	}

	get fontSize(){
		return parseFloat(this.args('fontSize'));
	}

	get legendSize(){
		return this.args('textLegendSize') * this.fontSize * 2;
	}
	
	get margin(){
		const dv = this;

		return {
			top:	
				ValidMargin(dv.args('margin[0]'))
				|| ValidMargin(dv.args('margin'))
				|| 0,
			right: 	
				ValidMargin(dv.args('margin[1]'))
				|| ValidMargin(dv.args('margin[0]'))
				|| ValidMargin(dv.args('margin'))
				|| 0,
			bottom:	
				ValidMargin(dv.args('margin[2]'))
				|| ValidMargin(dv.args('margin[0]'))
				|| ValidMargin(dv.args('margin'))
				|| 0,
			left:	
				ValidMargin(dv.args('margin[3]'))
				|| ValidMargin(dv.args('margin[1]'))
				|| ValidMargin(dv.args('margin[0]'))
				|| ValidMargin(dv.args('margin'))
				|| 0,
		}
	}

	outer(dimension){
		let margins = [];

		if(dimension == 'width'){
			margins = ['left','right']
		}else{
			margins = ['top','bottom']
		}

		return this.args(dimension) + this.margin[ margins[0] ] + this.margin[ margins[1] ]
	}

	get outerWidth(){
		return this.outer('width');
	}

	get outerHeight(){
		return this.outer('height');
	}

	get duration(){
		if(!this.__trans){
			this.__trans = d3.transition()
				.duration( this.args('transition') )
				.ease(d3.easeLinear)
				;
		}
		return this.__trans;
		
	}

	interpolate(start,end,fn,d3fn){
		fn = fn || ((value,start,end)=>{ return value; });
		d3fn = d3fn || 'interpolate';

		const i = d3[d3fn](start,end);

		return ((t)=>{
			const interVal = i(t);
			return fn(interVal,start,end);
		})
	}

	createClass(classFallback,classForTrue,trueLogic,hasPrefix){
		classFallback = classFallback || '';
		classForTrue = classForTrue || false;
		trueLogic = trueLogic != false || trueLogic == true;
		hasPrefix = hasPrefix != false || hasPrefix == true;

		return `${(
			hasPrefix
				? `${PREFIX}-`
				: ''
		)}${(
			(trueLogic)
				? classForTrue
				: classFallback 
		)}`;
	}

	axisName(keyKey){
		const dv = this;
		if (keyKey == 0 || keyKey == 1){
			return (dv.args('xData') == keyKey) ? 'x' : 'y';
		}else{
			return keyKey;
		}
	}

	range(keyKey){
		const dv = this;
		const axisName = dv.axisName(keyKey);
		let toReturn = [];

		switch(keyKey){
			case 'color':
				toReturn = dv.args(`${keyKey}Palette`);
				break;

			case 'area':
				toReturn = [
					dv.args('areaMin'),
					dv.args('areaMax')
				];
				break;

			case 0:
			case 1:
				if(
					dv.args( `${ToOppoAxis(axisName)}Align` ) == 'top'
					|| dv.args( `${ToOppoAxis(axisName)}Align` ) == 'left'
				) {
					toReturn = [ 0, dv.args( ToSide(axisName) ) ];

				}else{
					toReturn = [ dv.args( ToSide(axisName) ) , 0 ];
				}
				break;
		}
		return toReturn;

	}

	domain(keyKey){
		const dv = this;
		const key = dv.args(`key['${keyKey}']`);
		let toReturn = [];

		if(key){

			// @TODO get deep into the anals of this for multiple data setup
			let
				dat = dv.theData(true);
	
			const axisName = dv.axisName(keyKey);
			const pushToDom = (d)=> {
					if(!toReturn.includes(dv._get(d, key ))){
						toReturn.push(dv._get(d, key ));
					}
				};
				
			switch(keyKey){
				case 'color':
						dat.forEach((dis)=>{
							pushToDom(dis);
						});
					break;

				case 'area':
				case 0:
				case 1:
					if(
						dv.args('nameIsNum') == true
						|| keyKey == 1
						|| keyKey == 'area'
					){
						let min,max;
						//min
							if(
								dv.args(`${axisName}Min`) !== null
								&& keyKey !== 'area'
							){
								min = dv.args(`${axisName}Min`);
							}else{
								min = d3.min(dat,(dis)=>{
									return dv._get(dis, key, true);
								});
							}

						//max
							if(
								dv.args(`${axisName}Max`) !== null
								&& keyKey !== 'area'
							){
								max = dv.args(`${axisName}Max`)
							}else{
								max = d3.max(dat,(dis)=>{
									return dv._get(dis, key, true);
								});
							}

						toReturn = [min,max];

						//if it a scatter plot we get nereast
						if(dv._is_base('scatter') && keyKey == 0){
							const newMin = GetNearest(min),
								newMax = GetNearest(max);
							toReturn = [newMin,newMax];
						}

					}else{
						//retains multiple instances
						toReturn = dat.map((dis)=>{
							return dv._get(dis, key, false);
						});

						//this dont
						dat.forEach((dis)=>{
							pushToDom(dis);
						});
					}

					if(dv.args(`reverse.${keyKey}`)) {
						// dont use .reverse because it's a piece of shit
						const reversed = [];

						for (let i = toReturn.length - 1; i >= 0; i--) {
							reversed.push(toReturn[i]);
						}

						toReturn =  reversed;
					}

					break;
			}
		}

			
		return toReturn;
	}

	scale(keyKey,dataToScale){
		dataToScale = dataToScale || false;
		const dv = this;
		let toReturn;

		const range = dv.range(keyKey);
		const domain = dv.domain(keyKey);

		switch(keyKey){

			case 'color':
				toReturn = d3.scaleOrdinal()
					.range(range) 
				break;

			case 'area':
			case 0:
			case 1:
				if(dv.args('nameIsNum') == true || keyKey == 1 || keyKey == 'area' ){
					if(dv.args('nameIsNum') == true && keyKey == 0 && dv._is_base('scatter')){
						toReturn = d3.scaleSymlog()
							.constant(OPTIMAL_SCALE_LOG_CONST)
							.range(range)
							.domain(domain)
							;

					}else{
						toReturn = d3.scaleLinear()
							.range(range)
							.domain(domain)
							;
					}
					
				}else{
					if(dv._is_base(['line','scatter'])){
						toReturn = d3.scalePoint() //scales shit to dimensios
							.range(range) // scaled data from available space
							.domain(domain) 
							;

					}else{
						toReturn = d3.scaleBand() //scales shit to dimensios
							.range(range) // scaled data from available space
							.domain(domain)
							.paddingInner(dv.args('barGutter')) //spacing between
							.paddingOuter(dv.args('barGutter'))
							;
					}
				}

				break;
				
		}
		
		return dataToScale
			? toReturn(dataToScale)
			: toReturn;
	}

	format(keyKey) {
		keyKey = Str.toCapitalize(keyKey.toString());
		const dv = this;
		let toReturn;
		
		if(typeof dv.args(`format${keyKey}Parameter`) === 'function' ) {
			toReturn = dv.args(`format${keyKey}Parameter`)

		}else if( typeof dv.args(`format${keyKey}Parameter`) === 'string' ) {
			toReturn = ((value,i)=>{
				return d3.format(args(`format${keyKey}Parameter`))(value)
			})

		}else{
			toReturn = ((value,i)=>{
				const
					divider = dv.args( `format${keyKey}Divider`),
					prepend = dv.args( `format${keyKey}Prepend`),
					append = dv.args( `format${keyKey}Append`),
					dataPossiblyDivided = 
						(keyKey == 1 || dv.args('nameIsNum') == true )
							? (value / divider)
							: value,
					formatted = `${prepend}${dataPossiblyDivided}${append}`;
				return formatted;
			})
		}

		return toReturn

	}

	Axis(axisName) {
		return new Axis(this,axisName);
	}

	get Tip() {
		return new Tip(this,CLASS_TOOLTIP);

	}

	Shape(dis,i){
		dis = dis || false;
		i = i || null;
		return new Shape(this,dis,i);
	}

	Pi(dis,i){
		dis = dis || false;
		i = i || null;
		return new Pi(this,dis,i);
	}

	Line(data){
		data = data || false;
		return new Line(this,data);
	}

	Label(axisName){
		const dv = this;
		
		return new Label(this,axisName);
		
	}

	theData(displayed,d3method){
		displayed = displayed || false;
		d3method = d3method || ''; //group,pie

		const dv = this;

		let toReturn = [];

		const data = displayed
			? dv.drawnData
			: dv.completeData
		;

		switch(d3method){
			case 'pie':
				const pie =  d3[d3method]()
					.sort(null)
					.value((dis)=>{
						return dv._get(dis,dv.args(`key[1]`),true)
					})
					;

				toReturn = pie(data);
				break;
			case 'group':
				if(dv.args('srcMultiple') == true){
					toReturn = d3[d3method](
						data,
						(dis)=>{
							return dis[ dv.args(`key['multiple']`)]
						}
					);

		
					//to array because its easier to deal with
					toReturn = Array.from(
						toReturn,
						([name, value]) => {
							return { parent: name, values: value }
						}
					)
					break;
				}
			default:
				toReturn = data;
		}

		return toReturn; 

	}

	get theUi(){
		return d3.select(this.selector);
	}

	kill(errorMessage){

		const dv = this;


		const errorFront = "Sorry, unable to display data." + (  dv.#is_debuggy ? "<br> Please check the console for more details" : '');

		dv.theUi.classed(`${CLASS_READY}`,true);

		if(!dv.theUi.select(`.${CLASS_BODY}.${CLASS_ERROR}`)){
			dv.theUi
				.append('div')
				.attr('class',`${CLASS_BODY} ${CLASS_ERROR}`)
				.html( errorFront );
		}
		console.error(errorMessage);
		return false;
	}
	

	renderHeader(){
		const dv = this;
		dv.theUi.
			append('div').lower()
			.attr('class',`${CLASS_HEADER}`)
			;

		if(dv.args('title')){
			dv.header
				.append('span')
				.attr('class',`${CLASS_TITLE}`)
				.text(dv.args('title'))
				;
		}

		if(dv.args('description')){
			dv.header
				.append('span')
				.attr('class',`${CLASS_DESCRIPTION}`)
				.text(dv.args('description'))
				;
		}

		dv.header
			.style('padding-top', () => {
				`${(dv.margin.top / dv.args('height')) * 50}%`
			})
			.style('padding-left', () => {
				`${(dv.margin.left / dv.outer('width')) * 100}%`
			})
			.style('padding-right', () => {
				`${(dv.margin.right / dv.outer('width')) * 100}%`
			})
			.transition(dv.duration)
			.styleTween('opacity',() => {dv.interpolate(0,1)})
			;

	}

	renderContent(){
		const dv = this;
		dv.theUi
			.append('div')
			.attr('class', `${CLASS_BODY}`)
			.style('position','relative')
			.style('padding-bottom',() => {
				return `${(( dv.outer('height') / dv.outer('width')) * 100)}%`;
			})
			.style('position','relative');

		//render the rest l8er so it dont get in the way of performance
		dv.addListeners(dv);

	}

	renderSVG() {
		const dv = this;

		dv.content
			.append('svg')
			.attr('class',`${CLASS_SVG}
				${dv.createClass('type')}-${dv.args('type')}
				${dv.createClass('base')}-${dv.baseType}
				${dv.createClass(
					'no',
					'has',
					(
						dv.args('colorPalette').length > 0
						|| dv.args('linePointsColor') !== null
						|| dv.args('lineColor') !== null
					),
				)}-palette

				${dv.createClass(
					'no',
					'has',
					(
						!dv._is_base('pie')
						&& (
							dv.args('xTicks')
							|| dv.args('yTicks')
						)
					)
				)}-palette

				${dv.createClass(
					'no',
					'has',
					( dv.args('colorLegend') )
				)}-legend

				${dv.createClass(
					`no-label`,
					`pi-label-style-${dv.args('piLabelStyle')}`,
					( dv.args('colorLegend') &&  dv.args('piLabelStyle') !== null )
				)}
			`)
			;

		dv.svg
			.attr('id',`${this.selector}-svg`)
			.style('position','absolute')
			.style('top','0')
			.style('left','0')
			.style('bottom','0')
			.style('right','0')
			.style('margin','auto')
			.attr('version','1.1')
			.attr('x','0px')
			.attr('y','0px')
			.attr('viewBox', `0 0 ${dv.outer('width')} ${dv.outer('height')}`)
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.attr('xml:space','preserve')
			.attr('width',dv.outer('width'))
			.attr('height',dv.outer('height'))
			;

		//container for bitches
		dv.svg
			.append('g')
			.attr('class',CLASS_G_CONTAINER)
			.attr('font-size',dv.args('fontSize'))
			.style('line-height',1)
			.attr('transform',`translate( ${dv.margin.left} , ${dv.margin.top} )`)
			

		dv._has_labels && dv.renderLabels();
		if(dv._has_ticks()){
			dv.renderRulers();
			dv._has_grid && dv.renderGrid();
		}

		dv.logStyleWarns();

		dv.draw();
			
	}

	renderLabels(){
		const dv = this;
		dv.#renderAG(CLASS_LABELS);

		Coordinates.forEach((axisName) => {
			if( dv._has_ticks(axisName) ) {

				dv.labels
					.append('text')
					.attr('class',`${CLASS_LABEL_PREFIX}-${axisName}`)
					.attr('y',() => {
						return dv.Label(axisName).offset('y');
					})
					.attr('x',() => {
						return dv.Label(axisName).offset('x');
					})
					.attr('font-size', '1em')
					.attr('text-anchor', 'middle')
					.attr('fill','currentColor')
					.attr('opacity',0)
					.text(dv.args(axisName+'Label'))
					.attr('transform',()=>{
						if(axisName == 'y'){
							return 'rotate(-90)';
						}
					})
					.transition(dv.duration)
					.attr('opacity',1);
					;
			}
		})
	}

	renderTicks(tickContainer,isGrid){
		isGrid = isGrid || false;

		if(!tickContainer){
			return
		}

		const dv = this;

		Coordinates.forEach((axisName) => {
			if( dv._has_ticks(axisName) ) {
				const alignString = dv.args(`${axisName}Align`);
				//ruler/grid
					tickContainer
						.append('g')
						.attr('class', `
							${dv.createClass(
								`${CLASS_RULER_PREFIX}-${axisName}`,
								`${CLASS_GRID_PREFIX}-${axisName}`,
								isGrid,false
							)}
							${dv.createClass(
								`${CLASS_RULER_ALIGN_PREFIX}-${alignString}`,
								`${CLASS_GRID_INC_PREFIX}-${dv.args(`${axisName}GridIncrement`)}`,
								isGrid,false
							)}
						`)
						.attr('transform',() =>{

							let transformCoord;
						
							switch( axisName+' '+alignString ) {
								case 'x bottom':
									transformCoord = `0 , ${dv.args('height')}`;
									break;
								case 'y right':
									transformCoord =  `${dv.args('width')} , 0`;
									break;
				
								default: 
									transformCoord = '0 , 0'
							}

							if(transformCoord) return 'translate('+transformCoord+')'
						})
						;
	
			}
		});
		
	}

	renderRulers(){
		const dv = this;
		dv.#renderAG(CLASS_RULERS);	
		dv.rulers
			.attr('font-size',dv.args('textTicksSize')+'em')

		dv.renderTicks(dv.rulers,false);
	}


	renderGrid(){
		const dv = this;
		dv.#renderAG(CLASS_GRIDS);
		dv.grid
			.attr('font-size',dv.args('textTicksSize')+'em')
			
		dv.renderTicks(dv.grid,true);
	}

	drawTooltip(){
		const dv = this;
		dv.svg
			.append('circle')
			.attr('class',`${CLASS_CURSOR_STALKER}`)
		dv.svg.call( dv.Tip.getCall() );
	}

	logStyleWarns(){
		const dv = this;

		if(dv.#is_debuggy){

			if(
				dv.args('width') == DataVisualizer.defaults('width')
				&& dv.args('height') == DataVisualizer.defaults('height')
				&& dv.completeData > OPTIMAL_DEFAULT_DATA_COUNT
			){
				
				console.debug(dv.selector+' Width and height was not adjusted. graph elements may not fit in the canvas');
			
			}else if(
				dv.args('width') < DataVisualizer.defaults('width')
				&& dv.args('height') < DataVisualizer.defaults('height')
			){

				console.debug(dv.selector+' set canvas width and or height may be too small.\n Tip: The given height and width are not absolute and act more like aspect ratios. svgs are responsive and will shrink along with content.');

			}

			if(
				(JSON.stringify(dv.args('margin')) == JSON.stringify(DataVisualizer.defaults('margin')))
				&& dv._has_labels()
				&& dv._has_ticks()
			){
				console.debug(dv.selector+' text may overlap. margins may need to be modified');
			}
		}
	}

	drawAxes(){
		const dv = this;
		Coordinates.forEach((axisName)=>{
			if(dv._has_ticks(axisName)){

				dv.ruler(axisName)
					.transition(dv.duration)
					.call( dv.Axis(axisName).getCall(false) )
					.attr('font-family',null)
					.attr('font-size',null);
				if(dv._has_grid(axisName)){
					dv.gridCol(axisName)
						.transition(dv.duration)
						.call( dv.Axis(axisName).getCall(true) );
					dv.gridCol(axisName).selectAll('g')
						.classed('grid',true)
						.filter((dis,i)=>{
							//IM HERE FUCKER
							let isAligned = false;
							dv.ruler(axisName).selectAll('g')
								.each((tik)=>{
									//if current looped tik matches dis grid data, add the class boi
									if(tik == dis){
										isAligned = true;
									};
								});

							return isAligned;
						})
						.classed('tick-aligned',true)
						;
				}

			}
		});
	}

	#drawGraphSet(classPrefix){
		const dv = this;

		const graphSet = dv.g
			.selectAll(`g.${classPrefix}`)
			.data(
				dv.readyData(),
				(dat)=>{ return dat.parent }
			)
			.enter()
				.append('g')
				.attr('class',(dat)=>{
					return `${classPrefix}
						${dv.createClass(
							'',
							`data-group-${dat.parent} ${classPrefix}-set`,
							(dat.parent && dat.key)
						)}`;
				}
				)
				.attr('transform',()=> {
					return dv._is_base('pie')
						? `translate( ${dv.Pi().offset('x')} , ${dv.Pi().offset('y')} )`
						: ''
				})
				;


			graphSet.exit()
				.transition(10) //DO NOT
				.style('opacity',0)
				.remove()
				;
	}

	drawGraph(){
		this.#drawGraphSet(CLASS_GRAPH);
	}

	drawText(){
		this.#drawGraphSet(CLASS_TEXTS);
	}

	readyData(){
		const dv = this;
		let toReturn;
		if(dv._has_nested_data){
			toReturn = dv.theData(true,'group');
		}else{
			//fake it so it still wiorks
			toReturn = [{
				parent:'flat',
				values: dv.theData(true)
			}]
		}

		return toReturn;
	}

	drawLineGraph(){
		const dv = this;
		dv.graphs
			.append('path').lower()
			.attr('class',
				`${CLASS_LINE_GRAPH}
				${dv.createClass(
					'no',
					'has',
					dv.args('lineColor') !== null
				)}-color`
			)
			.attr('fill','none')
			.attr('stroke-width',dv.args('lineWeight'))
			.attr('stroke-linejoin','round')
			.attr('stroke-dasharray',dv.args('lineDash'))
			.attr('stroke-opacity',1)
			.attr('stroke-dasharray','0,0')
			.attr('stroke',dv.args(`lineColor`))
			// .attr('d',getLinePath(false,false))
			.transition(dv.duration)
				.attrTween('d',function(dat){
					return dv.interpolate(
						dv.Line(dat.values).path(false,true),
						dv.Line(dat.values).path(false,false)
					)
				})
			;
		
		if(dv.args('lineFill')){
			dv.graphs
				.append('path').lower()
				.attr('class',
					`${CLASS_LINE_FILL}
					${dv.createClass(
						'no',
						'has',
						(
							dv.args(`lineFillColor`) !== null
							|| dv.args(`lineColor`) !== null
						)
					)}-color`
				)
				.attr('fill',
				dv.args(`lineFillColor`) || dv.args(`lineColor`))
				.attr('fill-opacity',dv.args(`lineFillOpacity`))
				.transition(dv.duration)
					.attrTween('d',function(dat){
						return dv.interpolate(
							dv.Line(dat.values).path(true,true),
							dv.Line(dat.values).path(true,false)
						)
					})
				;
		}
	}

	drawItemShapes(){
		const dv = this;

		const shape = dv.itemShapes
			.data((d)=>{
				return d.values
			});

		shape.exit()
			.transition(dv.duration)
			.style('opacity',0)
			.remove();

		const shape_enter = shape.enter()
			.append(dv.Shape().tag)
			.attr('class', (dis)=>{
				return `${CLASS_ITEM}
					${CLASS_ITEM_BLOB}
					data-name-${dv._get(dis,dv.args(`key[0]`))}
					`;
			})
			;

			//COORDINATE
			if(dv._is_base(['bar','line','scatter'])){
				shape_enter
					.attr(
						dv.Shape().coordAttr('x'),
						(dis,i)=>{
							return dv.Shape(dis,i).offset('x',true);
						}
					)
					.attr(
						dv.Shape().coordAttr('y'),
						(dis,i)=>{
							return dv.Shape(dis,i).offset('y',true);
						}
					)
					;
			}


			//SIZE N SHIT
			if(dv._is_base(['line','scatter'])){
				shape_enter
					.attr('r',(dis,i)=>{
						return dv.Shape(dis,i).radius(true);
					})
					;


			}else if(dv._is_base('bar')){
				shape_enter
					.attr('width',(dis,i)=>{
						return dv.Shape(dis,i).size('x',true)
					})
					.attr('height',(dis,i)=>{
						return dv.Shape(dis,i).size('y',true)
					})
					;
			}

			//FILL AND STROKE
			// render but not visible so that tooltip can work if needed
			if(dv._is_base('line') && !dv.args('linePoints')) {
				shape_enter
					.attr('opacity',0);
			}

		const shape_merge = shape.merge(shape_enter)
								
			//COORDINATES
			if(dv._is_base(['bar','line','scatter'])){
				shape_merge
					// .transition(dv.duration)
						.attr(
							dv.Shape().coordAttr('x'),
							(dis,i)=>{
								return dv.Shape(dis,i).offset('x');
							}
						)
						.attr(
							dv.Shape().coordAttr('y'),
							(dis,i)=>{
								console.log('luh',dv.Shape(dis,i).offset('y',false));
								return dv.Shape(dis,i).offset('y');
							}
						)
						;
			}

			//SIZE N SHIT
			if(dv._is_base(['line','scatter'])){
				shape_merge
					.transition(dv.duration)
						.attr('r',(dis,i)=>{
							return dv.Shape(dis,i).radius()
						})
						;


			}else if(dv._is_base('bar')){
				shape_merge
					.transition(dv.duration)
						
						.attr('width',(dis,i)=>{
							return dv.Shape(dis,i).size('x')
						})
						.attr('height',(dis,i)=>{
							return dv.Shape(dis,i).size('y')
						})
						;
			}

			//PETH
			if(dv._is_base('pie')){
				shape_merge
					.transition(dv.args(`transition`)) //DO NOT
						.attrTween('d',function(dis,i){
							dis.pie = dis.pie || dv.theData(true,'pie')[i];
							let currPie = dis.pie;
							
							return dv.interpolate(
								currPie.endAngle,
								currPie.startAngle,
								(value)=>{
									currPie.startAngle = value;
									return dv.Pi(dis,i).path(true);
								}
							)
						});
			}

			//tooltip
			if(dv.args(`tooltipEnable`)) { //@TODO updet 
				shape_merge
					// .on('mousemove',(dis)=>{
					// 		__calculated.tooltip.show(dis,renderCursorStalker(d3.event));
					// })
					// .on('mouseleave',__calculated.tooltip.hide);
			}
			
			//line  colors
			if(!dv.args(`colorPalette`).length){
				if(
					dv._is_base('line')
					&& (
						dv.args(`linePointsColor`)
						|| dv.args(`lineColor`)
					)
				) {
					shape_merge
						.attr('fill',() => {
							return dv.args(`linePointsColor`) || dv.args(`lineColor`);
						});

				}
			}else{
				shape_merge
					.attr('fill',(dis,i)=>{
						return dv.scale(`color`,dv._get(dis,`key.color`));
					});
					if(dv._is_base('scatter')){
						shape_merge
							.attr('fill-opacity',args.areaOpacity)
							.attr('stroke-width',1)
							.attr('stroke',(dis,i)=>{
								return dv.scale(dv._get(dis,`key.color`));
							})
					}
			}
	}
	
	drawItemStamps(){
		const dv = this;
		(dv._has_polyline) && dv.drawItemPolyline();
	}

	drawItemPolyline(){
		const dv = this;

		const poly = dv.itemPolyLine
			.data((d)=>{
				return d.values
			});
	}

	drawLegend(){
		
	}

	draw(data){
		const dv = this;

		data = data || dv.drawnData;

		dv.drawnData = data;

		// ok do the thing now
		dv.#is_debuggy && console.info(
			"\n",
			dv.selector,'('+dv.args('title')+')','-------------------------------------------------------------------',"\n",
			'calculated shit',dv,"\n",
			'data',dv.#data,"\n",
			'args',dv.args(),"\n",
			"\n"
		);


		/******** AXIS + GRID ********/
			if(dv._is_base(['bar','line','scatter'])){
				dv._has_ticks && dv.drawAxes();
			}
		/******** GRAP ********/
			dv.drawGraph();
		/******** TEK ********/
			dv.drawText();
		/******** LINE ********/
			if(dv._is_base('line')){
				dv.drawLineGraph()
			}

		
		/******** BLOBS ********/
			dv.drawItemShapes();
		/******** ITEM LABELS ********/
			dv._has_text && dv.drawItemStamps();
		/******** LEGEND ********/
			dv.args('colorLegend') && dv.drawLegend()
			

	}
	
	get header(){
		return this.theUi.select(`.${CLASS_HEADER}`);
	}

	get content(){
		return this.theUi.select(`.${CLASS_BODY}`);
	}

	get svg(){
		return this.content.select(`.${CLASS_SVG}`);
	}

		get g(){
			return this.svg.select(`.${CLASS_G_CONTAINER}`);
		}

			get labels(){
				return this.g.select(`.${CLASS_LABELS}`);
			}

				label(axis){
					if(axis){
						return this.labels.select(`.${CLASS_LABEL_PREFIX}-${axis}`);
					}else{
						return this.labels();
					}
				}

			get rulers(){
				return this.g.select(`.${CLASS_RULERS}`);
			}

				ruler(axis){
					if(axis){
						return this.rulers.select(`.${CLASS_RULER_PREFIX}-${axis}`);
					}else{
						return this.rulers();
					}
				}

			get grid(){
				return this.g.select(`.${CLASS_GRIDS}`);
			}

				gridCol(axis){
					if(axis){
						return this.grid.select(`.${CLASS_GRID_PREFIX}-${axis}`);
					}else{
						return this.grid;
					}
				}

		get graphs(){
			return this.g.selectAll(`.${CLASS_GRAPH}`);
		}

			get line(){
				return this.graphs.select(`.${CLASS_LINE_GRAPH}`);
			}

			get lineFill(){
				return this.graphs.select(`.${CLASS_LINE_FILL}`);
			}

			get lineFill(){
				return this.graphs.select(`.${CLASS_LINE_FILL}`);
			}

			get itemShapes(){
				return this.graphs.selectAll(`.${CLASS_ITEM_BLOB}`);
			}

			get itemPolyLine(){
				return this.graphs.selectAll(`.${CLASS_POLYLINE}`);
			}
			
		get texts(){
			return this.g.select(`.${CLASS_TEXTS}`);
		}

			get itemStamps(){
				return this.texts.selectAll(`.${CLASS_ITEM_TEXT}`);
			}

		get cursorStalker(){
			return this.svg.select(`.${CLASS_CURSOR_STALKER}`);

		}

	get tooltip(){
		return this.theUi.select(`.${CLASS_TOOLTIP}`);
	}


	load(){
		const dv = this;

		// data is embedded on the page oooooo
		if(dv.args('srcPath').indexOf(window.location.href) > -1){
			const jsonSelector = document.getElementById(Str.hash(dv.args('srcPath'))).innerHTML;
			
			if( Str.isValidJSONString(jsonSelector) ){
				const dataIsJSON = JSON.parse(jsonSelector);
				dv.init(dataIsJSON);
			}else{
				dv.kill('Data input may not be valid. Please check and update the syntax');
			}

		//o its not ok we normal now
		}else{
			switch( Str.fileExtension(dv.args('srcPath')) ) {
				case 'csv':
				case 'dsv':
				case 'tsv':
				case 'xml':
					d3[ Str.fileExtension(dv.args('srcPath')) ](
						dv.args('srcPath'),
						(d)=>{
							return d;
						})
							.then((retrievedData)=>{
								dv.init(retrievedData);
							})
							.catch((error)=>{
								dv.kill(error);
							}
					);
					break;
				
				default:
					d3.json(
						dv.args('srcPath'),
						(d)=>{
							return d;
						})
							.then((retrievedData)=>{
								dv.init(retrievedData);
							})
							.catch((error)=>{
								dv.kill(error);
							}
					);
					break;
			}
		}
	}

	init(retrievedData){
		const dv = this;
				
		dv.theUi
			.classed(
				`${CLASS_READY}
				${dv.createClass(
					'',
					'dark',
					ColorIsDark(dv.args('colorBackground'))
				)}`,
				true)
			.style('background-color',dv.args('colorBackground'))
			;

		//set data
		dv.completeData = dv.#parseData(retrievedData);

		dv.renderHeader();
		dv.renderContent();


	}

	addListeners(dv){
		dv = dv || this;
		window.addEventListener('scroll',dv.handlerScroll);
		window.addEventListener('resize',dv.handlerResize);
	}

	get handlerScroll(){
		const dv = this;

		return (e)=> {
			const graphPosition = dv.elem.getBoundingClientRect().top;
			if(graphPosition < (window.innerHeight * .5) && !dv.isLoaded) {
				dv.isLoaded = true;
				setTimeout(() => {
					dv.renderSVG();
					dv._has_tooltip && dv.drawTooltip();
				},dv.args('delay'));
			}
		}
	}

	get handlerResize(){
		const dv = this;

		return (e)=> {
			clearTimeout(dv.resizeInt);
			dv.resizeInt = setTimeout(() => {
				dv.draw();
			},300);
		}
	}


}

export default DataVisualizer;