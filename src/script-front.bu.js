


((window,d3)=>{

	const _1p21 = window._1p21 || {};

	//track present bois
	_1p21.graphs = {};
		
	// function that is open to the pooblic. this initiates the speshal boi
	_1p21.dataVisualizer = (selector,arr)=>{

		/*****************************************************************************
		 * HELPERS
		*****************************************************************************/

			const
				//sana 2d lang
					COORDINATES = ['x','y'],

				//kwan has scales domains and shit
					DATUM_KEYS = [0,1,'color','area'], 

				//yeeee
					PREFIX = 'dv-',

				//for calculating the height and offset for spacing on text elements by the shape items vertically. value is sum of both sides
					TEXT_PADDING = 2.25,

				// get data but with aility to get down deep because we never know where the fuck the date will be at
				// @param obj : duh 
				// @param keystring : hooman provided object key string that is hopefully correct 
				// @param isNum : if the data is a number
					__calculated.#_get = (obj,keyString, isNum) => {
						isNum = isNum || false;

						let splitString = keyString.toString().split('.');

						//remove empty instances because they just mess with the loop
						splitString.forEach((key,i)=>{
							(key == '') && splitString.splice(i, 1);
						});
							
						const
							multiIndex = (obj,is) => {
			
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
							console.warn(`${dv.selector} data with the key source of '${keyString}' was passed as numeric but is not.` )
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
						ToSide = (axisString,opposite) => {
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
						ToOppoAxis = (axisString)=>{
							return (axisString == 'x') ? 'y' : 'x';
						},

					//d3 does not support ie 11. kill it
						VaildateBrowser = () => {
							const ua = navigator.userAgent;
							return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1
						},
						Str = {

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
								}
						},

						//is that bitch boi dark? thank u internet
						ColorisDark = (hexString)=>{

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
						};



		/*****************************************************************************
		 * END HELPERS
		*****************************************************************************/

		// this is where the bitches at
		const dataContainer = document.querydv.Selector(dv.selector);
		
		if(VaildateBrowser()){
			const error =  document.createElement('div');

			error.className = `${PREFIX}wrapper fatality`;
			error.innerHTML = 'Sorry, this graphic needs D3 to render the data but your browser does not support it.<br><br> Newer versions of Chrome, Edge, Firefox and Safari are recommended. <br><br>See <em><a target="_blank" rel="nofollow" href="https://d3-wiki.readthedocs.io/zh_CN/master/Home/#browser-platform-support">the official wiki</a></em> for more information';

			dataContainer.appendChild(error);
			throw new Error('D3 not supported by browser');
		}

		//stor variables initiated after sucessful data call + parameter declaration set as something_`axis` so its easier to tell apart which shit is set by hooman and which one javascript sets up for hooman
		const __calculated = {};

		__calculated.elem = dataContainer;
		__calculated.pi_angle_start = {};

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

			//2.0.0 new args. not implemented yet
				// multiple
					multipleDisplay: 'overlay', // single,versus,overlap
				//kulay
					colorBy: 'key', //set will influence key.color
				//advanced
					colorScheme: null,
		};
		
		const args = deepValidate(defaults,arr);

		/*****************************************************************************
		 * MAP BOOL PROPERTIES FOR LESS EXTENSIVE LOGICS
		*****************************************************************************/

			__calculated.is_debuggy = document.body.classList.contains('logged-in');

			//if its one ob dis bos
			__calculated.is_base = (types) => {

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

			__calculated.has_nested_data = (() => {
				return !(
					( args.srcMultiple && __calculated.is_base('pie') )
				)
			})();
			

			__calculated.has_text = (() => {

				if(
					!args.toolTip
					&& (
						(
							__calculated.is_base(['bar','line'])
							&& (
								!args.xTicks
								|| !args.yTicks
							)
						)
						|| (
							__calculated.is_base('pie')
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
		
			__calculated.has_both_text = (() => {

				if(
					__calculated.has_text
					&& (
						(
							__calculated.is_base(['bar','line','scatter'])
							&& (
								!args.xTicks
								&& !args.yTicks
							)
						)
						|| (
							__calculated.is_base('pie')
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

		/*****************************************************************************
		 * END MAP BOOL PROPERTIES FOR LESS EXTENSIVE LOGICS
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: theData
		*****************************************************************************/

			const theData = (mode,dataSet)=>{
				mode = mode || 'flat'; //could be nested
				dataSet = dataSet || 'complete';

				let toReturn = [];

				if(
					mode == 'nested'
					&& args.srcMultiple == true
				){
					toReturn   = d3.group(
						__calculated.data[dataSet],
						(dis)=>{
							return dis[args.key['multiple']]
						}
					);

					//to array because its easier to deal with
					toReturn = Array.from(toReturn, ([name, value]) => ({ parent: name, values: value }))




					// toReturn = d3.nest()
					// .key((dis)=>{
					// 	return dis[args.key['multiple']]
					// })
					// .rollup((v)=>{
					// 	return v;
					// })
					// .entries( __calculated.data[dataSet] );
				}else{
					toReturn = __calculated.data[dataSet];
				}

				return toReturn;

			};

		/*****************************************************************************
		 * ENDFUNCTION: theData
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: axisName
		*****************************************************************************/

			const axisName = (key)=>{

				if (key == 0 || key == 1){
					return (args.xData == key) ? 'x' : 'y'

				}else{
					return key;
				}

			};

		/*****************************************************************************
		 * ENDFUNCTION: axisName
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
		 * FUNCTION: range
		*****************************************************************************/

			//set range of the bois
			// @param itemAtt : duh
			const range = (key)=>{

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
							args[ `${ToOppoAxis( axisName(key))}Align` ] == 'top'
							|| args[ `${ToOppoAxis( axisName(key))}Align` ] == 'left'
						) {
							range = [ 0, args[ ToSide(axisName(key)) ] ];

						}else{
							range = [ args[ ToSide(axisName(key)) ] , 0 ];
						}
						break;
				}
				return range;
			}

		/*****************************************************************************
		 * ENDFUNCTION: range
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: domain
		*****************************************************************************/

			//set domain of the bois
			// @param itemAtt : duh
			// @param dat : ooh boi
			const domain = (keyKey,dataToRender,dataGroupKey)=>{
				dataGroupKey = dataGroupKey || '';

				const keyString = args.key[ keyKey ],
					pushToDom = (d)=> {
						if(!domain.includes(__calculated.#_get(d, keyString ))){
							domain.push(__calculated.#_get(d, keyString ));
						}
					};

				// @TODO get deep into the anals of this for multiple data setup
				let domain = [],
					dat = args.srcMultiple
						? theData('nested')
						: dataToRender;

				if(keyString){
					switch(keyKey){
						case 'color':
								dat.forEach((dis)=>{
									if(args.srcMultiple) {
										dis.values.forEach((dit)=>{
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
										args[`${axisName(keyKey)}Min`] !== null
										&& keyKey !== 'area'
									){
										min = args[`${axisName(keyKey)}Min`];

									}else{
										min = d3.min(dat,(dis)=>{
											if(args.srcMultiple){
												return d3.min(dis.values,(dit)=>{
													return __calculated.#_get(dit, keyString, true);
												});

											}else{
												return __calculated.#_get(dis, keyString, true);
											}
										});
									}

								//max
									if(
										args[`${axisName(keyKey)}Max`] !== null
										&& keyKey !== 'area'
									){
										max = args[`${axisName(keyKey)}Max`]

									}else{
										max = d3.max(dat,(dis)=>{
											if(args.srcMultiple){
												return d3.max(dis.values,(dit)=>{
													return __calculated.#_get(dit, keyString, true);
												});

											}else{
												return __calculated.#_get(dis, keyString, true);
											}
										});
									}

								domain = [min,max];

								//if it a scatter plot we get nereast
								if(__calculated.is_base('scatter') && keyKey == 0){
									const newMin = getNearest(min),
										newMax = getNearest(max);
									domain = [newMin,newMax];
								}

							}else{

								if(args.srcMultiple){
									if(
										dataGroupKey !== ''
										&& dat.key == dataGroupKey
									) {
										domain = dat.get(dataGroupKey).map((dit)=>{
											return __calculated.#_get(dit, keyString, false);
										});

									}else{
										dat.forEach((dis)=>{
											dis.values.forEach((dit)=>{
												pushToDom(dit);
											})
										});
									}

								}else{
									domain = dat.map((dis)=>{
										return __calculated.#_get(dis, keyString, false);
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
		 * ENDFUNCTION: domain
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: Label.origin
		*****************************************************************************/

			//AXIS STRING AND AXIS POSITION COORDINATES ARE VERY DIFFERENT THINGS U DUMB FUCK
			const Label.origin = (coordinateAttribute,axisString)=>{ 
				let offset = 0;
				//x
					if(coordinateAttribute == 'x'){
						if(axisString == 'x'){
							offset = args[ToSide(axisString)] / 2;

						}else if(axisString == 'y'){
							offset = -(args[ToSide(axisString)] / 2)
						};
				//y
					}else{
						if(axisString == 'x'){
							if(args[`${axisString}Align`] == 'bottom'){
								offset = args[ToSide(axisString,true)]
								+ (__calculated.margin.bottom * .875);

							}else{
								offset = -(__calculated.margin.top * .875);
							}
						}else if(axisString == 'y'){
							if(args[`${axisString}Align`] == 'right'){
								offset = args[ToSide(axisString,true)]
									+ (
										(__calculated.margin.right * .875)
										+ __calculated.fontSize
									);

							}else{
								offset = -(
									(__calculated.margin.left * .875)
									- __calculated.fontSize
								)
							}
						};
					}
					
				return offset;
			}

		/*****************************************************************************
		 * ENDFUNCTION: Label.origin
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getShapeSize
		*****************************************************************************/

			//width,height or radius boi
			const getShapeSize = (axisString,dis,i,initial)=>{
				initial = initial || false;

				const
					keyKey  =  args[`${axisString}Data`],
					oppositeAxisAlignment = args[`${ToOppoAxis(axisString)}Align`];

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
									dimension = args[ToSide(axisString)]
										- __calculated[`the_${keyKey}`](
											__calculated.#_get(dis, args.key[ keyKey ] ,true)
										);

								}else{
									dimension = __calculated[`the_${keyKey}`](
										__calculated.#_get( dis, args.key[ keyKey ] ,true )
									);
								}
							}

						}else{
							dimension = __calculated[`the_${keyKey}`].bandwidth()
						}

						if(dimension < 0 ){
							dimension = 0;
						}
				}

				return dimension;
			}

		/*****************************************************************************
		 * ENDFUNCTION: getShapeSize
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getShapeRadius
		*****************************************************************************/

			//duh 
			const getShapeRadius = (dis,i,initial)=>{
				initial = initial || false;


				let radius = initial ? 0 : (
					args.type == 'scatter'
						? (args.areaMin + args.areaMax) / 2
						: 5
				);

				if(!initial){
					if(__calculated.is_base('line')){
						if(__calculated.is_base('line') && args.linePointsSize){
							radius = args.linePointsSize
						}
						
					}else if(__calculated.is_base('scatter') && args.key['area'] ){
						radius = __calculated.the_area( __calculated.#_get(dis,args.key['area'],true) );
					}
				}

				return radius;
			}

		/*****************************************************************************
		 * ENDFUNCTION: getShapeRadius
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getShapeTextAnchor
		*****************************************************************************/

			//more confusion
			const getShapeTextAnchor = (dis,i)=>{
				
				let anchor = 'middle';

				if(__calculated.is_base('pie')){
					//halat garo may magigibo akoo kani

				}else{
					if(args.yData == 0) {
						anchor = 'start';
					}

					COORDINATES.forEach((coordinate)=>{
						if(
							args[`${ToOppoAxis(coordinate)}Data`] == 0
							&& args[`${ToOppoAxis(coordinate)}Align`] == 'right'
						){
							anchor = 'end';
						}
					});
				}

				return anchor;
			}

		/*****************************************************************************
		 * ENDFUNCTION: getShapeTextAnchor
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getShapeTextBaselineShift
		*****************************************************************************/

			//pls do not ask me po this broke my brain i will not likely know what just happened
			const getShapeTextBaselineShift = (coordinateAttr,keyKey)=>{

				let shift = 0;

				if( __calculated.has_both_text ){
					if(
						coordinateAttr == 'y'
						&& __calculated.has_both_text
					){
						const
							full_height =
								__calculated.fontSize
								* (
									args.textNameSize
									+ args.textValueSize
									+ TEXT_PADDING
								) // .5 margin top bottom and between text
						
						if( keyKey == 1){
							shift = (
								(
									(full_height  * -.5)
									+ ( (__calculated.fontSize * args.textValueSize) * .5)
									+ ( __calculated.fontSize )
								)
								/ (__calculated.fontSize * args.textValueSize)
							);

						}else{
							shift = (
								(
									(full_height * .5)
									- ( (__calculated.fontSize * args.textNameSize) * .5)
									- ( __calculated.fontSize )
								)
								/ (__calculated.fontSize * args.textNameSize)
							);
						}
					}
				}
				
				return `${shift}em`;
			}

		/*****************************************************************************
		 * ENDFUNCTION: getShapeTextBaselineShift
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getShapeTextOrigin
		*****************************************************************************/


			const getShapeTextOrigin = (coordinate,dis,i,initial)=>{
				initial = initial || false;
				//coordinate is influenced by the axis right now so this is the only time coordinate and axis is one and the same. i think... do not trust me on this
				
				const keyKey =  args[`${coordinate}Data`];
				let offset = 0;
				
				if(__calculated.is_base('pie')){
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
						orArr =  getArcPath( getPiData(dis,i) ,calcWithInnerRadius,'centroid',multiplier,customInitial);
						offset = ( coordinate =='x') ? orArr[0] : orArr[1];

				}else{
					// offset by where the COORDINATES of the ends of the shape and axis alignment is at and spaces it by the dimensions of the text bitches
					const shiftPad = () => {

						let value = 0,
							multiplier = 1;

						if(!(initial || __calculated.is_base('scatter'))){
							if(
								args[`${ToOppoAxis(coordinate)}Align`] == 'bottom'
								|| args[`${ToOppoAxis(coordinate)}Align`] == 'right'
							){
								multiplier = -1;
							}

							if( keyKey !== 0 && coordinate == 'x'){
								value = ((TEXT_PADDING * .5) * __calculated.fontSize);
							}

							value *= multiplier;
						}

						return value;
					},

					// offset if text is outside of boundaries
					shiftArea = () => {
						let multiplier = 1,
							value = 0;

						if(!(initial || __calculated.is_base('scatter'))) {
							if(
								(
									(__calculated.is_base(['line','scatter']) || !args.barTextWithin)
									&& (
										args[`${ToOppoAxis(coordinate)}Align`] == 'bottom'
										|| args[`${ToOppoAxis(coordinate)}Align`] == 'right'
									)
								)
								|| (
									(__calculated.is_base('bar') && args.barTextWithin)
									&& (
										args[`${ToOppoAxis(coordinate)}Align`] == 'top'
										|| args[`${ToOppoAxis(coordinate)}Align`] == 'left'
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
										(__calculated.is_base(['line','scatter']) || !args.barTextWithin)
										&& (
											parseFloat(getShapeSize(coordinate,dis,i))
											>= (args[ToSide(coordinate,true)] - __calculated.m_length(coordinate,i))
										)
									){
										value = -__calculated.m_length(coordinate,i);

									}else if(
										(__calculated.is_base('bar') && args.barTextWithin)
										&& (
											parseFloat(getShapeSize(coordinate,dis,i))
											< __calculated.m_length(coordinate,i)
										)
									){
										value = -getShapeSize(coordinate,dis,i);
									}

								}else{
									if(
										(
											(__calculated.is_base(['line','scatter']) || !args.barTextWithin)
											&& (
												parseFloat(getShapeSize(coordinate,dis,i))
												>= (args[ToSide(coordinate,true)] - __calculated.m_length(coordinate,i))
											)
										)
										|| (
											(__calculated.is_base('bar') && args.barTextWithin)
											&& (
												parseFloat(getShapeSize(coordinate,dis,i))
												< __calculated.m_length(coordinate,i)
											)
										)
									){
										value = __calculated.m_length(coordinate,i) * -.5;
										
									}else{
										value = __calculated.m_length(coordinate,i) * .5;
									}
								}
							}

							value *= multiplier;
						
						}
						
						return value;

					};

					if( keyKey  == 0 ) {
						offset = getShapeOrigin(coordinate,dis,i);
						if(__calculated.is_base('bar')) {
							offset += getShapeSize(coordinate,dis,i) / 2;
						}

					}else{
						switch(args[ToOppoAxis(coordinate)+'Align']){
							case 'top':
								if(!initial && __calculated.is_base(['bar','line'])){
									offset = getShapeSize(coordinate,dis,i)
								}
								break;

							case 'right':
							case 'bottom':
								if(
									initial && __calculated.is_base(['bar','line'])
									|| (args.barTextWithin && args[ToOppoAxis(coordinate)+'Align'] == 'right')
								) {
									offset = args[ToSide(coordinate)];

								}else{
									offset = args[ToSide(coordinate)] - getShapeSize(coordinate,dis,i);
								}
								break;

							case 'left':
								if( __calculated.is_base(['line','scatter']) ||  !args.barTextWithin ){
									if(!initial) {
										offset = getShapeSize(coordinate,dis,i);
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
		 * ENDFUNCTION: getShapeTextOrigin
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getShapeOrigin
		*****************************************************************************/

		const getShapeOrigin = (coordinate,dis,i,initial)=>{
			initial = initial || false;


			// same here.. could be the same probably
			const keyKey =  args[ coordinate+'Data'],
				oppositeAxisAlignment = args[ ToOppoAxis(coordinate)+'Align'];

			let offset = 0;

				if(__calculated.is_base(['bar','line','scatter'])) {
					if( args.nameIsNum == true || keyKey == 1){
						if(
							oppositeAxisAlignment == 'right'
							|| oppositeAxisAlignment == 'bottom'
							){
							if(__calculated.is_base(['bar','line']) && initial ){
								offset = args[ToSide(coordinate)];

							}else{
								offset = args[ToSide(coordinate)]
								- (
									args[ToSide(coordinate)]
									- __calculated['the_'+ args[coordinate+'Data'] ]( __calculated.#_get(dis, args.key[ keyKey ], true )));
							}

						}else{
							if(__calculated.is_base(['line','scatter'])){
								if(
									!initial
									|| __calculated.is_base('scatter')
								){
									offset = __calculated['the_'+ args[coordinate+'Data'] ]( __calculated.#_get(dis, args.key[ keyKey ], true ));
								}
							}
						}

					}else{
						offset = __calculated['the_'+ args[coordinate+'Data'] ](__calculated.#_get(dis, args.key[ keyKey ], false));
						if(
							(__calculated.is_base(['line','scatter']))
							&& !args.nameIsNum 
						) {
							offset += getShapeSize( coordinate ,dis,i) / 2;
						}
					}
				}

			return offset;
		}

		/*****************************************************************************
		 * ENDFUNCTION: getShapeOrigin
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getLegendOrigin
		*****************************************************************************/
			
			const getLegendOrigin = (axisString)=>{

				if( __calculated.container_legend ){
					let offset = 0,
						length = axisString == 'x'
							? __calculated.container_legend_merge.nodes()[0].getBoundingClientRect()[ToSide(axisString)]
							: (__calculated.legendSize * __calculated.dom_color.length), // .8
					
					shifter = () => {
						let value = 0,
							multiplier = 1;

						//multiplier
						if (
							__calculated.is_base(['pie'])
							|| (
								__calculated.is_base(['bar','line','scatter'])
								&& args[ToOppoAxis(axisString)+'Align'] == 'left'
								|| args[ToOppoAxis(axisString)+'Align'] == 'top'
							)
						){
							multiplier = -1;
						}

						//how much of length to shift
						if (
							(__calculated.is_base(['pie']) && axisString == 'x')
							|| (
								__calculated.is_base(['bar','line','scatter'])
								&& args[ToOppoAxis(axisString)+'Align'] == 'left'
								|| args[ToOppoAxis(axisString)+'Align'] == 'top'
							)
						){
							value = length + __calculated.fontSize;

						} else if(  (__calculated.is_base('pie') && axisString == 'y') ){
								value = length * .5;
						}
							
						return value * multiplier;
					};

					if (
						(__calculated.is_base('pie') && axisString == 'x')
						|| 
						(
							__calculated.is_base(['bar','line','scatter'])
							&& args[ToOppoAxis(axisString)+'Align'] == 'left'
							|| args[ToOppoAxis(axisString)+'Align'] == 'top'
						)
					){
						offset = args[ToSide(axisString)];

					}else if( (__calculated.is_base('pie') && axisString == 'y') ){
						offset = args[ToSide(axisString)] * .5;
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

			const getLinePath = (dat,isArea,initial)=>{

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
						value: ToOppoAxis(axisToFill)+1, //y
						fill: ToOppoAxis(axisToFill)+0 //initial of data name is the bottom of the fill
					};
					
					
					path
						[aCord.name]((dis,i)=>{
							return getShapeOrigin(axisToFill,dis,i,initial); 
						})
						[aCord.value]((dis,i)=>{
							return getShapeOrigin(ToOppoAxis(axisToFill),dis,i,initial);
						})
						[aCord.fill]((dis,i)=>{
							return (
								args[`${axisToFill}Align` ]  == 'bottom'
								|| args[`${axisToFill}Align` ]  == 'right'
							) ? args[ToSide(axisToFill)] : 0;
						});

				}else{
					path
						.x((dis,i)=>{
							return getShapeOrigin('x',dis,i,initial);
						})
						.y((dis,i)=>{
							return getShapeOrigin('y',dis,i,initial);
						});

				}

				if(pathStyle){
					path.curve(d3[pathStyle]);
				}

				return path(dat);
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
						toReturn = __calculated.pi_radius * args.piInRadius;
					}

					return toReturn;
				})(),

				outerRadius = (() => {
					let toReturn = 0;

					if(!initial || ( initial && (outerRadiusMultiplier <=1 ) && calcWithInnerRadius == false )){
						toReturn = __calculated.pi_radius * outerRadiusMultiplier;
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

			const getPiData = (dis,i)=>{
				//@TODO WTF THE FUCK NANI ANO
				const pie =  d3.pie()
					.sort(null)
					.value((dis,i)=>{
						return __calculated.#_get(dis,args.key[1],true)
					})
					;


					return pie(theData('flat','displayed'))[i];
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
					offset = args[ToSide(axisString)] * .375;

				}else{
					offset  = (args[ToSide(axisString)] * .5);
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
		 * FUNCTION: scale
		*****************************************************************************/

			const scale = (keyKey)=>{
				
				let scale;

				switch(keyKey){

					case 'color':
						scale = d3.scaleOrdinal()
							.range(__calculated['range_'+keyKey]) 
						break;

					case 'area':
					case 0:
					case 1:
						if(args.nameIsNum == true || keyKey == 1 || keyKey == 'area' ){
							if(args.nameIsNum == true && keyKey == 0 && __calculated.is_base('scatter')){
								scale = d3.scaleSymlog()
									.constant(10)
									.range(__calculated['range_'+keyKey]);

							}else{
								scale = d3.scaleLinear()
									.range(__calculated['range_'+keyKey]);
							}
							
						}else{
							if(__calculated.is_base(['line','scatter'])){
								scale = d3.scalePoint() //scales shit to dimensios
									.range(__calculated['range_'+keyKey]) // scaled data from available space

							}else{
								scale = d3.scaleBand() //scales shit to dimensios
									.range(__calculated['range_'+keyKey]) // scaled data from available space
									.paddingInner(args.barGutter) //spacing between
									.paddingOuter(args.barGutter);
							}
						}

						break;
						
				}
				
				return scale;
			};

		/*****************************************************************************
		 * ENDFUNCTION: scale
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
							
							__calculated['lab_'+axisString] = __calculated.labels.append('text')
								.attr('class',`${PREFIX}label-${axisString}`)
								.attr('y',() => {
									return Label.origin('y',axisString);
								})
								.attr('x',() => {
									return Label.origin('x',axisString);
								})
								.attr('font-size', '1em')
								.attr('text-anchor', 'middle')
								.attr('fill','currentColor')
								.attr('opacity',0)
								.text(args[axisString+'Label']);

							if(axisString == 'y') {
								__calculated['lab_'+axisString].attr('transform', 'rotate(-90)');
							}

							__calculated['lab_'+axisString]
								.transition(__calculated.duration)
								.attr('opacity',1);

						}

					//ruler/grid
						__calculated[tickContainer] = containerObj.append('g')
							.attr('class', () => {

									let contClass = null;
			
									if(isGrid){
										contClass =
											`${PREFIX}grid-${axisString} grid-increment-${args[axisString+'GridIncrement']}`;
										
									}else{
										contClass =
											`${PREFIX}axis-${axisString} ${PREFIX}axis-align-${alignString}`;
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
			
						__calculated[tickContainer].attr('transform','translate('+transformCoord+')');

				}
			}

		/*****************************************************************************
		 * ENDFUNCTION: renderAxisContainers
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: setGroupData
		*****************************************************************************/

			const setGroupData = ()=>{
				let toReturn;
				if(__calculated.has_nested_data){
					console.warn(__calculated.elem,__calculated.has_nested_data,'it fuckin grouped');
					toReturn = theData('nested','displayed');
				}else{
					toReturn = [{
						parent:'flat',
						values: theData('flat','displayed')
					}]
				}

				return toReturn;
			}

		/*****************************************************************************
		 * ENDFUNCTION: setGroupData
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: parseData
		*****************************************************************************/

			const parseData = (dataToParse)=>{
				
				// heck if src key exists
				let toReturn = (() => {
					if (args.srcKey) {
						if(__calculated.#_get(dataToParse,args.srcKey)){
							return __calculated.#_get(dataToParse,args.srcKey);
						}else{
							renderError(dv.selector+' provided source key is invalid');
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

					DATUM_KEYS.forEach((keyKey)=>{
						if(args.key[keyKey] && __calculated.#_get(dis,args.key[keyKey]) == null) {
								// __calculated.has[keyKey] = false;
							toInclude = false;
							if(__calculated.is_debuggy){
								const humanForKey = keyKey == 0 ? 'name': keyKey == 1 ? 'value': keyKey;
								console.warn(`${dv.selector} datum index '${i}' was filtered.\ndatum does not have data for the key '${args.key[keyKey]}', which is set as the property for '${humanForKey}'`)
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
						return __calculated.#_get(a,args.key[0],true) - __calculated.#_get(b,args.key[0],true);
					});

					toReturn = sortable;
				}

				return toReturn;

			}

		/*****************************************************************************
		 * ENDFUNCTION: parseData
		*****************************************************************************/




		/*****************************************************************************
		 * FUNCTION: setAxis
		*****************************************************************************/

			const setAxis = (axisString,isGrid)=>{
				isGrid = isGrid || false;
				
				const axisKey = 'Axis '+ args[axisString+'Align'];
				var	axisToReturn = d3[Str.toCamelCase(axisKey)](__calculated['the_'+ args[axisString+'Data']]);

				if(args[axisString +'Ticks']){
					if(__calculated.is_base(['scatter']) && args[axisString+'Data'] == 0 && args.nameIsNum == true ){
						const tickValues = () => {
							const values = [],
								currVal = domain(0,__calculated.data.displayed)[0];
							do{
								values.push(currVal);
								currVal *= 10;

							}while(currVal <= domain(1,__calculated.data.displayed).values);

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
							.tickSize(-args[ ToSide( axisString,true ) ])
							.tickFormat("");

					}else {
						axisToReturn
							.tickFormat((dis,i)=>{
								return __calculated['format_'+ args[axisString+'Data'] ](dis)
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
				return __calculated.tooltip_cursor_stalker 
					.attr('cx',
						`${(
							d3_event.offsetX
							* ( __calculated.outer('width') / __calculated.svg.node().clientWidth )
						)}px`
					)
					.attr('cy',
						`${(
							d3_event.offsetY
							* (  __calculated.outer('height') / __calculated.svg.node().clientHeight )
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

				const errorFront = "Sorry, unable to display data." + (  __calculated.is_debuggy ? "<br> Please check the console for more details" : '');

				d3.select(dv.selector).classed(PREFIX+'initialized',true);

				if(!dataContainer.querydv.Selector('.'+PREFIX+'wrapper.fatality')){
					d3.select(dv.selector).append('div')
						.attr('class',PREFIX+'wrapper fatality')
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
		 * FUNCTION: renderGraphGroup
		*****************************************************************************/
			
			//a g that contains sum bitches
			const renderGraphGroup = (gName) =>{
				let toReturn = __calculated.container
						.selectAll(`g.${PREFIX}${gName}`)
						.data(
							setGroupData,
							(dat)=>{ return dat.parent }
						)
						.enter()
							.append('g')
							.attr('class',(dat)=>{

								return	PREFIX + gName
									+ ' ' + (
										(dat.parent && dat.key)
											? PREFIX
												+ gName+'-set '
												+ 'data-group-'+ dat.parent
											: ''
									)
							}
							)
							.attr('transform',()=> {
								return __calculated.is_base('pie')
									? 'translate('+ getPiOrigin('x') +','+ getPiOrigin('y') +')'
									: ''
							})
							;


							toReturn.exit()
								.transition(10) //DO NOT
								.style('opacity',0)
								.remove()
								;

				return toReturn;
			}

		/*****************************************************************************
		 * ENDFUNCTION: renderGraphGroup
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: renderGraph
		*****************************************************************************/

			// fuck these bois up. pass data again in case changing data is a future feature
			const renderGraph = ()=> {
				__calculated.data.displayed = __calculated.data.displayed.length
					? __calculated.data.displayed
					: __calculated.data.complete;

				// ok do the thing now
				__calculated.is_debuggy && console.log(
					"\n",
					dv.selector,'('+args.title+')','-------------------------------------------------------------------',"\n",
					'calculated shit',__calculated,"\n",
					'data',__calculated.data,"\n",
					'args',args,"\n",
					"\n"
				)
				;

				/******** UPDOOT DOMAIN ********/

					DATUM_KEYS.forEach((keyKey)=>{

						//get domain
						__calculated['dom_'+keyKey] = domain(keyKey,__calculated.data.displayed);

						//set that fucker
						if(__calculated['the_'+keyKey] && __calculated['dom_'+keyKey]) {
							__calculated['the_'+keyKey].domain(__calculated['dom_'+keyKey])
							;
						}
					});

				/******** AXIS + GRID ********/

					if(__calculated.is_base(['bar','line','scatter'])){
						COORDINATES.forEach((coordinate)=>{
							if( args[coordinate+'Ticks'] ){
								__calculated['rule_'+coordinate+'_axis'] = setAxis(coordinate);
										
								__calculated['rule_'+coordinate]
									.transition(__calculated.duration)
									.call( __calculated['rule_'+coordinate+'_axis'] )
									.attr('font-family',null)
									.attr('font-size',null);
			
								if(args[coordinate+'Grid']){
								__calculated['grid_'+coordinate+'_axis'] = setAxis(coordinate,true);
									
									__calculated['grid_'+coordinate]
										.transition(__calculated.duration)
										.call( __calculated['grid_'+coordinate+'_axis'] );
										
									__calculated['grid_'+coordinate].selectAll('g')
										.classed('grid',true)
										.filter((dis,i)=>{

											//IM HERE FUCKER
											let isAligned = false;
											__calculated['rule_'+coordinate].selectAll('g').each((tik)=>{
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

				/******** CONTAINER ********/


					__calculated.container_graph = renderGraphGroup('graph');


					if(__calculated.has_text){
						__calculated.container_text = renderGraphGroup('text');
					}
					

				/******** LINE ********/
					if(__calculated.is_base('line')){

						// __calculated.line = __calculated.container_graph.select(`.${PREFIX}line`)
						// 	// .data((dat)=> {
						// 	// 	theData('nested','displayed'),
						// 	// 	()=>{ console.log(dat);return dat.key }
						// 	// })
						// 	// // .data((d)=> { return d.values }) 
						// 	// .join(`.${PREFIX}line`)
						// 	;
						
						__calculated.line = __calculated.container_graph.append('path').lower()
							.attr('class',
								`${PREFIX}line
								${
									args.lineColor !== null
										? ' has-color'
										: ' no-color'
								}`
							)
							.attr('fill','none')
							.attr('stroke-width',args.lineWeight)
							.attr('stroke-linejoin','round')
							.attr('stroke-dasharray',args.lineDash)
							.attr('stroke-opacity',1)
							.attr('stroke-dasharray','0,0')
							;
						__calculated.line
							// .attr('d',getLinePath(false,false))
							.transition(__calculated.duration)
								.attrTween('d',function(dat){
									return getInterpolation(
										getLinePath(dat.values,false,true),
										getLinePath(dat.values,false,false)
									)
								})
							;


							if(args.lineColor) {
								__calculated.line
									.attr('stroke',args.lineColor)
							}
						
						

						if( args.lineFill ){
							__calculated.fill = __calculated.container_graph.select(`.${PREFIX}fill`)
								// .data((dat)=> {
								// 	theData('nested','displayed'),
								// 	()=>{ console.log(dat);return dat.key }
								// })
								// .data((d)=> { return d.values }) 
								;
							
							__calculated.fill = __calculated.container_graph.append('path').lower()
								.attr('class',
									`${PREFIX}fill
									${
										(
											args.lineFillColor !== null
											|| args.lineColor !== null
										)
											? ' has-color'
											: ' no-color'
									}`
								)
								.attr('fill-opacity',args.lineFillOpacity)
								;
							__calculated.fill
								.transition(__calculated.duration)
									.attrTween('d',function(dat){
										return getInterpolation(
											getLinePath(dat.values,true,true),
											getLinePath(dat.values,true,false)
										)
									})
								;
							;

								if( args.lineFillColor || args.lineColor ) {
									__calculated.fill
										.attr('fill', args.lineFillColor || args.lineColor);
								}
						}
					}

				/******** DECLARE ********/

					//graph item : bars, scatter plots, pizza, points	
						__calculated.shape = __calculated.container_graph.selectAll(`${__calculated.shape.tag}.${PREFIX}graph-item.graph-item-shape`)
							.data((d)=> {  console.warn('-------',d); return d.values }) //@TODO return proper boi depending on type of display
							;

					//text labels
						if(__calculated.has_text){

							//polyline 
								if(__calculated.is_base('pie') && args.piLabelStyle == 'linked'){

									__calculated.shape_text_link = __calculated.container_text.selectAll(`polyline.${PREFIX}graph-item.graph-item-link`)
										.data((d)=> { return d.values })
								}
							//text itself
								__calculated.shape_text = __calculated.container_text.selectAll(`text.${PREFIX}graph-item.graph-item-text`)
									.data((d)=> { return d.values })
						}

					//legend
						if(args.colorLegend){

							__calculated.container_legend = __calculated.g.selectAll(`g.${PREFIX}legend`)
								.data((d)=> { return d.values })
								
							__calculated.legend = __calculated.container_legend.selectAll('g.'+ PREFIX+'legend-item')
								.data(__calculated.dom_color);
						}

				/******** EXIT ********/

					//graph item : bars, scatter plots, pizza, points
						__calculated.shape.exit()
							.transition(__calculated.duration)
							.style('opacity',0)
							.remove();

					//text label
						if(__calculated.has_text){

							//polyline 
								if(__calculated.is_base('pie') && args.piLabelStyle == 'linked'){

									__calculated.shape_text_link.exit()
										.transition(__calculated.duration)
										.style('opacity','0')
										.remove();
								}

							//text itself
								__calculated.shape_text.exit()
									.transition(__calculated.duration)
									.style('opacity','0')
									.remove();
						}

					//legend
						if(args.colorLegend){
							__calculated.container_legend.exit()
								.transition(__calculated.duration)
								.style('opacity',0)
								.remove();

								__calculated.legend.exit()
									.transition(__calculated.duration)
									.style('opacity','0')
									.remove();
						}
				
						

				/******** ENTER ********/

					//graph item : bars, scatter plots, pizza, points
						__calculated.shape_enter = __calculated.shape.enter()
							.append(__calculated.shape.tag)
								.attr('class', (dis)=>{
									return `${PREFIX}graph-item graph-item-shape data-name-${__calculated.#_get(dis,args.key[0])}`
								})
								;

								if(__calculated.is_base(['bar','line','scatter'])){
									__calculated.shape_enter
										.attr(
											(__calculated.is_base(['line','scatter']) ? 'cx' : 'x'),
											(dis,i)=>{
												return getShapeOrigin('x',dis,i,true);
											}
										)
										.attr(
											(__calculated.is_base(['line','scatter']) ? 'cy' : 'y'),
											(dis,i)=>{
												return getShapeOrigin('y',dis,i,true);
											}
										)
										;
										
										if(__calculated.is_base(['line','scatter'])){
											__calculated.shape_enter
												.attr('r',(dis,i)=>{
													return getShapeRadius(dis,i,true);
												})
												;
				
				
										}else if(__calculated.is_base('bar')){
											__calculated.shape_enter
												.attr('width',(dis,i)=>{
													return getShapeSize('x',dis,i,true)
												}) // _ width
												.attr('height',(dis,i)=>{
													return getShapeSize('y',dis,i,true)
												})
												;
										}
								}

					//text label
						if(__calculated.has_text){

							//polyline 
								if(__calculated.is_base('pie') && args.piLabelStyle == 'linked'){
									
										__calculated.shape_text_link_enter = __calculated.shape_text_link
											.enter()
											.append('polyline')
											.attr('class',(dis)=>{
												return `${PREFIX}graph-item graph-item-link data-name-${__calculated.#_get(dis,args.key[0])}`;
											})
											.attr('stroke-opacity',.75)
											.attr('opacity',1)
											;
								}

							// text itself
								__calculated.shape_text_enter = __calculated.shape_text
									.enter()
									.append('text')
									.attr('line-height',1.25)
									.attr('dominant-baseline','middle')
									.attr('transform',(dis,i)=>{
										const dataToUse = __calculated.is_base('pie') ? getPiData(dis,i) : dis;
										return `translate( ${getShapeTextOrigin('x',dataToUse,i,true)} , ${getShapeTextOrigin('y',dataToUse,i,true)} )`;
									})
									.style('opacity','0')
									;

								//append content right away so we can calculate where shit offset
								[0,1].forEach((keyKey)=>{

									if(
										(
											__calculated.is_base(['bar','line','scatter'])
											&& !args[axisName(keyKey)+'Ticks']
										)
										|| (
											__calculated.is_base('pie')
											&& (
												( keyKey == 0 && !args.colorLegend )
												|| ( keyKey == 1 && args.piLabelStyle !== null )
											)
										)
									){

										__calculated['shape_text_'+keyKey] = __calculated.shape_text_enter.append('tspan')

											.attr('class', (dis)=>{
												return `${PREFIX}graph-item-text-data-${keyKey} data-name-${__calculated.#_get(dis,args.key[0])}`
											} )
											.attr('dominant-baseline','middle')
											.attr('text-anchor',(dis,i)=>{
												return getShapeTextAnchor(dis,i);
											})
											.attr('font-size',() => {

												let toReturn = null;

												if(
													(
														__calculated.is_base(['bar','line','scatter'])
														&& !args[ ToOppoAxis ( axisName(keyKey) )+'Ticks']
													)
													|| (
														__calculated.is_base('pie')
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
											.attr('x',getShapeTextBaselineShift('x',keyKey))
											.attr('y',getShapeTextBaselineShift('y',keyKey))
											.attr('font-weight',() => {
												let toReturn = 700;

												if(
													(
														__calculated.is_base(['bar','line','scatter'])
														&& !args[ ToOppoAxis ( axisName(keyKey) )+'Ticks']
													)
													|| (
														__calculated.is_base('pie')
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
												return __calculated['format_'+ keyKey ]( __calculated.#_get(dis,args.key[ keyKey ]) );
											})

									}
									
								});
						}

					//legend
						if(args.colorLegend){

							__calculated.container_legend_enter = __calculated.container_legend.enter()
								.append('g')
								.attr('class',
									PREFIX + 'legend'
								)
								.attr('font-size', args.textLegendSize+'em')
								.transition(__calculated.duration)
								.styleTween('opacity',() => {getInterpolation(0,1)});
								;

								__calculated.legend_enter = __calculated.legend
									.enter()
									.append('g')
									.attr('class',PREFIX+'legend-item')
									.style('opacity','0');

									__calculated.legend_enter
										.transition(__calculated.duration)
										.style('opacity','1')

									__calculated.legend_enter.append('rect')
										.attr('class','legend-item-shape')
										.attr('width',__calculated.legendSize * .75)
										.attr('height',__calculated.legendSize * .75)
										.attr('fill', (dis,i)=>{
											__calculated.the_color(dis);
										})
										.attr('stroke',args.colorBackground);

									__calculated.legend_enter.append("text")
										.attr('class','legend-item-text')
										.text((dis)=>{
											return dis;
										})
										.attr('dominant-baseline','middle')
										.attr('x', __calculated.legendSize )
										.attr('y', __calculated.legendSize * .375)
										.attr('stroke',args.colorBackground);
						}


				/******** MERGE ********/
					
					//graph item : bars, scatter plots, pizza, points
						__calculated.shape_merge = __calculated.shape.merge(__calculated.shape_enter)
								
							//COORDINATES
							if(__calculated.is_base(['bar','line','scatter'])){
								__calculated.shape_merge
									.transition(__calculated.duration)
										.attr(
											(__calculated.is_base(['line','scatter']) ? 'cx' : 'x'),
											(dis,i)=>{
												return getShapeOrigin('x',dis,i,false);
											}
										)
										.attr(
											(__calculated.is_base(['line','scatter']) ? 'cy' : 'y'),
											(dis,i)=>{
												return getShapeOrigin('y',dis,i,false);
											}
										)
										;
							}

							//areas and what not
							if(__calculated.is_base('pie')){
								__calculated.shape_merge
									.transition(args.transition) //DO NOT
										.attrTween('d',function(dis,i){
											dis._current = dis._current || getPiData(dis,i);
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
							
							if(__calculated.is_base(['line','scatter'])){
								__calculated.shape_merge
									.transition(__calculated.duration)
										.attr('r',(dis,i)=>{
											return getShapeRadius(dis,i,false)
										})
										;

								if(__calculated.is_base('line') && !args.linePoints) {
									__calculated.shape_merge
										.attr('fill-opacity',0)
										.attr('stroke-opacity',0);
								}
							}
							
							if(__calculated.is_base('bar')){
								__calculated.shape_merge
									.transition(__calculated.duration)
										.attr('width',(dis,i)=>{
											return getShapeSize('x',dis,i,false)
										}) // _ width
										.attr('height',(dis,i)=>{
											return getShapeSize('y',dis,i,false)
										})
										;
							}

							//tooltip
							if(args.tooltipEnable) {
								__calculated.shape_merge
									.on('mousemove',(dis)=>{
											__calculated.tooltip.show(dis,renderCursorStalker(d3.event));
									})
									.on('mouseleave',__calculated.tooltip.hide);
							}
							
							//line  colors
							if(!args.colorPalette.length){
								if(
									__calculated.is_base('line')
									&& (
										args.linePointsColor
										|| args.lineColor
									)
								) {
									__calculated.shape_merge
										.attr('fill',() => {
											return args.linePointsColor || args.lineColor;
										});

								}
							}else{
								__calculated.shape_merge
									.attr('fill',(dis,i)=>{
										return __calculated.the_color(__calculated.#_get(dis,args.key.color));
									});

									if(__calculated.is_base('scatter')){
										__calculated.shape_merge
											.attr('fill-opacity',args.areaOpacity)
											.attr('stroke-width',1)
											.attr('stroke',(dis,i)=>{
												return __calculated.the_color(__calculated.#_get(dis,args.key.color));
											})
									}
							}

					
					// text label
						if(__calculated.has_text){

							//polyline 
								if(__calculated.is_base('pie') && args.piLabelStyle == 'linked'){

									__calculated.shape_text_link_merge = __calculated.shape_text_link.merge(__calculated.shape_text_link_enter)
										.transition(__calculated.duration)
										.attrTween('points',(dis,i)=>{
											//in pie, initial means it starts at zero but we dont want that so dont set the initial to true
											const start = [
													getArcPath(getPiData(dis,i),true,'centroid',1,false), //first coord is centroid of our pie boi
													getArcPath(getPiData(dis,i),true,'centroid',1,false), // second is outer radius.
												],
												end = [

													getArcPath(getPiData(dis,i),true,'centroid',1,false),
													getArcPath(getPiData(dis,i),false,'centroid',2.25,false),
												];

											return getInterpolation(start,end);
										});
								}

							
							// text itself
								__calculated.shape_text_merge = __calculated.shape_text.merge(__calculated.shape_text_enter);

									//commercial break
									//set a minimum length for graph items to offset its text bois. doesnt matter which data key is on the axis we just want the width or height of the graph item on the given axis
									// add padding for less math i think
									__calculated.m_length = (axisString,i)=>{

										if(__calculated.has_text && __calculated.shape_text_merge){
											let value = 0;

											if( ToSide( axisString ) == 'width' ) {
												value = (
													__calculated.shape_text_merge.nodes()[i]
														.getBBox()[ ToSide( axisString ) ]
												) + (
													TEXT_PADDING
													* __calculated.fontSize
												);
											}else{
												value = (
													__calculated.fontSize
													* (
														args.textNameSize
														+ args.textValueSize
														+ TEXT_PADDING
													)
												);
											}

											return parseFloat(value);
										}
									};


									__calculated.shape_text_merge
										.attr('class', (dis,i)=>{
											let classString =  `${PREFIX}graph-item graph-item-text`;
											
											if( 
												(
													__calculated.is_base('bar')
													&& (
														(
															args.barTextWithin
															&& (
																( // it out
																	(
																		parseFloat(getShapeSize(axisName(1),dis,i,false))
																		< __calculated.m_length(axisName(1),i)
																	)
																	&& !ColorisDark(args.colorBackground)
																)
																|| ( //it in
																	(
																		parseFloat(getShapeSize(axisName(1),dis,i,false))
																		>= __calculated.m_length(axisName(1),i)
																	)
																	&& (args.colorPalette.length > 0)
																	&& !ColorisDark( __calculated.the_color(__calculated.#_get(dis,args.key.color)) )
																)
															)
														)
														|| (
															!args.barTextWithin
															&& (
																( // it out
																	(
																		(
																			parseFloat(getShapeSize(axisName(1),dis,i,false))
																			+ __calculated.m_length(axisName(1),i)
																		) <=  args[ToSide(axisName(1))]
																	)
																	&& !ColorisDark(args.colorBackground)
																)
																|| ( //it in
																	(
																		(
																			parseFloat(getShapeSize(axisName(1),dis,i,false))
																			+ __calculated.m_length(axisName(1),i)
																		) > args[ToSide(axisName(1))]
																	)
																	&& (args.colorPalette.length > 0)
																	&& !ColorisDark( __calculated.the_color(__calculated.#_get(dis,args.key.color)) )
																)
															)
														)
													)
												)
												|| (
													__calculated.is_base(['line','scatter'])
													&& !ColorisDark(args.colorBackground)
												)
												|| (
													__calculated.is_base('pie')
													&& (
														(
															args.piLabelStyle == 'within'
															&& (args.colorPalette.length > 0)
															&& !ColorisDark( __calculated.the_color(__calculated.#_get(dis,args.key.color)) )
														)
														|| (
															args.piLabelStyle == 'linked'
															&& !ColorisDark(args.colorBackground)
														)
													)
												)
											){
												classString +=  ` ${PREFIX}dark`;
											}else{

												classString +=  ` ${PREFIX}light`;
											}

											return classString;
										})
										.attr('stroke',(dis,i)=>{
											if(
												(
													__calculated.is_base('pie')
													&& args.piLabelStyle == 'within'
													&& args.colorPalette.length > 0
												)
												|| (
													__calculated.is_base('bar')

													&& (
														(
															!args.barTextWithin
															&& (
																parseFloat(getShapeSize(axisName(1),dis,i))
																>= (args[ToSide(axisName(1),true)] - __calculated.m_length(axisName(1),i))
															)
														)
														|| (
															args.barTextWithin
															&& (
																parseFloat(getShapeSize(axisName(1),dis,i))
																>= __calculated.m_length(axisName(1),i)
															)
														) //@TODO this
													)
												)
											){
												return __calculated.the_color(__calculated.#_get(dis,args.key.color))

											}else if(
												!__calculated.is_base(['bar','pie'])
												|| (
													__calculated.is_base(['pie'])
													&& args.piLabelStyle == 'linked'
												)
											){
												return args.colorBackground;
											}
										})
										.transition(__calculated.duration)
											.attr('transform',(dis,i)=>{
												const dataToUse = __calculated.is_base('pie') ? getPiData(dis,i) : dis;
												return `translate( ${getShapeTextOrigin('x',dataToUse,i,false)} , ${getShapeTextOrigin('y',dataToUse,i,false)} )`;
											})
											.style('opacity',1);

							
						}

					//legend
						if(args.colorLegend){


							__calculated.container_legend_merge = __calculated.container_legend.merge(__calculated.container_legend_enter)
									.attr('transform',`translate( ${getLegendOrigin('x')} , ${getLegendOrigin('y')} )`)

								__calculated.legend_merge = __calculated.legend.merge(__calculated.legend_enter)
									.transition(__calculated.duration)
									.attr('transform', (dis,i)=>{
										return `translate(0, ${i *  __calculated.legendSize})`;
									});
							
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
				__calculated.theUi = d3.select(dv.selector);
				
				__calculated.theUi
					.classed(
						`${PREFIX}initialized
						${ ColorisDark(args.colorBackground) ? PREFIX+'dark' : '' }` ,true
					)
					.style('background-color',args.colorBackground)
					;

				//graph element
				switch(args.type){
					case 'bar':
						__calculated.shape.tag = 'rect';
						break;
					case 'pie':
						__calculated.shape.tag = 'path';
						break;
					case 'line':
					case 'scatter':
						__calculated.shape.tag = 'circle';
						break;

				}


			
				// relative to 1em supposedly idk
				__calculated.fontSize = parseFloat(args.fontSize);
				

				__calculated.data = {
					displayed: [],
					complete: []
				};
				__calculated.data.complete = parseData(retrievedData);

				if( __calculated.data.complete.length > 0 ){
					// fallback + validate color data
					// if color data key aint set put in name
					if(!arr.key.color){ 
						args.key.color = args.key[0];

						//if legend was not fucked with we take the authority to kill legend
						if(!arr.colorLegend){
							args.colorLegend = false;
						}
					};

					if(!arr.key.area){
						
					}


					// setup padding and sizes
					__calculated.legendSize = (args.textLegendSize * parseFloat(args.fontSize) * 2);
					
					__calculated.margin = {
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

					__calculated.tooltip_html = args.tooltipContent
						|| ((dis,i)=>{
							const html = `<div class="${PREFIX}tooltip-data">`;

							for (let prop in dis) {
								if (Object.prototype.hasOwnProperty.call(dis, prop)) {
									const propIsOutputted = false;
									if(typeof dis[prop] !== 'object'){

									
										html += `<div class="${PREFIX}tooltip-data-property">`;

											// label
											if(args.srcType !== 'row'){
												html += `<strong class="${PREFIX}tooltip-data-property-label">${prop}:</strong> `;
											}


									
											DATUM_KEYS.forEach((keyKey)=>{
												
												if(
													args.key[keyKey]
													&& args.key[keyKey].lastIndexOf(prop)  > -1
													&& __calculated[`format_${keyKey}`]
													&& propIsOutputted == false
												){
													html += `<span class="${PREFIX}tooltip-data-property-content">${__calculated[`format_${keyKey}`] (__calculated.#_get(dis,args.key[ keyKey ]) )} </span>`;
													propIsOutputted = true;
												}

											});

											if(propIsOutputted == false) {

												// content
												html += `<span class="${PREFIX}tooltip-data-property-content">${dis[prop]}</span>`;

											}
										
										
										html += '</div>';
									
									}
									
								}
							}

							html += '</div>';
							return html;
						});

					
					//set them dimensions
					__calculated.outer('width') = args.width + __calculated.margin.left + __calculated.margin.right;
					__calculated.outer('height') = args.height + __calculated.margin.top + __calculated.margin.bottom;




					d3.select(dv.selector).append('div').lower()
						.attr('class',`${PREFIX}heading`);
					
						__calculated.heading_sel = d3.select(dv.selector).select(`div.${PREFIX}heading`);

						if(args.title){
							__calculated.heading_title = __calculated.heading_sel.append('span')
							.attr('class',`${PREFIX}title`)
							.text(args.title)
						}

						if(args.description){
							__calculated.heading_description = __calculated.heading_sel.append('span')
							.attr('class',`${PREFIX}description`)
							.text(args.description)
						}

						__calculated.heading_sel
							.style('padding-top', () => {
								`${(__calculated.margin.top / args.height) * 50}%`
							})
							.style('padding-left', () => {
								`${(__calculated.margin.left / __calculated.outer('width')) * 100}%`
							})
							.style('padding-right', () => {
								`${(__calculated.margin.right / __calculated.outer('width')) * 100}%`
							})
							.transition(__calculated.duration)
							.styleTween('opacity',() => {getInterpolation(0,1)});
				
					__calculated.body = d3.select(dv.selector)
						.append('div')
						.attr('class', `${PREFIX}wrapper`)
						.style('position','relative')
						.style('padding-bottom',() => {
							return `${(( __calculated.outer('height') / __calculated.outer('width')) * 100)}%`;
						})
						.style('position','relative');

						const dimensionString = `0 0 ${__calculated.outer('width')} ${__calculated.outer('height')}`;
					
					//check if its scrolled on the place it should be at
					__calculated.isLoaded = false;
					
					document.addEventListener('scroll',(e)=>{
						const graphPosition = dataContainer.getBoundingClientRect().top;
						if(graphPosition < (window.innerHeight * .5) && !__calculated.isLoaded) {
							__calculated.isLoaded = true;
							
							setTimeout(() => {

								__calculated.svg = __calculated.body.append('svg')
									.attr('id',`${dv.selector}-svg`)
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
										`${PREFIX}svg`
										+ ` ${PREFIX}type-${args.type}`
										+ ` ${PREFIX}${(
												(
													args.colorPalette.length > 0
													|| args.linePointsColor !== null
													|| args.lineColor !== null
												)
													? 'has'
													: 'no' 
											)}-palette`

										+ ` ${PREFIX}${(
												(
													__calculated.is_base('pie')
													&& !args.xTicks
													&& !args.yTicks
												)
													? 'no'
													: 'has'
											)}-ticks`

										+ ` ${PREFIX}${(
												(args.colorLegend )
													? 'no'
													: 'has'
											)}-legend`
											
										+ ` ${(
												(__calculated.is_base('pie') && args.piLabelStyle !== null)
													? ` ${PREFIX}pi-label-style-${args.piLabelStyle}`
													: ` ${PREFIX}no-label`
											)}`
									)
									.attr('viewBox', dimensionString)
									.attr('preserveAspectRatio', 'xMidYMid meet')
									.attr('xml:space','preserve')
									.attr('width',__calculated.outer('width'))
									.attr('height',__calculated.outer('height'))
									;

									
								//duration
								__calculated.duration = __calculated.svg.transition()
									.duration( args.transition )
									.ease(d3.easeLinear);
									
								__calculated.container = __calculated.svg.append('g')
									.attr('class',`${PREFIX}svg-wrapper`)
									.attr('font-size',args.fontSize)
									.style('line-height',1)
									.attr('transform',`translate( ${__calculated.margin.left} , ${__calculated.margin.top} )`);


								//tooltip
								if(args.tooltipEnable) {

									
									__calculated.svg.append('circle')
										.attr('class',PREFIX+'cursor-stalker')
										// .attr('r',10)
										// // .style('opacity',0)
										// .attr('fill','red');

									__calculated.tooltip_cursor_stalker = __calculated.svg.select(`circle.${PREFIX}cursor-stalker`)

									__calculated.tooltip = d3.tip()
										.attr('class',PREFIX+'tooltip')
										.style('width', () => {
											if(typeof args.tooltipWidth === 'number'){
												return `${parseFloat(args.tooltipWidth)}px`;
											}else if(args.tooltipWidth == 'auto'){
												return args.tooltipWidth;
											}
										})
										.style('text-align',args.tooltipTextAlign)
										.direction(args.tooltipDirectionParameter || args.tooltipDirection)
										.html(__calculated.tooltip_html)

									__calculated.svg.call(__calculated.tooltip);
								}

								//@TODO multiple here

								
								if(__calculated.is_base('pie')){
									//radius boi
									__calculated.pi_radius = (() => {
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
									__calculated.labels = __calculated.g.append('g')
										.attr('class', PREFIX + 'label');
						
									// container for axis
									__calculated.rulers = __calculated.g.append('g')
										.attr('class', PREFIX + 'axis')
										.attr('font-size',args.textTicksSize+'em');
										
									//kung may grid gibo kang grid
									if( args.xGrid || args.yGrid ){
										__calculated.grid = __calculated.g.append('g')
										.attr('class', PREFIX + 'grid')
										.attr('font-size',args.textTicksSize+'em');
									}
								}

								//style warns
								if(__calculated.is_debuggy){
									if(
										args.width == defaults.width
										&& args.height == defaults.height
										&& __calculated.data.complete > 9
									){
										
										console.warn(dv.selector+' Width and height was not adjusted. graph elements may not fit in the canvas');
									
									}else if(
										args.width < defaults.width
										&& args.height < defaults.height
									){

										console.warn(dv.selector+' set canvas width and or height may be too small.\n Tip: The given height and width are not absolute and act more like aspect ratios. svgs are responsive and will shrink along with content.');

									}

									if(
										(JSON.stringify(args.margin) == JSON.stringify(defaults.margin))
										&& (args.xLabel || args.yLabel)
										&& (args.xTicks || args.yTicks)
									){
										console.debug(dv.selector+' text may overlap. margins may need to be modified');
									}
								}



								// scales and shit
								DATUM_KEYS.forEach((keyKey)=>{

									//range
									__calculated['range_'+keyKey] = range(keyKey);

									//scale
									__calculated['the_'+keyKey] = scale(keyKey);

									//formatting of data on the graph
									__calculated['format_'+keyKey] = (() => {
										
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

											renderAxisContainers(axisName(keyKey),__calculated.rulers)
											
											if(args[axisName(keyKey)+'Grid']) {
												renderAxisContainers(axisName(keyKey),__calculated.grid,true)
											}

										case 'color':
											//colors kung meron
											if(args.colorPalette.length) {
												break;
											}
											
										default:
											
										
									}


								});

								renderGraph();
								
								// __calculated.resize = null;

								_1p21.graphs[dv.selector] = {data:__calculated.data,calcuated:__calculated};

								window.addEventListener("resize", () => {
									clearTimeout(__calculated.resize);
									__calculated.resize = setTimeout(() => {
										renderGraph();
									},300);
								});
								
							},args.delay);

						}
					},true);
				}else{
					renderError('Data for '+dv.selector+' was filtered and all items are invalid for visualizing. check provided data keys and make sure they are correct');
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
				const jsondv.Selector = document.getElementById(Str.hash(args.srcPath)).innerHTML;
				
				if( Str.isValidJSONString(jsondv.Selector) ){

					const dataIsJSON = JSON.parse(jsondv.Selector);
					init(dataIsJSON);
				}else{
					renderError('Data input may not be valid. Please check and update the syntax');
				}

			//o its not ok we normal now
			}else{
				switch( Str.fileExtension(args.srcPath) ) {
					case 'csv':
					case 'dsv':
					case 'tsv':
					case 'xml':
						d3[ Str.fileExtension(args.srcPath)](args.srcPath,(d)=>{
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