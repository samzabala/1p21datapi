/*!
* 1point21 Data Vizualiser Version 1.2.0.2
* Render Script
* @license yes
* DO NOT EDIT min.js
* edit its corresponding unminified js file in /src instead
*/

/* DO NOT TOUCH I DEV ON THIS BOI I ENQUEUE THE MINIFIED ONE ANYWAY  :< */

"use strict";
((window,d3)=>{

	const _1p21 = window._1p21 || {};

	//track present bois
	_1p21.graphs = {};
		
	// function that is open to the pooblic. this initiates the speshal boi
	_1p21.dataVisualizer = (selector,arr)=>{

		/*****************************************************************************
		 * HELPERS
		*****************************************************************************/

			const coordinates = ['x','y'],

				//kwan has scales domains and shit
				datum_keys = [0,1,'color','area'], 

				//yeeee
				prefix = 'data-visualizer-',

				// get data but with aility to get down deep because we never know where the fuck the date will be at
				// @param obj : duh 
				// @param keystring : hooman provided object key string that is hopefully correct 
				// @param isNum : if the data is a number
				deepGet = (obj,keyString, isNum)=>{
					isNum = isNum || false;

					let splitString = keyString.toString().split('.');
						//remove empty instances because they just mess with the loop
						splitString.forEach((key,i)=>{
							(key == '') && splitString.splice(i, 1);
						});
	
				
	
					const
						multiIndex = (obj,is)=> {
		
							var toReturn = null;
		
							if(is.length){
								toReturn = multiIndex(obj[is[0]],is.slice(1));

							}else{
								toReturn = ( isNum == true ) ? parseFloat(obj) : obj;
							}
		
							return toReturn;
						},
						value = multiIndex(obj,splitString);
					
	
					if(isNum == true && isNaN(value)){
						console.warn(`${selector} data with the key source of '${keyString}' was passed as numeric but is not.` )
					}

					return value;
				},

				//merge defaults with custom
				deepValidate = (defaults,arr) => {

					const args = defaults;

					Object.keys(arr).forEach((prop,i)=>{

						//ha?
						if(prop == 'key' || prop == 'reverse'){
						// if(Object.prototype.toString.call(arr[prop]) == '[object Object]'){
							args[prop] = deepValidate(args[prop],arr[prop]);

						}else if(arr.hasOwnProperty.call(arr,prop)) {
							// Push each value from `obj` into `extended`
							args[prop] = arr[prop];
						}
					}); 

					return args;
				},

				//get the length attribute to associate with the axis bro
				getDimension = (axisString,opposite)=>{
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
				},

				// get the opposite boi for alignmeny purposes
				getOppoAxis = (axisString)=>{
					return (axisString == 'x') ? 'y' : 'x';
				},

				//d3 does not support ie 11. kill it
				isIE = () => {
					const ua = navigator.userAgent;
					return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1
				},

				//string helpers
					// duh
					strGetFileExtension = (str)=>{
						return str.split('.').pop();
					},
					
					// convert boi to 
					strGetHash = (str)=>{
						const url = str;
						const type = url.split('#');
						const hash = type[ (type.length - 1 )] || '';
						return hash;
					},

					strIsValidJSONString = (str)=>{
						try {
							JSON.parse(str);

						} catch (e) {
							return false;
						}

						return true;
					},

					strToCamelCase = (str)=>{
						return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index)=> {
							return index == 0 ? word.toLowerCase() : word.toUpperCase();
						}).replace(/\s+/g, '');
					},

					//is that bitch boi dark? thank u internet
					isDark = (color)=>{

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



		/*****************************************************************************
		 * END HELPERS
		*****************************************************************************/

		// this is where the bitches at
		const dataContainer = document.querySelector(selector);
		
		if(isIE()){
			const error =  document.createElement('div');

			error.className = `${prefix}wrapper fatality`;
			error.innerHTML = 'Sorry, this graphic needs D3 to render the data but your browser does not support it.<br><br> Newer versions of Chrome, Edge, Firefox and Safari are recommended. <br><br>See <em><a target="_blank" rel="nofollow" href="https://d3-wiki.readthedocs.io/zh_CN/master/Home/#browser-platform-support">the official wiki</a></em> for more information';

			dataContainer.appendChild(error);
			throw new Error('D3 not supported by browser');
		}

		//stor variables initiated after sucessful data call + parameter declaration set as something_`axis` so its easier to tell apart which shit is set by hooman and which one javascript sets up for hooman
		const _ = {};

		_.dv_container = dataContainer;

		//default params for hooman
		const defaults  = {
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
					format0Divider: 1,
				// value
					format1Prepend: '',
					format1Append: '',
					format1Parameter: null,
					format1Divider: 1,
				// color
					formatcolorPrepend: '',
					formatcolorAppend: '',
					formatcolorParameter: null,

			//kulay
				areaMin: 10,
				areaMax: 50,
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

			//2.0.0 new args. not implemented yet
				// multiple
					multipleDisplay: 'overlay', // dropdown, slider,movie
				//kulay
					colorBy: 'key', //set will influence key.color
				//advanced
					colorScheme: null,
		};
		
		const args = deepValidate(defaults,arr);

		/*****************************************************************************
		 * MAP BOOL PROPERTIES FOR LESS EXTENSIVE LOGICS
		*****************************************************************************/

			_.user_can_debug = document.body.classList.contains('logged-in');

			//if its one ob dis bos
			_.is_type = (types) => {

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
					if(args.type == template && !toReturn){
						toReturn = true;
					}
				});

				return toReturn;
			};
			

			_.has_text = (() => {

				if(
					!args.toolTip
					&& (
						(
							_.is_type(['bar','line'])
							&& (
								!args.xTicks
								|| !args.yTicks
							)
						)
						|| (
							_.is_type('pie')
							&& (
								args.piLabelStyle
								|| !args.colorLegend
							)
						)
					)
				){
					return true;

				}else{
					return false;
				}

			})();
		
			_.has_both_text_on_blob = (() => {

				if(
					_.has_text
					&& (
						(
							_.is_type(['bar','line','scatter'])
							&& (
								!args.xTicks
								&& !args.yTicks
							)
						)
						|| (
							_.is_type('pie')
							&& !args.colorLegend
							&& args.piLabelStyle !== null
						)
					)
				){
					return true;

				}else{
					return false;
				}

			})();

			//for calculating the height and offset for spacing on text elements by the blob items vertically. value is sum of both sides
			_.text_padding = 2.25;

		/*****************************************************************************
		 * END MAP BOOL PROPERTIES FOR LESS EXTENSIVE LOGICS
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getAxisString
		*****************************************************************************/

			const getAxisString = (key)=>{

				if (key == 0 || key == 1){
					return (args.xData == key) ? 'x' : 'y'

				}else{
					return key;
				}

			};

		/*****************************************************************************
		 * ENDFUNCTION: getAxisString
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getNearest
		*****************************************************************************/

			//get nearest power of tenth
			const getNearest = (num)=>{

				if(num > 10){
					return Math.pow(10, num.toString().length - 1) * 10;

				}else{
					return 1;
				}

			};

		/*****************************************************************************
		 * ENDFUNCTION: getNearest
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getRange
		*****************************************************************************/

			//set range of the bois
			// @param itemAtt : duh
			const getRange = (key)=>{

				let range = [];

				switch(key){
					case 'color':
						range = args[`${key}Palette`];
						break;

					case 'area':
						range = [args.areaMin,args.areaMax];
						break;

					case 0:
					case 1:
						if(
							args[ `${getOppoAxis( getAxisString(key))}Align` ] == 'top'
							|| args[ `${getOppoAxis( getAxisString(key))}Align` ] == 'left'
						) {
							range = [ 0, args[ getDimension(getAxisString(key)) ] ];

						}else{
							range = [ args[ getDimension(getAxisString(key)) ] , 0 ];
						}
						break;
				}
				return range;
			}

		/*****************************************************************************
		 * ENDFUNCTION: getRange
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getDomain
		*****************************************************************************/

			//set domain of the bois
			// @param itemAtt : duh
			// @param dat : ooh boi
			const getDomain = (keyKey,dat,dataGroupKey)=>{
				dataGroupKey = dataGroupKey || '';

				const keyString = args.key[ keyKey ],
					pushToDom = (d)=> {
						if(!domain.includes(deepGet(d, keyString ))){
							domain.push(deepGet(d, keyString ));
						}
					};

				// @TODO get deep into the anals of this for multiple data setup
				let domain = [];

				if(keyString){
					switch(keyKey){
						case 'color':
								dat.forEach((dis)=>{
									if(args.srcMultiple ) {
										dis.value.forEach((dit)=>{
											pushToDom(dit);
										})
									}else{
										pushToDom(dis);
									}
								});
							break;

						case 'area':
						case 0:
						case 1:
							if(
								args.nameIsNum == true
								|| keyKey == 1
								|| keyKey == 'area'
							){
								let min,max;
								//min
									if(
										args[`${getAxisString(keyKey)}Min`] !== null
										&& keyKey !== 'area'
									){
										min = args[`${getAxisString(keyKey)}Min`];

									}else{
										min = d3.min(dat,(dis)=>{
											if(args.srcMultiple){
												return d3.min(dis.value,(dit)=>{
													return deepGet(dit, keyString, true);
												});

											}else{
												return deepGet(dis, keyString, true);
											}
										});
									}

								//max
									if(
										args[`${getAxisString(keyKey)}Max`] !== null
										&& keyKey !== 'area'
									){
										max = args[`${getAxisString(keyKey)}Max`]

									}else{
										max = d3.max(dat,(dis)=>{
											if(args.srcMultiple){
												return d3.max(dis.value,(dit)=>{
													return deepGet(dit, keyString, true);
												});

											}else{
												return deepGet(dis, keyString, true);
											}
										});
									}

								domain = [min,max];

								//if it a scatter plot we get nereast
								if(_.is_type('scatter') && keyKey == 0){
									const newMin = getNearest(min),
										newMax = getNearest(max);
									domain = [newMin,newMax];
								}

							}else{

								if(args.srcMultiple){
									if(
										dataGroupKey !== ''
										&& dis.key == dataGroupKey
									) {
										domain = dat[dataGroupKey].value.map((dit)=>{
											return deepGet(dit, keyString, false);
										});

									}else{
										dat.forEach((dis)=>{
											dis.value.forEach((dit)=>{
												pushToDom(dit);
											})
										});
									}

								}else{
									domain = dat.map((dis)=>{
										return deepGet(dis, keyString, false);
									});
								}
							}

							if(args.reverse[keyKey]) {
								// dont use .reverse because it's a piece of shit
								const domainReverse = [];

								for (let i = domain.length - 1; i >= 0; i--) {
									domainReverse.push(domain[i]);
								}

								domain =  domainReverse;
							}

							break;
					}
				}
					
				return domain;
			};

		/*****************************************************************************
		 * ENDFUNCTION: getDomain
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getLabelOrigin
		*****************************************************************************/

			//AXIS STRING AND AXIS POSITION COORDINATES ARE VERY DIFFERENT THINGS U DUMB FUCK
			const getLabelOrigin = (coordinateAttribute,axisString)=>{ 
				let offset = 0;
				//x
					if(coordinateAttribute == 'x'){
						if(axisString == 'x'){
							offset = args[getDimension(axisString)] / 2;

						}else if(axisString == 'y'){
							offset = -(args[getDimension(axisString)] / 2)
						};
				//y
					}else{
						if(axisString == 'x'){
							if(args[`${axisString}Align`] == 'bottom'){
								offset = args[getDimension(axisString,true)]
								+ (_.margin.bottom * .875);

							}else{
								offset = -(_.margin.top * .875);
							}
						}else if(axisString == 'y'){
							if(args[`${axisString}Align`] == 'right'){
								offset = args[getDimension(axisString,true)]
									+ (
										(_.margin.right * .875)
										+ _.text_base_size
									);

							}else{
								offset = -(
									(_.margin.left * .875)
									- _.text_base_size
								)
							}
						};
					}
					
				return offset;
			}

		/*****************************************************************************
		 * ENDFUNCTION: getLabelOrigin
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getBlobSize
		*****************************************************************************/

			//width,height or radius boi
			const getBlobSize = (axisString,dis,i,initial)=>{
				initial = initial || false;

				const
					keyKey  =  args[`${axisString}Data`],
					oppositeAxisAlignment = args[`${getOppoAxis(axisString)}Align`];

				let dimension = 20;

				switch(args.type) {
					case 'pie': //eehhhh
						break;

					default:
						if(args.nameIsNum == true ||  keyKey  == 1){
							if(initial) {
								dimension = 0;

							}else{
								if(
									oppositeAxisAlignment == 'right'
									|| oppositeAxisAlignment == 'bottom'
								){
									dimension = args[getDimension(axisString)]
										- _[`the_${keyKey}`](
											deepGet(dis, args.key[ keyKey ] ,true)
										);

								}else{
									dimension = _[`the_${keyKey}`](
										deepGet( dis, args.key[ keyKey ] ,true )
									);
								}
							}

						}else{
							dimension = _[`the_${keyKey}`].bandwidth()
						}

						if(dimension < 0 ){
							dimension = 0;
						}
				}

				return dimension;
			}

		/*****************************************************************************
		 * ENDFUNCTION: getBlobSize
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getBlobRadius
		*****************************************************************************/

			//duh 
			const getBlobRadius = (dis,i,initial)=>{
				initial = initial || false;

				let radius = initial ? 0 : 2;

				if(!initial){
					if(_.is_type('line')){
						if(_.is_type('line') && args.linePointsSize){
							radius = args.linePointsSize
						}
						
					}else if(_.is_type('scatter') && args.key['area'] ){
						radius = _.the_area( deepGet(dis,args.key['area'],true) );
					}
				}

				return radius;
			}

		/*****************************************************************************
		 * ENDFUNCTION: getBlobRadius
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getBlobTextAnchor
		*****************************************************************************/

			//more confusion
			const getBlobTextAnchor = (dis,i)=>{
				
				let anchor = 'middle';

				if(_.is_type('pie')){
					//halat garo may magigibo akoo kani

				}else{
					if(args.yData == 0) {
						anchor = 'start';
					}

					coordinates.forEach((coordinate)=>{
						if(
							args[`${getOppoAxis(coordinate)}Data`] == 0
							&& args[`${getOppoAxis(coordinate)}Align`] == 'right'
						){
							anchor = 'end';
						}
					});
				}

				return anchor;
			}

		/*****************************************************************************
		 * ENDFUNCTION: getBlobTextAnchor
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getBlobTextBaselineShift
		*****************************************************************************/

			//pls do not ask me po this broke my brain i will not likely know what just happened
			const getBlobTextBaselineShift = (coordinateAttr,keyKey)=>{

				let shift = 0;

				if( _.has_both_text_on_blob ){
					if(
						coordinateAttr == 'y'
						&& _.has_both_text_on_blob
					){
						const
							full_height =
								_.text_base_size
								* (
									args.textNameSize
									+ args.textValueSize
									+ _.text_padding
								) // .5 margin top bottom and between text
						
						if( keyKey == 1){
							shift = (
								(
									(full_height  * -.5)
									+ ( (_.text_base_size * args.textValueSize) * .5)
									+ ( _.text_base_size )
								)
								/ (_.text_base_size * args.textValueSize)
							);

						}else{
							shift = (
								(
									(full_height * .5)
									- ( (_.text_base_size * args.textNameSize) * .5)
									- ( _.text_base_size )
								)
								/ (_.text_base_size * args.textNameSize)
							);
						}
					}
				}
				
				return `${shift}em`;
			}

		/*****************************************************************************
		 * ENDFUNCTION: getBlobTextBaselineShift
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getBlobTextOrigin
		*****************************************************************************/


			const getBlobTextOrigin = (coordinate,dis,i,initial)=>{
				initial = initial || false;
				//coordinate is influenced by the axis right now so this is the only time coordinate and axis is one and the same. i think... do not trust me on this
				
				const keyKey =  args[`${coordinate}Data`];
				let offset = 0;
				
				if(_.is_type('pie')){
					const customInitial = (() => {
							return (args.piLabelStyle == 'linked') ?  false : initial;
						})(),
						multiplier = (() => {

							let toReturn = 0;

							if(args.piLabelStyle == 'linked'){
								toReturn =  initial ? 1 : 2.5;

							}else{
								if(initial == false) {
									toReturn = 1;
								}
							}

							return toReturn;
						})(),
						calcWithInnerRadius = args.piLabelStyle == 'linked' ? false : true,
						orArr =  getArcPath( getPiData(i) ,calcWithInnerRadius,'centroid',multiplier,customInitial);
						offset = ( coordinate =='x') ? orArr[0] : orArr[1];

				}else{
					// offset by where the coordinates of the ends of the blob and axis alignment is at and spaces it by the dimensions of the text bitches
					const shiftPad = () => {

						let value = 0,
							multiplier = 1;

						if(!(initial || _.is_type('scatter'))){
							if(
								args[`${getOppoAxis(coordinate)}Align`] == 'bottom'
								|| args[`${getOppoAxis(coordinate)}Align`] == 'right'
							){
								multiplier = -1;
							}

							if( keyKey !== 0 && coordinate == 'x'){
								value = ((_.text_padding * .5) * _.text_base_size);
							}

							value *= multiplier;
						}

						return value;
					},

					// offset if text is outside of boundaries
					shiftArea = () => {
						let multiplier = 1,
							value = 0;

						if(!(initial || _.is_type('scatter'))) {
							if(
								(
									(_.is_type(['line','scatter']) || !args.barTextWithin)
									&& (
										args[`${getOppoAxis(coordinate)}Align`] == 'bottom'
										|| args[`${getOppoAxis(coordinate)}Align`] == 'right'
									)
								)
								|| (
									(_.is_type('bar') && args.barTextWithin)
									&& (
										args[`${getOppoAxis(coordinate)}Align`] == 'top'
										|| args[`${getOppoAxis(coordinate)}Align`] == 'left'
									)
								)
							){
								multiplier = -1;
							}

							if(
								keyKey !== 0
							){
								//smol boys dont need to shift for areas its... gonna be outside no matter whar
								if(
									coordinate == 'x'
								){

									if( 
										(_.is_type(['line','scatter']) || !args.barTextWithin)
										&& (
											parseFloat(getBlobSize(coordinate,dis,i))
											>= (args[getDimension(coordinate,true)] - _.m_length(coordinate,i))
										)
									){
										value = -_.m_length(coordinate,i);

									}else if(
										(_.is_type('bar') && args.barTextWithin)
										&& (
											parseFloat(getBlobSize(coordinate,dis,i))
											< _.m_length(coordinate,i)
										)
									){
										value = -getBlobSize(coordinate,dis,i);
									}

								}else{
									if(
										(
											(_.is_type(['line','scatter']) || !args.barTextWithin)
											&& (
												parseFloat(getBlobSize(coordinate,dis,i))
												>= (args[getDimension(coordinate,true)] - _.m_length(coordinate,i))
											)
										)
										|| (
											(_.is_type('bar') && args.barTextWithin)
											&& (
												parseFloat(getBlobSize(coordinate,dis,i))
												< _.m_length(coordinate,i)
											)
										)
									){
										value = _.m_length(coordinate,i) * -.5;
										
									}else{
										value = _.m_length(coordinate,i) * .5;
									}
								}
							}

							value *= multiplier;
						
						}
						
						return value;

					};

					if( keyKey  == 0 ) {
						offset = getBlobOrigin(coordinate,dis,i);
						if(_.is_type('bar')) {
							offset += getBlobSize(coordinate,dis,i) / 2;
						}

					}else{
						switch(args[getOppoAxis(coordinate)+'Align']){
							case 'top':
								if(!initial && _.is_type(['bar','line'])){
									offset = getBlobSize(coordinate,dis,i)
								}
								break;

							case 'right':
							case 'bottom':
								if(
									initial && _.is_type(['bar','line'])
									|| (args.barTextWithin && args[getOppoAxis(coordinate)+'Align'] == 'right')
								) {
									offset = args[getDimension(coordinate)];

								}else{
									offset = args[getDimension(coordinate)] - getBlobSize(coordinate,dis,i);
								}
								break;

							case 'left':
								if( _.is_type(['line','scatter']) ||  !args.barTextWithin ){
									if(!initial) {
										offset = getBlobSize(coordinate,dis,i);
									}
								}
								break;

						}

					}
					
					offset += shiftPad() + shiftArea();
					// offset += shiftArea();
					// offset += shiftPad();
				}
				
				return offset;
			}

		/*****************************************************************************
		 * ENDFUNCTION: getBlobTextOrigin
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getBlobOrigin
		*****************************************************************************/

		const getBlobOrigin = (coordinate,dis,i,initial)=>{
			initial = initial || false;

			// same here.. could be the same probably
			const keyKey =  args[ coordinate+'Data'],
				oppositeAxisAlignment = args[ getOppoAxis(coordinate)+'Align'];

			let offset = 0;

				if(_.is_type(['bar','line','scatter'])) {
					if( args.nameIsNum == true || keyKey == 1){
						if( oppositeAxisAlignment == 'right' || oppositeAxisAlignment == 'bottom' ){
							if(_.is_type(['bar','line']) && initial ){
								offset = args[getDimension(coordinate)];

							}else{
								offset = args[getDimension(coordinate)] - (args[getDimension(coordinate)] - _['the_'+ args[coordinate+'Data'] ]( deepGet(dis, args.key[ keyKey ], true )));
							}

						}else{
							if(_.is_type(['line','scatter'])){
								if(
									!initial
									|| _.is_type('scatter')
								){
									offset = _['the_'+ args[coordinate+'Data'] ]( deepGet(dis, args.key[ keyKey ], true ));
								}
							}
						}

					}else{
						offset = _['the_'+ args[coordinate+'Data'] ](deepGet(dis, args.key[ keyKey ], false));
						if(
							(_.is_type(['line','scatter']))
							&& !args.nameIsNum 
						) {
							offset += getBlobSize( coordinate ,dis,i) / 2;
						}
					}
				}

			return offset;
		}

		/*****************************************************************************
		 * ENDFUNCTION: getBlobOrigin
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getLegendOrigin
		*****************************************************************************/
			
			const getLegendOrigin = (axisString)=>{

				if( _.container_legend ){
					let offset = 0,
						length = axisString == 'x'
							? _.container_legend.nodes()[0].getBoundingClientRect()[getDimension(axisString)]
							: (_.legend_size * _.dom_color.length), // .8
					
					shifter = () => {
						let value = 0,
							multiplier = 1;

						//multiplier
						if (
							_.is_type(['pie'])
							|| (
								_.is_type(['bar','line','scatter'])
								&& args[getOppoAxis(axisString)+'Align'] == 'left'
								|| args[getOppoAxis(axisString)+'Align'] == 'top'
							)
						){
							multiplier = -1;
						}

						//how much of length to shift
						if (
							(_.is_type(['pie']) && axisString == 'x')
							|| (
								_.is_type(['bar','line','scatter'])
								&& args[getOppoAxis(axisString)+'Align'] == 'left'
								|| args[getOppoAxis(axisString)+'Align'] == 'top'
							)
						){
							value = length + _.text_base_size;

						} else if(  (_.is_type('pie') && axisString == 'y') ){
								value = length * .5;
						}
							
						return value * multiplier;
					};

					if (
						(_.is_type('pie') && axisString == 'x')
						|| 
						(
							_.is_type(['bar','line','scatter'])
							&& args[getOppoAxis(axisString)+'Align'] == 'left'
							|| args[getOppoAxis(axisString)+'Align'] == 'top'
						)
					){
						offset = args[getDimension(axisString)];

					}else if( (_.is_type('pie') && axisString == 'y') ){
						offset = args[getDimension(axisString)] * .5;
					}
					
					return offset + shifter();
				}
			}

		/*****************************************************************************
		 * ENDFUNCTION: getLegendOrigin
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getLinePath
		*****************************************************************************/

			const getLinePath = (isArea,initial)=>{

				const pathInitiator = isArea ? 'area' : 'line',
					axisToFill = ( args.xData == 0 )  ? 'x' : 'y',
					pathStyle = (() => {
						const theString = 'curveLinear';
						switch(args.lineStyle){
							case 'step':
								theString = 'curveStepBefore'
								break;
							case 'curve':
									theString = 'curveMonotone'+(axisToFill).toUpperCase()
									break;
						}
						return theString
					})(),
					
					path = d3[pathInitiator]();

				if(pathInitiator == 'area') {

					//name coord, value coord, fill coordinate
					const aCord = { //default is top
						name: axisToFill, //x
						value: getOppoAxis(axisToFill)+1, //y
						fill: getOppoAxis(axisToFill)+0 //initial of data name is the bottom of the fill
					};
					
					
					path
						[aCord.name]((dis,i)=>{
							return getBlobOrigin(axisToFill,dis,i,initial); 
						})
						[aCord.value]((dis,i)=>{
							return getBlobOrigin(getOppoAxis(axisToFill),dis,i,initial);
						})
						[aCord.fill]((dis,i)=>{
							return (
								args[`${axisToFill}Align` ]  == 'bottom'
								|| args[`${axisToFill}Align` ]  == 'right'
							) ? args[getDimension(axisToFill)] : 0;
						});

				}else{
					path
						.x((dis,i)=>{
							return getBlobOrigin('x',dis,i,initial);
						})
						.y((dis,i)=>{
							return getBlobOrigin('y',dis,i,initial);
						});

				}

				if(pathStyle){
					path.curve(d3[pathStyle]);
				}

				return path(_.data);
			}

		/*****************************************************************************
		 * ENDFUNCTION: getLinePath
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getArcPath
		*****************************************************************************/

			const getArcPath = (disPi,calcWithInnerRadius,subMethod,outerRadiusMultiplier,initial)=>{
				outerRadiusMultiplier = outerRadiusMultiplier || 1;
				subMethod = subMethod || '';
				calcWithInnerRadius = calcWithInnerRadius || false;
				initial = initial || false;

				const innerRadius = (() => {
					let toReturn = 0;

					if( calcWithInnerRadius ){
						toReturn = _.pi_radius * args.piInRadius;
					}

					return toReturn;
				})(),

				outerRadius = (() => {
					let toReturn = 0;

					if(!initial || ( initial && (outerRadiusMultiplier <=1 ) && calcWithInnerRadius == false )){
						toReturn = _.pi_radius * outerRadiusMultiplier;
					}

					return toReturn;
				})(),

				path = d3.arc()
					.outerRadius( outerRadius )
					.innerRadius( innerRadius );

				
				if(subMethod){
					return path[subMethod](disPi);

				}else{
					return path(disPi)
				}

			}

		/*****************************************************************************
		 * ENDFUNCTION: getArcPath
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getPiData
		*****************************************************************************/

			const getPiData = (i)=>{

				const pie =  d3.pie()
					.sort(null)
					.value((dis,i)=>{
						return deepGet(dis,args.key[1],true)
					});

					return pie(_.data)[i];
			}

		/*****************************************************************************
		 * ENDFUNCTION: getPiData
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getPiOrigin
		*****************************************************************************/

			const getPiOrigin = (axisString)=>{
				let offset = 0;

				if(args.colorLegend && axisString =='x'){
					offset = args[getDimension(axisString)] * .375;

				}else{
					offset  = (args[getDimension(axisString)] * .5);
				}

				return offset;
			}

		/*****************************************************************************
		 * ENDFUNCTION: getPiOrigin
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getMidAngle
		*****************************************************************************/

			const getMidAngle = (disPi)=>{
				return disPi.startAngle + (disPi.endAngle - disPi.startAngle)/2;
			}

		/*****************************************************************************
		 * ENDFUNCTION: getMidAngle
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getInterpolation
		*****************************************************************************/

			const getInterpolation = (start,end,fn,d3fn)=>{
				fn = fn || ((value,start,end)=>{ return value; });
				d3fn = d3fn || 'interpolate';

				const i = d3[d3fn](start,end);

				return ((t)=>{
					const interVal = i(t);
					return fn(interVal,start,end);
				})
			}

		/*****************************************************************************
		 * ENDFUNCTION: getInterpolation
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: setScale
		*****************************************************************************/

			const setScale = (keyKey)=>{
				
				let scale;

				switch(keyKey){

					case 'color':
						scale = d3.scaleOrdinal()
							.range(_['range_'+keyKey]) 
						break;

					case 'area':
					case 0:
					case 1:
						if(args.nameIsNum == true || keyKey == 1 || keyKey == 'area' ){
							if(args.nameIsNum == true && keyKey == 0 && _.is_type('scatter')){
								scale = d3.scaleSymlog()
									.constant(10)
									.range(_['range_'+keyKey]);

							}else{
								scale = d3.scaleLinear()
									.range(_['range_'+keyKey]);
							}
							
						}else{
							if(_.is_type(['line','scatter'])){
								scale = d3.scalePoint() //scales shit to dimensios
									.range(_['range_'+keyKey]) // scaled data from available space

							}else{
								scale = d3.scaleBand() //scales shit to dimensios
									.range(_['range_'+keyKey]) // scaled data from available space
									.paddingInner(args.barGutter) //spacing between
									.paddingOuter(args.barGutter);
							}
						}

						break;
						
				}
				
				return scale;
			};

		/*****************************************************************************
		 * ENDFUNCTION: setScale
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: renderAxisContainers
		*****************************************************************************/

			//generates lab_coord, rule_coord and rule_coord
			const renderAxisContainers = (axisString,containerObj,isGrid)=>{

				if( args[axisString+'Ticks']) {
					isGrid = isGrid || false;

					const alignString = args[axisString+'Align'],
						tickContainer = (isGrid ? 'grid_' : 'rule_')+axisString;

					// label
						if( args[axisString+'Label'] && !isGrid ){
							
							_['lab_'+axisString] = _.container_lab.append('text')
								.attr('class',`${prefix}label-${axisString}`)
								.attr('y',() => {
									return getLabelOrigin('y',axisString);
								})
								.attr('x',() => {
									return getLabelOrigin('x',axisString);
								})
								.attr('font-size', '1em')
								.attr('text-anchor', 'middle')
								.attr('fill','currentColor')
								.attr('opacity',0)
								.text(args[axisString+'Label']);

							if(axisString == 'y') {
								_['lab_'+axisString].attr('transform', 'rotate(-90)');
							}

							_['lab_'+axisString]
								.transition(_.duration)
								.attr('opacity',1);

						}

					//ruler/grid
						_[tickContainer] = containerObj.append('g')
							.attr('class', () => {

									let contClass = null;
			
									if(isGrid){
										contClass =
											`${prefix}grid-${axisString} grid-increment-${args[axisString+'GridIncrement']}`;
										
									}else{
										contClass =
											`${prefix}axis-${axisString} ${prefix}axis-align-${alignString}`;
									}
			
									return contClass;
			
								}
			
							);
			
							let transformCoord = '';
						
							switch( axisString+' '+alignString ) {
								case 'x bottom':
									transformCoord = '0,'+ args.height;
									break;
								case 'y right':
									transformCoord = args.width+',0';
									break;
				
								default: 
									transformCoord = '0,0'
							}
			
						_[tickContainer].attr('transform','translate('+transformCoord+')');

				}
			}

		/*****************************************************************************
		 * ENDFUNCTION: renderAxisContainers
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: setData
		*****************************************************************************/

			const setData = (dataToParse)=>{
				
				// heck if src key exists
				let toReturn = (() => {
					if (args.srcKey) {
						console.log(dataToParse,args.srcKey)
						if(deepGet(dataToParse,args.srcKey)){
							return deepGet(dataToParse,args.srcKey);
						}else{
							renderError(selector+' provided source key is invalid');
						}

					}else{
						return dataToParse
					}
				})();

				// convert to single level
				if(args.srcMultiple == true && args.srcPreNest) {

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

					const toInclude = true;

					datum_keys.forEach((keyKey)=>{
						if(args.key[keyKey] && deepGet(dis,args.key[keyKey]) == null) {
								// _.has[keyKey] = false;
							toInclude = false;
							if(_.user_can_debug){
								const humanForKey = keyKey == 0 ? 'name': keyKey == 1 ? 'value': keyKey;
								console.warn(`${selector} datum index '${i}' was filtered.\ndatum does not have data for the key '${args.key[keyKey]}', which is set as the property for '${humanForKey}'`)
							}
						}
					});

					if(toInclude){
						return dis;
					}

				});
			
				//sort data 0 so that it doesnt go forward then backward then forward on the graph which is weird
				if(args.nameIsNum == true){
					
					const sortable = [];

					for(let i = 0 ;i < toReturn.length; i++){
						if(toReturn[i]){
							sortable.push(toReturn[i]);
						}
					}
					
					sortable.sort((a, b)=>{
						return deepGet(a,args.key[0],true) - deepGet(b,args.key[0],true);
					});

					toReturn = sortable;
				}


				_.data_flat = toReturn;

				//nest it
				if(args.srcMultiple == true) {

					toReturn = d3.nest()
						.key((dis)=>{
							return dis[args.key['multiple']]
						})
						.rollup((v)=>{
							return v;
						})
						.entries( toReturn );
				}

				_.data = toReturn;
			}

		/*****************************************************************************
		 * ENDFUNCTION: setData
		*****************************************************************************/




		/*****************************************************************************
		 * FUNCTION: setAxis
		*****************************************************************************/

			const setAxis = (axisString,isGrid)=>{
				isGrid = isGrid || false;
				
				const axisKey = 'Axis '+ args[axisString+'Align'];
				var	axisToReturn = d3[strToCamelCase(axisKey)](_['the_'+ args[axisString+'Data']]);

				if(args[axisString +'Ticks']){
					if(_.is_type(['scatter']) && args[axisString+'Data'] == 0 && args.nameIsNum == true ){
						const tickValues = () => {
							const values = [],
								currVal = getDomain(0,_.data)[0];
							do{
								values.push(currVal);
								currVal *= 10;

							}while(currVal <= getDomain(1,_.data)[1]);

							return values;
						}

						axisToReturn.tickValues( tickValues() );
					}

					if(args[axisString +'TicksAmount']){
						
						const ticksAmount = () => {
							if( isGrid && args[axisString +'TicksAmount']  ){
								return args[axisString +'TicksAmount'] * args[axisString +'GridIncrement'];

							} else {
								return args[axisString +'TicksAmount']
							}
						};
						
						axisToReturn.ticks( ticksAmount() );
					};

					if(isGrid){
						axisToReturn
							.tickSize(-args[ getDimension( axisString,true ) ])
							.tickFormat("");

					}else {
						axisToReturn
							.tickFormat((dis,i)=>{
								return _['format_'+ args[axisString+'Data'] ](dis)
							})
					}
				}

				return axisToReturn;
			}

		/*****************************************************************************
		 * ENDFUNCTION: setAxis
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: renderCursorStalker
		*****************************************************************************/

			const renderCursorStalker = (d3_event)=>{
				return _.tooltip_cursor_stalker 
					.attr('cx',
						`${(
							d3_event.offsetX
							* ( _.outer_width / _.svg.node().clientWidth )
						)}px`
					)
					.attr('cy',
						`${(
							d3_event.offsetY
							* (  _.outer_height / _.svg.node().clientHeight )
						)}px`
					)
					.node();
			}

		/*****************************************************************************
		 * ENDFUNCTION: renderCursorStalker
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: renderTextWrap
		*****************************************************************************/

			const renderTextWrap = (text,width)=>{
				text.each(() => { //or use basic bitch function
					const text = d3.select(this),
						words = text.text().split(/\s+/).reverse()
						;
					let word,
						line = [],
						lineNumber = 0,
						lineHeight = 1.1, // ems
						y = text.attr("y"),c
						dy = parseFloat(text.attr("dy")),
						tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
					while (word = words.pop()) {
					  line.push(word);
					  tspan.text(line.join(" "));
					  if (tspan.node().getComputedTextLength() > width) {
						line.pop();
						tspan.text(line.join(" "));
						line = [word];
						tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
					  }
					}
				});
			}

		/*****************************************************************************
		 * ENDFUNCTION: renderTextWrap
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: renderError
		*****************************************************************************/

			const renderError = (theConsoleError,useThrow)=>{
				useThrow = useThrow || true;

				const errorFront = "Sorry, unable to display data." + (  _.user_can_debug ? "<br> Please check the console for more details" : '');

				d3.select(selector).classed(prefix+'initialized',true);

				if(!dataContainer.querySelector('.'+prefix+'wrapper.fatality')){
					d3.select(selector).append('div')
						.attr('class',prefix+'wrapper fatality')
						.html( errorFront );
				}

				if(!useThrow) {
					console.error(theConsoleError);

				}else{
					throw new Error(theConsoleError);
				}
			}

		/*****************************************************************************
		 * ENDFUNCTION: renderError
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: renderGraph
		*****************************************************************************/

			// fuck these bois up. pass data again in case changing data is a future feature
			const renderGraph = (incomingData)=> {
				// ok do the thing now
				_.user_can_debug && console.log(
					"\n",
					selector,'('+args.title+')','-------------------------------------------------------------------',"\n",
					'calculated shit',_,"\n",
					'data',incomingData,"\n",
					'args',args,"\n",
					"\n"
				)
				;

				datum_keys.forEach((keyKey)=>{

					//get domain
					_['dom_'+keyKey] = getDomain(keyKey,incomingData);

					//set that fucker
					if(_['the_'+keyKey] && _['dom_'+keyKey]) {
						_['the_'+keyKey].domain(_['dom_'+keyKey])
						;
					}
				});
					
				// axis + grid
					if(_.is_type(['bar','line','scatter'])){
						coordinates.forEach((coordinate)=>{
							if( args[coordinate+'Ticks'] ){
								_['rule_'+coordinate+'_axis'] = setAxis(coordinate);
										
								_['rule_'+coordinate]
									.transition(_.duration)
									.call( _['rule_'+coordinate+'_axis'] )
									.attr('font-family',null)
									.attr('font-size',null);
			
								if(args[coordinate+'Grid']){
								_['grid_'+coordinate+'_axis'] = setAxis(coordinate,true);
									
									_['grid_'+coordinate]
										.transition(_.duration)
										.call( _['grid_'+coordinate+'_axis'] );
										
									_['grid_'+coordinate].selectAll('g')
										.classed('grid',true)
										.filter((dis,i)=>{

											//IM HERE FUCKER
											let isAligned = false;
											_['rule_'+coordinate].selectAll('g').each((tik)=>{
												//if current looped tik matches dis grid data, add the class boi
												if(tik == dis){
													isAligned = true;
												};
											})
			
											return isAligned;
										})
										.classed('tick-aligned',true)
										;
								}
			
							}
						});
					}


				// //generate the graph bitches
					if(_.is_type(['bar','line','scatter'])){
						// line graph + fill
						if(_.is_type('line')){
							if(args.lineFill){
								_.fill = _.container_graph.selectAll('.'+prefix+'fill')
									.data([incomingData],(dis)=>{
										return deepGet(dis,args.key[0])
									});

									_.fill_exit = _.fill.exit()
										.transition(_.duration)
										.style('opacity',0)
										.remove();
									
									_.enter_fill = _.fill.enter()
										.append('path')
										.attr('class',prefix+'fill'+ ((args.lineFillColor !== null || args.lineColor !== null) ? ' has-color' : ' no-color' ))
										.attr('fill-opacity',args.lineFillOpacity)
										;

										if( args.lineFillColor || args.lineColor ) {
											_.enter_fill
												.attr('fill', args.lineFillColor || args.lineColor);
										}

									_.merge_fill = _.fill.merge(_.enter_fill)
										.transition(args.transition) //DO NOT
											.attrTween('d',() => {
												return getInterpolation(
													getLinePath(true,true),
													getLinePath(true,false)
												)
											})
										;

							}
							
							_.line = _.container_graph.selectAll('.'+prefix+'line')
								.data([incomingData],(dis)=>{
									return deepGet(dis,args.key[0])
								});

								_.line_exit = _.line.exit()
									.transition(_.duration)
									.style('opacity',0)
									.remove();

								_.enter_line = _.line.enter()
									.append('path')
									.attr('class',`${prefix}line ${((args.lineColor !== null) ? ' has-color' : ' no-color' )}`)
									.attr('fill','none')
									.attr('stroke-width',args.lineWeight)
									.attr('stroke-linejoin','round')
									.attr('stroke-dasharray',args.lineDash)
									.attr('stroke-opacity',1)
									.attr('stroke-dasharray','0,0')
									;


									if(args.lineColor) {
										_.enter_line
											.attr('stroke',args.lineColor)
									}

								_.merge_line = _.line.merge(_.enter_line)
									.transition(args.transition) //DO NOT
										.attrTween('d',() => {
											return getInterpolation(
												getLinePath(false,true),
												getLinePath(false,false)
											)
										})
										;
								
						}
					
					}

				//graph item : bars, scatter plots, pizza, points	
					_.blob = _.container_graph.selectAll(`${_.graph_item_element}.${prefix}graph-item.graph-item-blob`)
						.data(incomingData,(dis)=>{
							return deepGet(dis,args.key[0])
						});

			
					//blob exit
						_.blob.exit()
							.transition(_.duration)
							.style('opacity',0)
							.remove();

					//enter
						_.enter_blob = _.blob.enter()
							.append(_.graph_item_element)
								.attr('class', (dis)=>{
									return `${prefix}graph-item graph-item-blob data-name-${deepGet(dis,args.key[0])}`
								})
								;

								if(_.is_type(['bar','line','scatter'])){
									_.enter_blob
										.attr(
											(_.is_type(['line','scatter']) ? 'cx' : 'x'),
											(dis,i)=>{
												return getBlobOrigin('x',dis,i,true);
											}
										)
										.attr(
											(_.is_type(['line','scatter']) ? 'cy' : 'y'),
											(dis,i)=>{
												return getBlobOrigin('y',dis,i,true);
											}
										)
										;
										
										if(_.is_type(['line','scatter'])){
											_.enter_blob
												.attr('r',(dis,i)=>{
													return getBlobRadius(dis,i,true);
												})
												;
				
				
										}else if(_.is_type('bar')){
											_.enter_blob
												.attr('width',(dis,i)=>{
													return getBlobSize('x',dis,i,true)
												}) // _ width
												.attr('height',(dis,i)=>{
													return getBlobSize('y',dis,i,true)
												})
												;
										}
								}

							

					//merge
						_.merge_blob = _.blob.merge(_.enter_blob)
								
							//coordinates
							if(_.is_type(['bar','line','scatter'])){
								_.merge_blob
									.transition(_.duration)
										.attr(
											(_.is_type(['line','scatter']) ? 'cx' : 'x'),
											(dis,i)=>{
												return getBlobOrigin('x',dis,i,false);
											}
										)
										.attr(
											(_.is_type(['line','scatter']) ? 'cy' : 'y'),
											(dis,i)=>{
												return getBlobOrigin('y',dis,i,false);
											}
										)
										;
							}

							//areas and what not
							if(_.is_type('pie')){
								_.merge_blob
									.transition(args.transition) //DO NOT
										.attrTween('d',function(dis,i){
											dis._current = dis._current || getPiData(i);
											let theCurrent = dis._current;
											
											return getInterpolation(
												theCurrent.endAngle,
												theCurrent.startAngle,
												(value)=>{
													theCurrent.startAngle = value;
													return getArcPath(theCurrent,true);
												}
											)
										});
							}
							
							if(_.is_type(['line','scatter'])){
								_.merge_blob
									.transition(_.duration)
										.attr('r',(dis,i)=>{
											return getBlobRadius(dis,i,false)
										})
										;

								if(_.is_type('line') && !args.linePoints) {
									_.merge_blob
										.attr('fill-opacity',0)
										.attr('stroke-opacity',0);
								}
							}
							
							if(_.is_type('bar')){
								_.merge_blob
									.transition(_.duration)
										.attr('width',(dis,i)=>{
											return getBlobSize('x',dis,i,false)
										}) // _ width
										.attr('height',(dis,i)=>{
											return getBlobSize('y',dis,i,false)
										})
										;
							}

							//tooltip
							if(args.tooltipEnable) {
								_.merge_blob
									.on('mousemove',(dis)=>{
											_.tooltip.show(dis,renderCursorStalker(d3.event));
									})
									.on('mouseleave',_.tooltip.hide);
							}
							
							//line  colors
							if(!args.colorPalette.length){
								if(
									_.is_type('line')
									&& (
										args.linePointsColor
										|| args.lineColor
									)
								) {
									_.merge_blob
										.attr('fill',() => {
											return args.linePointsColor || args.lineColor;
										});

								}
							}else{
								_.merge_blob
									.attr('fill',(dis,i)=>{
										return _.the_color(deepGet(dis,args.key.color));
									});

									if(_.is_type('scatter')){
										_.merge_blob
											.attr('fill-opacity',args.areaOpacity)
											.attr('stroke-width',1)
											.attr('stroke',(dis,i)=>{
												return _.the_color(deepGet(dis,args.key.color));
											})
									}
							}

					
				//graph item label if ticks are not set
					if(_.has_text){

						//polyline 
						if(_.is_type('pie') && args.piLabelStyle == 'linked'){

							_.blob_text_link = _.container_graph.selectAll(`polyline.${prefix}graph-item.graph-item-link`)
								.data(incomingData,(dis)=>{
									return deepGet(dis,args.key[0])
								});

								//exit
									_.blob_text_link.exit()
										.transition(_.duration)
										.style('opacity','0')
										.remove();
								
								// enter
									_.enter_blob_text_link = _.blob_text_link
										.enter()
										.append('polyline')
										.attr('class',(dis)=>{
											return `${prefix}graph-item graph-item-link data-name-${deepGet(dis,args.key[0])}`;
										})
										.attr('stroke-opacity',.75)
										.attr('opacity',1)
										;

								// merge
									_.merge_blob_text_link = _.blob_text_link.merge(_.enter_blob_text_link)
										.transition(_.duration)
										.attrTween('points',(dis,i)=>{
											//in pie, initial means it starts at zero but we dont want that so dont set the initial to true
											const start = [
													getArcPath(getPiData(i),true,'centroid',1,false), //first coord is centroid of our pie boi
													getArcPath(getPiData(i),true,'centroid',1,false), // second is outer radius.
												],
												end = [

													getArcPath(getPiData(i),true,'centroid',1,false),
													getArcPath(getPiData(i),false,'centroid',2.25,false),
												];

											return getInterpolation(start,end);
										});

						}

						_.blob_text = _.container_graph.selectAll(`text.${prefix}graph-item.graph-item-text`)
							.data(incomingData,(dis)=>{
								return deepGet(dis,args.key[0])
							});

								//exit
									_.blob_text.exit()
										.transition(_.duration)
										.style('opacity','0')
										.remove();
										
								// enter
									_.enter_blob_text = _.blob_text
										.enter()
										.append('text')
										.attr('line-height',1.25)
										.attr('dominant-baseline','middle')
										.attr('transform',(dis,i)=>{
											const dataToUse = _.is_type('pie') ? getPiData(i) : dis;
											return `translate( ${getBlobTextOrigin('x',dataToUse,i,true)} , ${getBlobTextOrigin('y',dataToUse,i,true)} )`;
										})
										.style('opacity','0')
										;

									//append content right away so we can calculate where shit offset
									[0,1].forEach((keyKey)=>{

										if(
											(
												_.is_type(['bar','line','scatter'])
												&& !args[getAxisString(keyKey)+'Ticks']
											)
											|| (
												_.is_type('pie')
												&& (
													( keyKey == 0 && !args.colorLegend )
													|| ( keyKey == 1 && args.piLabelStyle !== null )
												)
											)
										){

											_['blob_text_'+keyKey] = _.enter_blob_text.append('tspan')

												.attr('class', (dis)=>{
													return `${prefix}graph-item-text-data-${keyKey} data-name-${deepGet(dis,args.key[0])}`
												} )
												.attr('dominant-baseline','middle')
												.attr('text-anchor',(dis,i)=>{
													return getBlobTextAnchor(dis,i);
												})
												.attr('font-size',() => {

													let toReturn = null;

													if(
														(
															_.is_type(['bar','line','scatter'])
															&& !args[ getOppoAxis ( getAxisString(keyKey) )+'Ticks']
														)
														|| (
															_.is_type('pie')
															&& !args.colorLegend
															&& args.piLabelStyle !== null
														)
													){
														if( keyKey == 0 ){
															toReturn = args.textNameSize+'em';

														}else{
															toReturn = args.textValueSize+'em';
														}	
													}

													return toReturn;
												})
												.attr('x',getBlobTextBaselineShift('x',keyKey))
												.attr('y',getBlobTextBaselineShift('y',keyKey))
												.attr('font-weight',() => {
													let toReturn = 700;

													if(
														(
															_.is_type(['bar','line','scatter'])
															&& !args[ getOppoAxis ( getAxisString(keyKey) )+'Ticks']
														)
														|| (
															_.is_type('pie')
															&& !args.colorLegend
															&& args.piLabelStyle !== null
														)
													){
														if( keyKey !== 0 ){
															toReturn = 300;
														}	
													}

													return toReturn;
												})
												.text((dis,i)=>{
													return _['format_'+ keyKey ]( deepGet(dis,args.key[ keyKey ]) );
												})

										}
										
									});

								// merge
									_.merge_blob_text = _.blob_text.merge(_.enter_blob_text);

									//commercial break
										//set a minimum length for graph items to offset its text bois. doesnt matter which data key is on the axis we just want the width or height of the graph item on the given axis
										// add padding for less math i think
										_.m_length = (axisString,i)=>{

											if(_.has_text && _.merge_blob_text){
												let value = 0;

												if( getDimension( axisString ) == 'width' ) {
													value = (
														_.merge_blob_text.nodes()[i]
															.getBBox()[ getDimension( axisString ) ]
													) + (
														_.text_padding
														* _.text_base_size
													);
												}else{
													value = (
														_.text_base_size
														* (
															args.textNameSize
															+ args.textValueSize
															+ _.text_padding
														)
													);
												}

												return parseFloat(value);
											}
										};


									_.merge_blob_text
										.attr('class', (dis,i)=>{
											let classString =  `${prefix}graph-item graph-item-text`;
											
											if( 
												(
													_.is_type('bar')
													&& (
														(
															args.barTextWithin
															&& (
																( // it out
																	(
																		parseFloat(getBlobSize(getAxisString(1),dis,i,false))
																		< _.m_length(getAxisString(1),i)
																	)
																	&& !isDark(args.colorBackground)
																)
																|| ( //it in
																	(
																		parseFloat(getBlobSize(getAxisString(1),dis,i,false))
																		>= _.m_length(getAxisString(1),i)
																	)
																	&& (args.colorPalette.length > 0)
																	&& !isDark( _.the_color(deepGet(dis,args.key.color)) )
																)
															)
														)
														|| (
															!args.barTextWithin
															&& (
																( // it out
																	(
																		(
																			parseFloat(getBlobSize(getAxisString(1),dis,i,false))
																			+ _.m_length(getAxisString(1),i)
																		) <=  args[getDimension(getAxisString(1))]
																	)
																	&& !isDark(args.colorBackground)
																)
																|| ( //it in
																	(
																		(
																			parseFloat(getBlobSize(getAxisString(1),dis,i,false))
																			+ _.m_length(getAxisString(1),i)
																		) > args[getDimension(getAxisString(1))]
																	)
																	&& (args.colorPalette.length > 0)
																	&& !isDark( _.the_color(deepGet(dis,args.key.color)) )
																)
															)
														)
													)
												)
												|| (
													_.is_type(['line','scatter'])
													&& !isDark(args.colorBackground)
												)
												|| (
													_.is_type('pie')
													&& (
														(
															args.piLabelStyle == 'within'
															&& (args.colorPalette.length > 0)
															&& !isDark( _.the_color(deepGet(dis,args.key.color)) )
														)
														|| (
															args.piLabelStyle == 'linked'
															&& !isDark(args.colorBackground)
														)
													)
												)
											){
												classString +=  ' dark';
											}else{

												classString +=  ' light';
											}

											return classString;
										})
										.attr('stroke',(dis,i)=>{
											if(
												(
													_.is_type('pie')
													&& args.piLabelStyle == 'within'
													&& args.colorPalette.length > 0
												)
												|| (
													_.is_type('bar')

													&& (
														(
															!args.barTextWithin
															&& (
																parseFloat(getBlobSize(getAxisString(1),dis,i))
																>= (args[getDimension(getAxisString(1),true)] - _.m_length(getAxisString(1),i))
															)
														)
														|| (
															args.barTextWithin
															&& (
																parseFloat(getBlobSize(getAxisString(1),dis,i))
																>= _.m_length(getAxisString(1),i)
															)
														) //@TODO this
													)
												)
											){
												return _.the_color(deepGet(dis,args.key.color))

											}else if(
												!_.is_type(['bar','pie'])
												|| (
													_.is_type(['pie'])
													&& args.piLabelStyle == 'linked'
												)
											){
												return args.colorBackground;
											}
										})
										.transition(_.duration)
											.attr('transform',(dis,i)=>{
												const dataToUse = _.is_type('pie') ? getPiData(i) : dis;
												return `translate( ${getBlobTextOrigin('x',dataToUse,i,false)} , ${getBlobTextOrigin('y',dataToUse,i,false)} )`;
											})
											.style('opacity',1);

						
					}

				//legends boi
				if(args.colorLegend){

						_.legend = _.container_legend.selectAll('g.'+ prefix+'legend-item')
							.data(_.dom_color);

							_.exit_legend = _.legend
								.exit()
								.transition(_.duration)
								.style('opacity','0')
								.remove();

							_.enter_legend = _.legend
								.enter()
								.append('g')
								.attr('class',prefix+'legend-item')
								.style('opacity','0');

							_.enter_legend
								.transition(_.duration)
								.style('opacity','1')

							_.enter_legend.append('rect')
								.attr('class','legend-item-blob')
								.attr('width',_.legend_size * .75)
								.attr('height',_.legend_size * .75)
								.attr('fill', (dis,i)=>{
									_.the_color(dis);
								})
								.attr('stroke',args.colorBackground);

							_.enter_legend.append("text")
								.attr('class','legend-item-text')
								.text((dis)=>{
									return dis;
								})
								.attr('dominant-baseline','middle')
								.attr('x', _.legend_size )
								.attr('y', _.legend_size * .375)
								.attr('stroke',args.colorBackground);

							_.merge_legend = _.legend.merge(_.enter_legend)
								
							_.merge_legend
								.transition(_.duration)
								.attr('transform', (dis,i)=>{
									return `translate(0, ${i *  _.legend_size})`;
								});


					_.container_legend
						.attr('transform',`translate( ${getLegendOrigin('x')} , ${getLegendOrigin('y')} )`)
				}



			}

		/*****************************************************************************
		 * ENDFUNCTION: renderGraph
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: init
		*****************************************************************************/

			//initialize a good boi
			const init = (retrievedData) => {
				
				//add initialized class so we know the boi been fucked na
				_.the_container = d3.select(selector);
				
				_.the_container.classed(`${prefix}initialized ${( isDark(args.colorBackground) ? `${prefix}dark` : '' )}` ,true )
					.style('background-color',args.colorBackground)

				_.data = null;

				//graph element
				switch(args.type){

					case 'bar':
						_.graph_item_element = 'rect';
						break;
					case 'pie':
						_.graph_item_element = 'path';
						break;
					case 'line':
					case 'scatter':

						_.graph_item_element = 'circle';
						break;

				}


			
				// relative to 1em supposedly idk
				_.text_base_size = parseFloat(args.fontSize);
				
				setData(retrievedData); 
					

				console.log(args.title,_.data);

				
				


				if( _.data.length > 0 ){

					// fallback + validate color data
					// if color data key aint set put in name
					if(!arr.key.color){ 
						args.key.color = args.key[0];

						//if legend was not fucked with we take the authority to kill legend
						if(!arr.colorLegend){
							args.colorLegend = false;
						}
					};


					// setup padding and sizes
					_.legend_size = (args.textLegendSize * parseFloat(args.fontSize) * 2);
					
					_.margin = {
						top:	
							typeof args.margin[0] === 'number'
								&& args.margin[0]
							|| typeof args.margin === 'number'
								&& args.margin
							|| 0,
						right: 	
							typeof args.margin[1] === 'number'
								&& args.margin[1]
							|| typeof args.margin[0] === 'number'
								&& args.margin[0]
							|| typeof args.margin === 'number'
								&& args.margin
							|| 0,
						bottom:	
							typeof args.margin[2] === 'number'
								&& args.margin[2]
							|| typeof args.margin[0] === 'number'
								&& args.margin[0]
							|| typeof args.margin === 'number'
								&& args.margin
							|| 0,
						left:	
							typeof args.margin[3] === 'number'
								&& args.margin[3]
							|| typeof args.margin[1] === 'number'
								&& args.margin[1]
							|| typeof args.margin[0] === 'number'
								&& args.margin[0]
							|| typeof args.margin === 'number'
								&& args.margin
							|| 0,
					};
					
					
					//add tooltipcontent function if there is none;

					_.tooltip_html = args.tooltipContent
						|| ((dis,i)=>{


							const html = `<div class="${prefix}tooltip-data">`;

							for (let prop in dis) {
								if (Object.prototype.hasOwnProperty.call(dis, prop)) {
									const propIsOutputted = false;

									if(typeof dis[prop] !== 'object'){

									
										html += `<div class="${prefix}tooltip-data-property">`;

											// label
											if(args.srcType !== 'row'){
												html += `<strong class="${prefix}tooltip-data-property-label">${prop}:</strong> `;
											}


									
											datum_keys.forEach((keyKey)=>{
												
												if(
													args.key[keyKey]
													&& args.key[keyKey].lastIndexOf(prop)  > -1
													&& _[`format_${keyKey}`]
													&& propIsOutputted == false
												){
													html += `<span class="${prefix}tooltip-data-property-content">${_[`format_${keyKey}`] (deepGet(dis,args.key[ keyKey ]) )} </span>`;
													propIsOutputted = true;
												}

											});

											if(propIsOutputted == false) {

												// content
												html += `<span class="${prefix}tooltip-data-property-content">${dis[prop]}</span>`;

											}
										
										
										html += '</div>';
									
									}
									
								}
							}

							html += '</div>';

							return html;
						});

					
					//set them dimensions
					_.outer_width = args.width + _.margin.left + _.margin.right;
					_.outer_height = args.height + _.margin.top + _.margin.bottom;




					d3.select(selector).append('div').lower()
						.attr('class',`${prefix}heading`);
					
					_.heading_sel = d3.select(selector).select(`div.${prefix}heading`);

						if(args.title){
							_.heading_title = _.heading_sel.append('span')
							.attr('class',`${prefix}title`)
							.text(args.title)
						}

						if(args.description){
							_.heading_description = _.heading_sel.append('span')
							.attr('class',`${prefix}description`)
							.text(args.description)
						}

					_.heading_sel
						.style('padding-top', () => {
							`${(_.margin.top / args.height) * 50}%`
						})
						.style('padding-left', () => {
							`${(_.margin.left / _.outer_width) * 100}%`
						})
						.style('padding-right', () => {
							`${(_.margin.right / _.outer_width) * 100}%`
						})
						.transition(_.duration)
						.styleTween('opacity',() => {getInterpolation(0,1)});
				
					_.canvas = d3.select(selector)
						.append('div')
						.attr('class', `${prefix}wrapper`)
						.style('position','relative')
						.style('padding-bottom',() => {
							return `${(( _.outer_height / _.outer_width) * 100)}%`;
						})
						.style('position','relative');

					const dimensionString = `0 0 ${_.outer_width} ${_.outer_height}`;
					
					//check if its scrolled on the place it should be at
					_.dv_init = false;
					
					document.addEventListener('scroll',(e)=>{
						const graphPosition = dataContainer.getBoundingClientRect().top;
						if(graphPosition < (window.innerHeight * .5) && !_.dv_init) {
							_.dv_init = true;
							
							setTimeout(() => {

								_.svg = _.canvas.append('svg')
									.attr('id',`${selector}-svg`)
									.style('position','absolute')
									.style('top','0')
									.style('left','0')
									.style('bottom','0')
									.style('right','0')
									.style('margin','auto')
									.attr('version','1.1')
									.attr('x','0px')
									.attr('y','0px')
									.attr('class',
										`${prefix}svg`

										+ ` ${prefix}type-${args.type}`
										
										+ ` ${prefix}${(
												(
													args.colorPalette.length > 0
													|| args.linePointsColor !== null
													|| args.lineColor !== null
												)
													? 'has'
													: 'no' 
											)}-palette`

										+ ` ${prefix}${(
												(
													_.is_type('pie')
													&& !args.xTicks
													&& !args.yTicks
												)
													? 'no'
													: 'has'
											)}-ticks`

										+ ` ${prefix}${(
												(args.colorLegend )
													? 'no'
													: 'has'
											)}-legend`
											
										+ ` ${(
												(_.is_type('pie') && args.piLabelStyle !== null)
													? ` ${prefix}pi-label-style-${args.piLabelStyle}`
													: ` ${prefix}no-label`
											)}`
									)
									.attr('viewBox', dimensionString)
									.attr('preserveAspectRatio', 'xMidYMid meet')
									.attr('xml:space','preserve')
									.attr('width',_.outer_width)
									.attr('height',_.outer_height)
									;

									
								//duration
								_.duration = _.svg.transition()
									.duration( args.transition )
									.ease(d3.easeLinear);
									
								_.container = _.svg.append('g')
									.attr('class',`${prefix}svg-wrapper`)
									.attr('font-size',args.fontSize)
									.style('line-height',1)
									.attr('transform',`translate( ${_.margin.left} , ${_.margin.top} )`);


								//tooltip
								if(args.tooltipEnable) {

									
									_.svg.append('circle')
										.attr('class',prefix+'cursor-stalker')
										// .attr('r',10)
										// // .style('opacity',0)
										// .attr('fill','red');

									_.tooltip_cursor_stalker = _.svg.select(`circle.${prefix}cursor-stalker`)

									_.tooltip = d3.tip()
										.attr('class',prefix+'tooltip')
										.style('width', () => {
											if(typeof args.tooltipWidth === 'number'){
												return `${parseFloat(args.tooltipWidth)}px`;
											}else if(args.tooltipWidth == 'auto'){
												return args.tooltipWidth;
											}
										})
										.style('text-align',args.tooltipTextAlign)
										.direction(args.tooltipDirectionParameter || args.tooltipDirection)
										.html(_.tooltip_html)

									_.svg.call(_.tooltip);
								}

								//@TODO multiple here

								
								if(_.is_type('pie')){
									//radius boi
									_.pi_radius = (() => {
										let value = Math.min((args.width * .5),(args.height * .5));
					
										if(args.colorLegend){
											value -= (value * .25)
										}
										
										if( args.piLabelStyle == 'linked' ){
											value -= (value * .25)
										}
					
										return value;
									})();

								}else{

									// container for labels
									_.container_lab = _.container.append('g')
										.attr('class', prefix + 'label');
						
									// container for axis
									_.container_rule = _.container.append('g')
										.attr('class', prefix + 'axis')
										.attr('font-size',args.textTicksSize+'em');
										
									//kung may grid gibo kang grid
									if( args.xGrid || args.yGrid ){
										_.container_grid = _.container.append('g')
										.attr('class', prefix + 'grid')
										.attr('font-size',args.textTicksSize+'em');
									}
								}


								//create container for graph
								_.container_graph = _.container.insert('g')
									.attr('class',
										prefix + 'graph'
									);

								//style warns
								if(_.user_can_debug){
									if(
										args.width == defaults.width
										&& args.height == defaults.height
										&& _.data.length > 9
									){
										
										console.warn(selector+' Width and height was not adjusted. graph elements may not fit in the canvas');
									
									}else if(
										args.width < defaults.width
										&& args.height < defaults.height
									){

										console.warn(selector+' set canvas width and or height may be too small.\n Tip: The given height and width are not absolute and act more like aspect ratios. svgs are responsive and will shrink along with content.');

									}

									if(
										(JSON.stringify(args.margin) == JSON.stringify(defaults.margin))
										&& (args.xLabel || args.yLabel)
										&& (args.xTicks || args.yTicks)
									){
										console.debug(selector+' text may overlap. margins may need to be modified');
									}
								}

								//offset graph for pie because its origin is in the center. right in the heart :'>
								if(_.is_type('pie')){
									_.container_graph
										.attr('transform','translate('+ getPiOrigin('x') +','+ getPiOrigin('y') +')');
								}

								if(args.colorLegend){
									_.container_legend = _.container.append('g')
										.attr('class',prefix+'legend')
										.attr('font-size', args.textLegendSize+'em');
								}
								

								if(args.srcMultiple){

								}else{


									// scales and shit
									datum_keys.forEach((keyKey)=>{

										//range
										_['range_'+keyKey] = getRange(keyKey);

										//scale
										_['the_'+keyKey] = setScale(keyKey);

										//formatting of data on the graph
										_['format_'+keyKey] = (() => {
											
											if(typeof args['format'+keyKey+'Parameter'] === 'function' ) {
												return args['format'+keyKey+'Parameter']

											}else if( typeof args['format'+keyKey+'Parameter'] === 'string' ) {
												return ((value)=>{
													return d3.format(args['format'+keyKey+'Parameter'])(value)
												})

											}else{
												return ((value)=>{
													const
														divider = args[ `format${keyKey.toString().toUpperCase()}Divider`],
														prepend = args[ `format${keyKey.toString().toUpperCase()}Prepend`],
														append = args[ `format${keyKey.toString().toUpperCase()}Append`],
														dataPossiblyDivided = 
															(keyKey == 1 || args.nameIsNum == true )
																? (value / divider)
																: value,
														formatted = prepend + dataPossiblyDivided + append;

													return formatted;
												})
											}
										})();

										switch(keyKey){

											case 0:
											case 1:

												renderAxisContainers(getAxisString(keyKey),_.container_rule)
												
												if(args[getAxisString(keyKey)+'Grid']) {
													renderAxisContainers(getAxisString(keyKey),_.container_grid,true)
												}

											case 'color':
												//colors kung meron
												if(args.colorPalette.length) {
													break;
												}
												
											default:
												
											
										}


									});

									
									renderGraph(_.data);
								}
								
								// _.resize = null;

								_1p21.graphs[selector] = {data:_.data,calcuated:_};

								window.addEventListener("resize", () => {
									clearTimeout(_.resize);
									_.resize = setTimeout(() => {
										if(args.srcMultiple){

										}else{
											renderGraph(_.data);
										}
									},300);
								});
								
							},args.delay);

						}
					},true);
				}else{
					renderError('Data for '+selector+' was filtered and all items are invalid for visualizing. check provided data keys and make sure they are correct');
				}
			}

		/*****************************************************************************
		 * ENDFUNCTION: init
		*****************************************************************************/





		/*****************************************************************************
		 * GETREADY TO USE ALL OF THEM FUCKHOLES
		*****************************************************************************/

		window.addEventListener('DOMContentLoaded',() => {

			//data is embedded on the page oooooo
			if(args.srcPath.indexOf(window.location.href) > -1){
				const jsonSelector = document.getElementById(strGetHash(args.srcPath)).innerHTML;
				
				if( strIsValidJSONString(jsonSelector) ){

					const dataIsJSON = JSON.parse(jsonSelector);
					init(dataIsJSON);
				}else{
					renderError('Data input may not be valid. Please check and update the syntax');
				}

			//o its not ok we normal now
			}else{
				switch( strGetFileExtension(args.srcPath) ) {
					case 'csv':
					case 'dsv':
					case 'tsv':
					case 'xml':
						d3[ strGetFileExtension(args.srcPath)](args.srcPath,(d)=>{
								return d;
							})
							.then(init)
							.catch((error)=>{
								renderError(error,false);
							});
						break;
					
					default:
						d3.json(args.srcPath,(d)=>{
								return d;
							})
							.then(init)
							.catch((error)=>{
								renderError(error,false);
							});
						break;
				}
			}
		})

		

	}

	window._1p21 = _1p21;
	
})(window,d3);