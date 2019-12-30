/*!
* 1point21 Data Vizualiser Version 1.2.0.2
* Render Script
* @license yes
* DO NOT EDIT min.js
* edit its corresponding unminified js file in /src instead
*/

/* DO NOT TOUCH I DEV ON THIS BOI I ENQUEUE THE MINIFIED ONE ANYWAY  :< */

"use strict";
(function(window,d3){


	var _1p21 = window._1p21 || {};

	//track present bois
	_1p21.graphs = {};
		

	// function that is open to the pooblic. this initiates the speshal boi
	_1p21.dataVisualizer = function(selector,arr){

		/*****************************************************************************
		 * HELPERS
		*****************************************************************************/
	
			// helpful variables
			var coordinates = ['x','y'],

				datum_keys = [0,1,'color','area'], 

				//yeeee
				prefix = 'data-visualizer-',


				//get the length attribute to associate with the axis bro
				getDimension = function(axisString,opposite){

					return opposite ?  ((axisString == 'x') ? 'height' : 'width') : ((axisString == 'x') ? 'width' : 'height');

				},

				// get the opposite boi for alignmeny purposes
				getAxisStringOppo = function(axisString) { return (axisString == 'x') ? 'y' : 'x'; },

				//d3 does not support ie 11. kill it
				isIE = function(){
					var ua = navigator.userAgent;
					return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1
				};


				//string helpers
					// duh
					String.prototype.getFileExtension = function() {

						return this.split('.').pop();

					}
					
					// convert boi to 
					String.prototype.getHash = function() {

						var url = this;
						var type = url.split('#');
						var hash = type[ (type.length - 1 )] || '';


						return hash;

					};

					String.prototype.isValidJSONString = function() {

						try {
							JSON.parse(this);
						} catch (e) {
							return false;
						}

						return true;

					}

					String.prototype.toCamelCase = function(){

						var str = this;

						return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
							return index == 0 ? word.toLowerCase() : word.toUpperCase();
						}).replace(/\s+/g, '');

					}

					//is that bitch boi dark? thank u internet
					var isDark = function(color) {

						// Variables for red, green, blue values
						var r, g, b, hsp;
						
						// Check the format of the color, HEX or RGB?
						if(color.match(/^rgb/)) {
					
							// If HEX --> store the red, green, blue values in separate variables
							color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
							
							r = color[1];
							g = color[2];
							b = color[3];
						} 
						else {
							
							// If RGB --> Convert it to HEX: http://gist.github.com/983661
							color = +("0x" + color.slice(1).replace( 
							color.length < 5 && /./g, '$&$&'));
					
							r = color >> 16;
							g = color >> 8 & 255;
							b = color & 255;
						}
						
						// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
						hsp = Math.sqrt(
							0.299 * (r * r) +
							0.587 * (g * g) +
							0.114 * (b * b)
						);
					
						// Using the HSP value, determine whether the color is light or dark
						
						if(hsp>170) { //127.5
							return false;
						} else {
							return true;
						}
					}



		/*****************************************************************************
		 * END HELPERS
		*****************************************************************************/

		
		// this is where the bitches at
		var dataContainer = document.querySelector(selector);
		
		if(isIE()){
			var error =  document.createElement('div')
			error.className = prefix+'wrapper fatality';
			error.innerHTML = 'Sorry, this graphic needs D3 to render the data but your browser does not support it.<br><br> Newer versions of Chrome, Edge, Firefox and Safari are recommended. <br><br>See <em><a target="_blank" rel="nofollow" href="https://d3-wiki.readthedocs.io/zh_CN/master/Home/#browser-platform-support">the official wiki</a></em> for more information';

			dataContainer.appendChild(error);
			

			// break;
			throw new Error('D3 not supported by browser');
		}

		//stor variables initiated after sucessful data call + parameter declaration set as something_`axis` so its easier to tell apart which shit is set by hooman and which one javascript sets up for hooman
		var _ = {};

		_.dv_container = dataContainer;

		//default params for hooman
		var defaults  = {
			
			//settings
				width: 600,
				height:600,
				margin: 40, 
				transition: 1500,
				delay: 250,
				fontSize: '16px',
				

			// content
				title:'',
				description:'',
			
				//src
				srcType: '',
				srcPath: '',
				srcKey: null,

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
					0:0,
					1: 1,
					color: null,
					area: null
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
						format1Prepend: '',
						format1Append: '',
						format1Parameter: null,
		
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
					piLabelStyle: null,
					piInRadius: 0,


				//tooltip
					tooltipEnable: false,
					tooltipTextAlign: 'left',
					tooltipWidth: 'auto',
					tooltipDirection: 'n',
					tooltipDirectionParameter: null,
					tooltipContent: null,

			

			//2.0.0 new args
				//src
					srcMultiple: false,
					srcKeyMultiple: null,

				//kulay
					colorBy: 'key', //set will influence key.color
					
					//advanced
					colorScheme: null,

				
		};

		//merge defaults with custom
		var args = defaults;
		for (var prop in arr) {
			if(arr.hasOwnProperty.call(arr,prop)) {
				// Push each value from `obj` into `extended`
				args[prop] = arr[prop];
			}
		}

		/*****************************************************************************
		 * MAP BOOL PROPERTIES FOR LESS EXTENSIVE LOGICS
		*****************************************************************************/

			_.user_can_debug = document.body.classList.contains('logged-in');
			

			_.has_text = (function(){

				if(
					!args.toolTip
					&& (
						(
							args.type !== 'pie'
							&& args.type !== 'scatter'
							&& ( !args.xTicks || !args.yTicks )
						)
						|| (
							args.type == 'pie'
							&& ( args.piLabelStyle || !args.colorLegend )
						)
					)
				){
					return true
				}else{
					return false;
				}

			}())
		
			_.has_both_text_on_blob = (function(){

				if(
					_.has_text
					&& (
						(
							(args.type !== 'pie')
							&& (!args.xTicks && !args.yTicks)
						)
						|| (
							args.type == 'pie'
							&& !args.colorLegend
							&& args.piLabelStyle !== null
						)
					)
				){
					return true;
				}else{
					return false;
				}

			}());

			//for calculating the height and offset for spacing on text elements by the blob items vertically. value is sum of both sides
			_.text_padding = 2.25;

		/*****************************************************************************
		 * END MAP BOOL PROPERTIES FOR LESS EXTENSIVE LOGICS
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getAxisString
		*****************************************************************************/
			var getAxisString = function(key){
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
			var getNearest = function(num){
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
		 * FUNCTION: deepGet
		*****************************************************************************/

			// get data but with aility to get down deep because we never know where the fuck the date will be at
			// @param obj : duh 
			// @param keystring : hooman provided object key string that is hopefully correct 
			// @param isNum : if the data is a number 
			var deepGet = function (obj,keyString, isNum) {
				
				var splitString = keyString.toString().split('.');
				isNum = isNum || false;

				//remove empty instances because they just mess with the loop
				splitString.forEach(function(key,i){

					(key == '') && splitString.splice(i, 1);

				})

				function multiIndex(obj,is) {

					var toReturn = null;

					if(is.length){
						toReturn = multiIndex(obj[is[0]],is.slice(1))
					}else{
						toReturn = ( isNum == true ) ? parseFloat(obj) : obj;


					}

					return toReturn;
				}

				var value = multiIndex(obj,splitString);
				

				if(isNum == true && isNaN(value)){

					console.warn(selector+' data with the key source of `'+keyString+ '` was passed as numeric but is not.' )
				}
				return value;

			}

		/*****************************************************************************
		 * ENDFUNCTION: deepGet
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getRange
		*****************************************************************************/

			//set range of the bois
			// @param itemAtt : duh
			var getRange = function(key){

				var range = [];

				switch(key){

					case 'color':

						range = args[key+'Palette'];
						break;
					case 'area':
						range = [args.areaMin,args.areaMax];
						break;

					case 0:
					case 1:
						
						if(
							args[ getAxisStringOppo( getAxisString(key)) + 'Align'] == 'top'
							|| args[getAxisStringOppo( getAxisString(key))+'Align'] == 'left'
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
			var getDomain = function(keyKey,dat){

				var domain = [],
				keyString = args.key[ keyKey ];
				if(keyString){
				switch(keyKey){
					
					case 'color':
						
						var instances = dat.reduce(function(acc,dis){
							if(!acc.includes(deepGet(dis, keyString ))){
								acc.push(deepGet(dis, keyString ));
							}
							
							return acc;
						},[]);

						domain = instances;

						break;

					case 'area':
					case 0:
					case 1:

						if(args.nameIsNum == true || keyKey == 1 || keyKey == 'area'){

							var min,max;

							//min
							if(args[getAxisString(keyKey) + 'Min'] !== null && keyKey !== 'area'){

								min = args[getAxisString(keyKey) + 'Min'];
							}else{
								min = d3.min(dat,function(dis){
									return deepGet(dis, keyString, true);
								});
							}
							
							//max
							if(args[getAxisString(keyKey) + 'Max'] !== null && keyKey !== 'area'){

								max = args[getAxisString(keyKey) + 'Max']
							}else{
								max = d3.max(dat,function(dis){
									return deepGet(dis,keyString,true);
								});
							}

							domain = [min,max];

							//if it a scatter plot we shit on the boi
							if(args.type == 'scatter' && keyKey == 0){
								
								var newMin = getNearest(min),
									newMax = getNearest(max);

								domain = [newMin,newMax];
							}

						}else{
							
							domain =  dat.map(function(dis){
								return deepGet(dis, keyString, false);
							});

						}



						if(args.reverse[keyKey]) {
							// dont use .reverse because it's a piece of shit
							var domainReverse = [];
							for (var i = domain.length - 1; i >= 0; i--) {
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
			var getLabelOrigin = function(coordinateAttribute,axisString){ 
				var offset = 0;

				if(coordinateAttribute == 'x'){ //x

					if(axisString == 'x'){

						offset = args[getDimension(axisString)] / 2;

					}else if(axisString == 'y'){

						offset = -(args[getDimension(axisString)] / 2)
						
					};
					
				}else{ //y
					
					if(axisString == 'x'){

						if(args[axisString+'Align'] == 'bottom'){

							offset = args[getDimension(axisString,true)] + (_.margin.bottom * .875); 
							
						}else{

							offset = -(_.margin.top * .875);

						}

					}else if(axisString == 'y'){

						if(args[axisString+'Align'] == 'right'){

							offset = args[getDimension(axisString,true)] + ((_.margin.right * .875) + _.text_base_size);

						}else{

							offset = -((_.margin.left * .875) - _.text_base_size)

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
			var getBlobSize = function(axisString,dis,i,initial) {

				var keyKey  =  args[axisString+'Data'],
					oppositeAxisAlignment = args[ getAxisStringOppo(axisString)+'Align'],
					dimension = 20;
					initial = initial || false;

				switch(args.type) {

					case 'pie': //eehhhh
						break;

					default:

						if(args.nameIsNum == true ||  keyKey  == 1){
							if(initial) {
								
								dimension = 0;
							
							}else{

								if( oppositeAxisAlignment == 'right' || oppositeAxisAlignment == 'bottom' ){
									
									dimension = args[getDimension(axisString)] - _['the_'+ keyKey]( deepGet(dis, args.key[ keyKey ] ,true) );
								
								}else{

									dimension = _['the_'+ keyKey ]( deepGet( dis, args.key[ keyKey ] ,true ) );

								}

							}
						}else{
							dimension = _[ 'the_'+ keyKey ].bandwidth()
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
			var getBlobRadius = function(dis,i,initial){
				initial = initial || false;
				var radius = initial ? 0 : 2;

				if(!initial){


					if(args.type == 'line'){
			
						if(args.type == 'line' && args.linePointsSize){
							radius = args.linePointsSize
						}
			
					}else if(args.type == 'scatter' && args.key['area'] ){
			
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
			var getBlobTextAnchor = function(dis,i){

				var anchor = 'middle';

				if(args.type == 'pie'){
				
				}else{

					if(args.yData == 0) {
						anchor = 'start';
					}

					coordinates.forEach(function(coordinate){

						if(
							args[ getAxisStringOppo(coordinate)+'Data'] == 0
							&& args[ getAxisStringOppo(coordinate)+'Align'] == 'right'
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
			var getBlobTextBaselineShift = function(coordinateAttr,keyKey){

				var shift = '0em';

				if( _.has_both_text_on_blob ){


					if(
						(coordinateAttr == 'y')
						&& _.has_both_text_on_blob
					){
						// calculate height
						var full_height = _.text_base_size * (args.textNameSize + args.textValueSize + _.text_padding) // .5 margin top bottom and between text
						
						if( keyKey == 1){

							shift = ( ((full_height  * -.5) + ( (_.text_base_size * args.textValueSize) * .5) + ( _.text_base_size ) )  / (_.text_base_size * args.textValueSize) ) + 'em'
						}else{
							shift =( ((full_height * .5) - ( (_.text_base_size * args.textNameSize) * .5) - ( _.text_base_size ) ) / (_.text_base_size * args.textNameSize) ) + 'em'
						}

					}
				
			}
				

				return shift;

			}

		/*****************************************************************************
		 * ENDFUNCTION: getBlobTextBaselineShift
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getBlobTextOrigin
		*****************************************************************************/


			var getBlobTextOrigin = function(coordinate,dis,i,initial){
				
				initial = initial || false;
				//coordinate is influenced by the axis right now so this is the only time coordinate and axis is one and the same. i think... do not trust me on this
				var keyKey =  args[ coordinate+'Data'],
					offset = 0;

				if(args.type == 'pie'){

					var customInitial = (function(){
							return (args.piLabelStyle == 'linked') ?  false : initial;
						}()),
						
						multiplier = (function(){
							var toReturn = 0;
							if(args.piLabelStyle == 'linked'){
								toReturn =  initial ? 1 : 2.5;
							}else{
								if(initial == false) {

									toReturn = 1;
								}
							}


							return toReturn;

						}()),

						calcWithInnerRadius = args.piLabelStyle == 'linked' ? false : true,
						
						orArr =  getArcPath( getPiData(i) ,calcWithInnerRadius,'centroid',multiplier,customInitial);

						offset = ( coordinate =='x') ? orArr[0] : orArr[1];
					
				}else{

					// offset by where the coordinates of the ends of the blob and axis alignment is at and spaces it by the dimensions of the text bitches
					var shiftPad = function(){
						var value = 0,
						multiplier = 1;

						if(!(initial || args.type == 'scatter')){

							if(
								
								args[getAxisStringOppo(coordinate)+'Align'] == 'bottom'
								|| args[getAxisStringOppo(coordinate)+'Align'] == 'right'
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
					shiftArea = function(){
						
						var multiplier = 1,
							value = 0;

						if(!(initial || args.type == 'scatter')) {

							if(
								(
									(args.type !== 'bar' || !args.barTextWithin)
									&& (
										args[getAxisStringOppo(coordinate)+'Align'] == 'bottom'
										|| args[getAxisStringOppo(coordinate)+'Align'] == 'right'
									)
								)
								|| (
									(args.type == 'bar' && args.barTextWithin)
									&& (
										args[getAxisStringOppo(coordinate)+'Align'] == 'top'
										|| args[getAxisStringOppo(coordinate)+'Align'] == 'left'
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
										(args.type !== 'bar' || !args.barTextWithin)
										&& (parseFloat(getBlobSize(coordinate,dis,i)) >= (args[getDimension(coordinate,true)] - _.m_length(coordinate,i)) )
									){
										value = -_.m_length(coordinate,i);
									}else if(
										(args.type == 'bar' && args.barTextWithin)
										&& (parseFloat(getBlobSize(coordinate,dis,i)) < _.m_length(coordinate,i))
									 ){
										value = -getBlobSize(coordinate,dis,i);
									}

								}else{
									if(
										(
											(args.type !== 'bar' || !args.barTextWithin)
											&& (parseFloat(getBlobSize(coordinate,dis,i)) >= (args[getDimension(coordinate,true)] - _.m_length(coordinate,i)) )
										)
										|| (
											(args.type == 'bar' && args.barTextWithin)
											&& (parseFloat(getBlobSize(coordinate,dis,i)) < _.m_length(coordinate,i))
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
						
						return value;//

					};




					if( keyKey  == 0) {

						offset = getBlobOrigin(coordinate,dis,i);

						if(args.type == 'bar') {
							offset += getBlobSize(coordinate,dis,i) / 2;
						}

					}else{
						
						switch(args[getAxisStringOppo(coordinate)+'Align']){

							case 'top':

								if(!initial && args.type !== 'scatter'){
									offset = getBlobSize(coordinate,dis,i)
								}
								break;

							case 'right':
							case 'bottom':
								if(
									initial && args.type !== 'scatter'
									|| (args.barTextWithin && args[getAxisStringOppo(coordinate)+'Align'] == 'right')
								) {

									offset = args[getDimension(coordinate)];

								}else{

									offset = args[getDimension(coordinate)] - getBlobSize(coordinate,dis,i);
									
								}

								break;

							case 'left':

								if( args.type !== 'bar' ||  !args.barTextWithin ){

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

			var getBlobOrigin = function(coordinate,dis,i,initial){
				// same here.. could be the same probably
				var keyKey =  args[ coordinate+'Data'],
					oppositeAxisAlignment = args[ getAxisStringOppo(coordinate)+'Align'],
					offset = 0;

					initial = initial || false;

				if(args.type !== 'pie') {

					if( args.nameIsNum == true || keyKey == 1){
						
						if( oppositeAxisAlignment == 'right' || oppositeAxisAlignment == 'bottom' ){
							
							if(initial && keyKey !== 0 && args.type !== 'scatter'){

								offset = args[getDimension(coordinate)];

							}else{

								offset = args[getDimension(coordinate)] - (args[getDimension(coordinate)] - _['the_'+ args[coordinate+'Data'] ]( deepGet(dis, args.key[ keyKey ], true )));

							}

						}else{

							if(args.type == 'line' || args.type == 'scatter'){
								if(!(initial && keyKey !== 0 && args.type !== 'scatter')){

									offset = _['the_'+ args[coordinate+'Data'] ]( deepGet(dis, args.key[ keyKey ], true ));

								}

							}
							
						}

					}else{

						offset = _['the_'+ args[coordinate+'Data'] ](deepGet(dis, args.key[ keyKey ], false));
						
						if(
							(args.type == 'line' || args.type == 'scatter')
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
			
			var getLegendOrigin = function(axisString){
				if( _.container_legend ){

					var offset = 0,
						length = axisString == 'x' ? _.container_legend.nodes()[0].getBoundingClientRect()[getDimension(axisString)] : _.legend_height, // .8
					
					shifter = function(){
						var value = 0,
							multiplier = 1;

						//multiplier
						if (
							args.type == 'pie'
							|| 
							(
								args.type !== 'pie'
								&& args[getAxisStringOppo(axisString)+'Align'] == 'left'
								|| args[getAxisStringOppo(axisString)+'Align'] == 'top'
							)
						){
							multiplier = -1;
						}

						//how much of length to shift
						if (
							(args.type == 'pie' && axisString == 'x')
							|| 
							(
								args.type !== 'pie'
								&& args[getAxisStringOppo(axisString)+'Align'] == 'left'
								|| args[getAxisStringOppo(axisString)+'Align'] == 'top'
							)
						){

							value = length + _.text_base_size;

						} else if(  (args.type == 'pie' && axisString == 'y') ){
								value = length * .5;

						}
							
						return value * multiplier;
					};

					if (
						(args.type == 'pie' && axisString == 'x')
						|| 
						(
							args.type !== 'pie'
							&& args[getAxisStringOppo(axisString)+'Align'] == 'left'
							|| args[getAxisStringOppo(axisString)+'Align'] == 'top'
						)
					){
						offset = args[getDimension(axisString)];

					}else if( (args.type == 'pie' && axisString == 'y') ){
						
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

			var getLinePath = function(isArea,initial){


				var pathInitiator = isArea ? 'area' : 'line',
					axisToFill = ( args.xData == 0 )  ? 'x' : 'y',
					pathStyle = (function(){
						var theString = 'curveLinear';
						switch(args.lineStyle){
							case 'step':
								theString = 'curveStepAfter'
								break;
							case 'curve':
									theString = 'curveMonotone'+(axisToFill).toUpperCase()
									break;
						}
						return theString
					}()),
					
					path = d3[pathInitiator]();
				if(pathInitiator == 'area') {

					//name coord, value coord, fill coordinate
					var aCord = { //default is top
						name: axisToFill, //x
						value: getAxisStringOppo(axisToFill)+1, //y
						fill: getAxisStringOppo(axisToFill)+0 //initial of data name is the bottom of the fill
					};
					
					var multiplier = (function(){
						var toReturn = 0;

						if(args.lineFillInvert){
							toReturn = ((args[axisToFill+'Align'] == 'top') || (args[axisToFill+'Align'] == 'left' )) ? 1 : -1;
						}

						return toReturn;
					}());
					
					
					path
						[aCord.name](function(dis,i){
							return getBlobOrigin(axisToFill,dis,i,initial); 
						})
						[aCord.value](function(dis,i){
							return getBlobOrigin(getAxisStringOppo(axisToFill),dis,i,initial);
						})
						[aCord.fill](function(dis,i){
							return getBlobOrigin( getAxisStringOppo(axisToFill),dis,i,true) + (multiplier * args[getDimension(axisToFill)]);
						});

				}else{

					path
						.x(function(dis,i){
							return getBlobOrigin('x',dis,i,initial);
						})
						.y(function(dis,i){
							return getBlobOrigin('y',dis,i,initial);
						});

				}

				if(pathStyle){
					path.curve(d3[pathStyle]);
				}
				
				// var i = d3.interpolate(path.start(_.data),path.end(_.data))

				// return function(t) {
				//	 return i(t);
				// }

				return path(_.data);

			}

		/*****************************************************************************
		 * ENDFUNCTION: getLinePath
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getArcPath
		*****************************************************************************/

			var getArcPath = function(disPi,calcWithInnerRadius,subMethod,outerRadiusMultiplier,initial){
				outerRadiusMultiplier = outerRadiusMultiplier || 1;
				subMethod = subMethod || '';
				calcWithInnerRadius = calcWithInnerRadius || false;
				initial = initial || false;

				var innerRadius = (function(){
					var toReturn = 0;

					if( calcWithInnerRadius ){
						toReturn = _.pi_radius * args.piInRadius;
					}

					return toReturn;
				}()),
					outerRadius = (function(){
					var toReturn = 0;

					if(!initial || ( initial && (outerRadiusMultiplier <=1 ) && calcWithInnerRadius == false )){
						toReturn = _.pi_radius * outerRadiusMultiplier;
					}

					return toReturn;
				}()),
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

			var getPiData = function(i){

				var pie =  d3.pie()
					.sort(null)
					.value(function(dis,i){
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

			var getPiOrigin = function(axisString){
				var offset = 0;

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

			var getMidAngle = function(disPi){
			return disPi.startAngle + (disPi.endAngle - disPi.startAngle)/2;
			}

		/*****************************************************************************
		 * ENDFUNCTION: getMidAngle
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: getInterpolation
		*****************************************************************************/

			var getInterpolation = function(start,end,fn,d3fn){
				fn = fn || function(value,start,end){ return value; };
				d3fn = d3fn || 'interpolate';

				var i = d3[d3fn](start,end);


				return function(t) {
					var interVal = i(t);
					// fn(interVal);

					return fn(interVal,start,end);
				}
			}

		/*****************************************************************************
		 * ENDFUNCTION: getInterpolation
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: setScale
		*****************************************************************************/

			var setScale = function(keyKey){
				
				var scale;

				switch(keyKey){

					case 'color':
							scale = d3.scaleOrdinal()
								.range(_['range_'+keyKey]) 
						break;

					case 'area':
					case 0:
					case 1:

						if(args.nameIsNum == true || keyKey == 1 || keyKey == 'area' ){
							if(args.nameIsNum == true && keyKey == 0 && args.type == 'scatter'){

								scale = d3.scaleSymlog()
									.constant(10)
									.range(_['range_'+keyKey]);
							}else{
								scale = d3.scaleLinear()
									.range(_['range_'+keyKey]);
							}
							
							
						}else{
							if(args.type == 'line' || args.type == 'scatter'){
								
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
			var renderAxisContainers = function(axisString,containerObj,isGrid) {


				if( args[axisString+'Ticks']) {
					isGrid = isGrid || false;
					var alignString = args[axisString+'Align'],
						tickContainer = (isGrid ? 'grid_' : 'rule_')+axisString;


					// label
						if( args[axisString+'Label'] && !isGrid ){
							
							_['lab_'+axisString] = _.container_lab.append('text')
								.attr('class', prefix + 'label-'+axisString)
								.attr('y', function(){
									return getLabelOrigin('y',axisString);
								})
								.attr('x', function(){
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
							.attr('class', function(){
			
									var contClass = null;
			
									if(isGrid){
			
										contClass =
											prefix
											+ 'grid-'+axisString
											+ ' grid-increment-' + args[axisString+'GridIncrement'];
										
									}else{
			
										contClass =
											prefix
											+ 'axis-'+axisString+' '
											+ prefix +'axis-align-'+alignString;
			
									}
			
									return contClass;
			
								}
			
							);
			
							var transformCoord = '';
						
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
		 * FUNCTION: setAxis
		*****************************************************************************/

			var setAxis = function(axisString,isGrid){
				//axis functiono

				
					isGrid = isGrid || false;
					var axisKey = 'Axis '+ args[axisString+'Align'];
					var	axisToReturn = d3[axisKey.toCamelCase()](_['the_'+ args[axisString+'Data']]);

				if(args[axisString +'Ticks']){

					if(args.type == 'scatter' && args[axisString+'Data'] == 0 && args.nameIsNum == true ){
						var tickValues = function(){
							var values = [],
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
						
						var ticksAmount = function(){

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
							.tickFormat(function(dis,i){
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

			var renderCursorStalker = function(d3_event){

				return _.tooltip_cursor_stalker 
					.attr('cx',  ( d3_event.offsetX * ( _.outer_width / _.svg.node().clientWidth ) ) + 'px')
					.attr('cy',  ( d3_event.offsetY * (  _.outer_height / _.svg.node().clientHeight ) ) + 'px')
					.node();

			}

		/*****************************************************************************
		 * ENDFUNCTION: renderCursorStalker
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: renderError
		*****************************************************************************/

			var renderError = function(theConsoleError,useThrow){
				useThrow = useThrow || true;
				var errorFront = "Sorry, unable to display data." + (  _.user_can_debug ? "<br> Please check the console for more details" : '');
				d3.select(selector).classed(prefix+'initialized',true);

				if(!dataContainer.querySelector('.'+prefix+'wrapper.fatality')){
					d3.select(selector).append('div')
						.attr('class',prefix+'wrapper fatality')
						.html( errorFront );
				}

				if(!useThrow) {
					console.error(theConsoleError);
				}else{
					throw new Error(theConsoleError)
				}
			}

		/*****************************************************************************
		 * ENDFUNCTION: renderError
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: renderGraph
		*****************************************************************************/

			// fuck these bois up. pass data again in case changing data is a future feature
			var renderGraph = function(incomingData) {
				_.data = incomingData;
				// ok do the thing now
				console.log(
					"\n",
					selector,'('+args.title+')','-------------------------------------------------------------------',"\n",
					'calculated shit',_,"\n",
					'data',_.data,"\n",
					'args',args,"\n",
					"\n"
				);

				datum_keys.forEach(function(keyKey){

					//get domain
					_['dom_'+keyKey] = getDomain(keyKey,_.data);

					//set that fucker
					if(_['the_'+keyKey] && _['dom_'+keyKey]) {
						_['the_'+keyKey].domain(_['dom_'+keyKey]);
					}

				});
					
				// axis + grid
				if(args.type !== 'pie'){

					coordinates.forEach(function(coordinate){
						if( args[coordinate+'Ticks'] ){
							_['rule_'+coordinate+'_axis'] = setAxis(coordinate);
									
							_['rule_'+coordinate]
								.transition(args.duration)
								.call( _['rule_'+coordinate+'_axis'] )
								.attr('font-family',null)
								.attr('font-size',null);
		
							if(args[coordinate+'Grid']){
							_['grid_'+coordinate+'_axis'] = setAxis(coordinate,true);
								
								_['grid_'+coordinate]
									.transition(args.duration)
									.call( _['grid_'+coordinate+'_axis'] );
									
								_['grid_'+coordinate].selectAll('g')
									.classed('grid',true)
									.filter(function(dis,i){
										
										//IM HERE FUCKER
										var isAligned = false;
										_['rule_'+coordinate].selectAll('g').each(function(tik){
											//if current looped tik matches dis grid data, add the class boi
											if(tik == dis){
												isAligned = true;
											};
										})
		
										return isAligned;
		
									})
									.classed('tick-aligned',true)
		
							}
		
						}
					});
				}
					


				_.blob = _.container_graph.selectAll(_.graph_item_element +'.'+prefix + 'graph-item.graph-item-blob')
					.data(_.data,function(dis){
						
						return deepGet(dis,args.key[0])
					});


			
				//blob exit
				_.blob.exit()
					.transition(_.duration)
					.attr('fill','transparent')
					.attr('stroke','transparent')
					.remove();

				//text exit
				if( _.has_text ){

					_.blob_text = _.container_graph.selectAll('text.'+prefix + 'graph-item.graph-item-text')
						.data(_.data,function(dis){
							return deepGet(dis,args.key[0])
						});

				
					_.blob_text.exit()
						.transition(_.duration)
						.attr('fill','transparent')
						.attr('stroke','transparent')
						.remove();
					
					if(args.type == 'pie' && args.piLabelStyle == 'linked'){

						_.blob_text_link = _.container_graph.selectAll('polyline.'+prefix + 'graph-item.graph-item-link')
							.data(_.data,function(dis){
								return deepGet(dis,args.key[0])
							});

						_.blob_text_link.exit()
							.transition(_.duration)
							.attr('fill','transparent')
							.attr('stroke','transparent')
							.remove();

					}
				}


				// //generate the graph bitches
				if(args.type !== 'pie'){
					
					// line graph + fill
					if(args.type == 'line'){
						
						_.line = _.container_graph.select('.'+prefix+'line').remove();

						_.line = _.container_graph.append('path').lower()
							.attr('class',prefix+'line' + ((args.lineColor !== null) ? ' has-color' : ' no-color' ))
							.attr('fill','none')
							.attr('stroke-width',args.lineWeight)
							.attr('stroke-linejoin','round')
							.attr('stroke-dasharray',args.lineDash)
							.attr('stroke-opacity',1)
							.attr('stroke-dasharray','0,0')
							.transition(_.duration)
								.attrTween('d',function(){
									return getInterpolation(
										getLinePath(false,true),
										getLinePath(false,false)
									)
								});

							if(args.lineColor) {
								_.line
									.attr('stroke',args.lineColor)
							}

						
						
							if(args.lineFill){

								_.fill = _.container_graph.select('.'+prefix+'fill').remove();
								
								_.fill = _.container_graph.append('path').lower()
									.attr('class',prefix+'fill'+ ((args.lineFillColor !== null || args.lineColor !== null) ? ' has-color' : ' no-color' ))
									.attr('fill-opacity',args.lineFillOpacity)
									;
	
								_.fill
									.transition(_.duration)
										.attrTween('d',function(){
											return getInterpolation(
												getLinePath(true,true),
												getLinePath(true,false)
											)
										})
									;
	
								if( args.lineFillColor || args.lineColor ) {
									_.fill
										.attr('fill', args.lineFillColor || args.lineColor);
								}
	
							}
							
					}
				
				}

				// bars, scatter plots, pizza, points
				
					
					
					_.enter_blob = _.blob.enter()
						.append(_.graph_item_element)
							.attr('class', function(dis){
								return prefix + 'graph-item graph-item-blob'
									+ ' '+ 'data-name-'+deepGet(dis,args.key[0]);
							});

						_.merge_blob = _.blob.merge(_.enter_blob)
							
						//coordinates
						if(args.type !== 'pie'){

							_.merge_blob
								.transition(_.duration)
									.attrTween(
										((args.type == 'line' || args.type == 'scatter') ? 'cx' : 'x'),
										function(dis,i){
											return getInterpolation(
												getBlobOrigin('x',dis,i,true),
												getBlobOrigin('x',dis,i,false)
											)
										}
									)
									.attrTween(
										((args.type == 'line' || args.type == 'scatter') ? 'cy' : 'y'),
										function(dis,i){
											return getInterpolation(
												getBlobOrigin('y',dis,i,true),
												getBlobOrigin('y',dis,i,false)
											)
										}
									)
									;

						}

						//areas and what not
						if(args.type == 'pie'){
							
							_.merge_blob
								.transition(_.duration)
									.attrTween('d',function(dis,i){
										
										var current = getPiData(i);
										
										return getInterpolation(
											current.endAngle,
											current.startAngle,
											function(value){

												current.startAngle = value;
												return getArcPath(current,true);
											}
										)
									});

						}
						
						if(args.type == 'line' || args.type == 'scatter'){
							_.merge_blob
								.transition(_.duration)
									.attrTween('r',function(dis,i){
										return getInterpolation(
											getBlobRadius(dis,i,true),
											getBlobRadius(dis,i,false)
										);
									})

							if(args.type == 'line' && !args.linePoints) {
								_.merge_blob
									.attr('fill-opacity',0)
									.attr('stroke-opacity',0);
							}


						}else{
							_.merge_blob
								.transition(_.duration)
									.attrTween('width',function(dis,i){
										return getInterpolation(
											getBlobSize('x',dis,i,true),
											getBlobSize('x',dis,i,false)
										);
									}) // _ width
									.attrTween('height',function(dis,i){
										return getInterpolation(
											getBlobSize('y',dis,i,true),
											getBlobSize('y',dis,i,false)
										);
									})
						}

						//tooltip
						if(args.tooltipEnable) {
							_.merge_blob
								.on('mousemove',function(dis){
										_.tooltip.show(dis,renderCursorStalker(d3.event));
								})
								.on('mouseleave',_.tooltip.hide);
						}
						
						//line  colors
						if(!args.colorPalette.length){
							if(
								args.type == 'line'
								&& (
									args.linePointsColor
									|| args.lineColor
								)
							) {
								_.merge_blob
									.attr('fill',function(){
										return args.linePointsColor || args.lineColor;
									});

							}
						}else{
							_.merge_blob
								.attr('fill',function(dis,i){
									return _.the_color(deepGet(dis,args.key.color));
								});

								if(args.type == 'scatter'){
									_.merge_blob
										.attr('fill-opacity',args.areaOpacity)
										.attr('stroke-width',1)
										.attr('stroke',function(dis,i){
											return _.the_color(deepGet(dis,args.key.color));
										})
								}
						}

					
				//graph item label if ticks are not set
				if(
					_.has_text
				){

					// pie polyline
					if(_.blob_text_link ){
						
						_.enter_blob_text_link = _.blob_text_link
							.enter()
							.append('polyline')
							.attr('class',function(dis){
								return prefix+'graph-item graph-item-link' 
									+ ' '+ 'data-name-'+deepGet(dis,args.key[0]);
							})

						
						_.merge_blob_text_link = _.blob_text_link.merge(_.enter_blob_text_link)
							.transition(_.duration)
							.attrTween('stroke-opacity',function(dis,i){
								
								return getInterpolation(0,.75);
							})
							.attrTween('points',function(dis,i){
								
								//in pie, initial means it starts at zero but we dont want that so dont set the initial to true
								var start = [
										getArcPath(getPiData(i),true,'centroid',1,false), //first coord is centroid of our pie boi
										getArcPath(getPiData(i),true,'centroid',1,false), // second is outer radius.
									],
									end = [

										getArcPath(getPiData(i),true,'centroid',1,false),
										getArcPath(getPiData(i),false,'centroid',2.25,false),
									];

								return getInterpolation(
									start,
									end
								)
							});

					}

					_.enter_blob_text = _.blob_text
						.enter()
						.append('text')
						.attr('line-height',1.25)
						.attr('dominant-baseline','middle')
						;

					//append content right away so we can calculate where shit offset
					[0,1].forEach(function(keyKey){

						if(
							(
								args.type !== 'pie'
								&& !args[getAxisString(keyKey)+'Ticks']
							)
							|| (
								args.type == 'pie'
								&& (
									( keyKey == 0 && !args.colorLegend )
									|| ( keyKey == 1 && args.piLabelStyle !== null )
								)
							)
						){

							_['blob_text_'+keyKey] = _.enter_blob_text.append('tspan')

								.attr('class', function(dis){
									return 'graph-item-text-data-'+keyKey
										+ ' '+ 'data-name-'+deepGet(dis,args.key[0]);
								} )
								.attr('dominant-baseline','middle')
								.attr('text-anchor',function(dis,i){
									return getBlobTextAnchor(dis,i);
								})
								.attr('font-size',function(){
									var toReturn = null;

									if(
										(
											args.type !== 'pie'
											&& !args[ getAxisStringOppo ( getAxisString(keyKey) )+'Ticks']
										)
										|| (
											args.type == 'pie'
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
								.attr('font-weight',function(){
									var toReturn = 700;

									if(
										(
											args.type !== 'pie'
											&& !args[ getAxisStringOppo ( getAxisString(keyKey) )+'Ticks']
										)
										|| (
											args.type == 'pie'
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
								.text(function(dis,i){
									return _['format_'+ keyKey ]( deepGet(dis,args.key[ keyKey ]) );
								})

						}
						
					});

					//continue fucking with text blob
					_.merge_blob_text = _.blob_text.merge(_.enter_blob_text);


					//set a minimum length for graph items to offset its text bois. doesnt matter which data key is on the axis we just want the width or height of the graph item on the given axis
					// add padding for less math i think
					_.m_length = function(axisString,i){

						if(_.has_text && _.merge_blob_text){
							var value = 0;

							if( getDimension( axisString ) == 'width' ) {
								value = (_.merge_blob_text.nodes()[i].getBBox()[ getDimension( axisString ) ]) + (_.text_padding * _.text_base_size);
							}else{
								value = (_.text_base_size * (args.textNameSize + args.textValueSize + _.text_padding));
							}

							return parseFloat(value);
						}
					};


					_.merge_blob_text
						.attr('class', function(dis,i){
							var classString =  prefix + 'graph-item graph-item-text';
							
							if( 
								(
									(args.type == 'bar')
									&& (
										
										(
											
											args.barTextWithin
											&& (
												( // it out
													(parseFloat(getBlobSize(getAxisString(1),dis,i,false)) < _.m_length(getAxisString(1),i))
													&& !isDark(args.colorBackground)
												)
												|| ( //it in
													(parseFloat(getBlobSize(getAxisString(1),dis,i,false)) >= _.m_length(getAxisString(1),i))
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
														(parseFloat(getBlobSize(getAxisString(1),dis,i,false)) + _.m_length(getAxisString(1),i)) <=  args[getDimension(getAxisString(1))]
													)
													&& !isDark(args.colorBackground)
												)
												|| ( //it in
													(
														(parseFloat(getBlobSize(getAxisString(1),dis,i,false)) + _.m_length(getAxisString(1),i)) > args[getDimension(getAxisString(1))]
													)
													&& (args.colorPalette.length > 0)
													&& !isDark( _.the_color(deepGet(dis,args.key.color)) )
												)
											)
										)
									)
								)
								|| (
									(args.type == 'line' || args.type == 'scatter')
									&& !isDark(args.colorBackground)
								)
								|| (
									args.type == 'pie'
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
						.attr('stroke',function(dis){
							if(
								(
									args.type == 'pie'
									&& args.piLabelStyle == 'within'
									&& args.colorPalette.length > 0
								)
								// || (
								// 	args.type == 'bar' 
								// 	&& args.barTextWithin
								// ) @TODO this
							){
								return _.the_color(deepGet(dis,args.key.color))

							}else if(
								(args.type !== 'bar' && args.type !== 'pie')
								|| (
									args.type == 'pie'
									&& args.piLabelStyle == 'linked'
								)
							){
								return args.colorBackground;
							}
						})
						.transition(_.duration)
							.attrTween('transform',function(dis,i){

								var dataToUse = args.type == 'pie' ? getPiData(i) : dis;
									
								return getInterpolation(
									'translate('
										+getBlobTextOrigin('x',dataToUse,i,true)
										+','
										+getBlobTextOrigin('y',dataToUse,i,true)
									+')',
									'translate('
										+getBlobTextOrigin('x',dataToUse,i,false)
										+','
										+getBlobTextOrigin('y',dataToUse,i,false)
									+')'
								)

							})
							.styleTween('opacity',function(){
								return getInterpolation(0,1);
							});

					
				}

				//legends boi
				if(args.colorLegend){
					_.legend_height = 0;

					if(_.container_legend){
						_.container_legend.remove();
					}


					_.container_legend = _.container.append('g')
						.attr('class',prefix+'legend')
						.attr('font-size', args.textLegendSize+'em');
						
						
					_.dom_color.forEach(function(key,i){
						_.legend = _.container_legend.append('g')
							.attr('class',prefix+'legend-item')


						_.legend.append('rect')
						.attr('class','legend-item-blob')
							.attr('width',_.legend_size * .75)
							.attr('height',_.legend_size * .75)
							.attr('fill',_.the_color(key) )
							.attr('stroke',args.colorBackground);

						_.legend.append("text")
							.attr('class','legend-item-text')
							.text(key)
							.attr('dominant-baseline','middle')
							.attr('x',_.legend_size)
							.attr('y',_.legend_size * .375)
							.attr('stroke',args.colorBackground);
							
						_.legend
							.attr("transform", "translate(0, " + (i *  _.legend_size) + ")");

						_.legend_height += _.legend_size;

							
					});

					_.container_legend
						.attr('transform','translate('+getLegendOrigin('x')+','+getLegendOrigin('y')+')')
						.transition(_.duration)
							.styleTween('opacity',function(){
								return getInterpolation(0,1);
							});
				}

				_1p21.graphs[selector] = {data:_.data,_:_};



			}

		/*****************************************************************************
		 * ENDFUNCTION: renderGraph
		*****************************************************************************/





		/*****************************************************************************
		 * FUNCTION: init
		*****************************************************************************/

			//initialize a good boi
			var init = function(retrievedData){
				
				//add initialized class so we know the boi been fucked na
				_.the_container = d3.select(selector);
				
				_.the_container.classed(prefix+'initialized'+ ( isDark(args.colorBackground) ? ' '+prefix+'dark' : '' ) ,true )
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
				
				// heck if src key exists
				_.data = (function(){
					if (args.srcKey) {
						if(deepGet(retrievedData,args.srcKey)){
							return deepGet(retrievedData,args.srcKey);
						}else{
							renderError(selector+' provided source key is invalid');
						}
					}else{
						return retrievedData
					}
				}());

				
				//filter data that has null value
				_.data = _.data.filter(function(dis,i){

					var toInclude = true;


					datum_keys.forEach(function(keyKey){

						if(args.key[keyKey] && deepGet(dis,args.key[keyKey]) == null) {
								// _.has[keyKey] = false;
							toInclude = false;

							if(_.user_can_debug){

								var humanForKey = keyKey == 0 ? 'name': keyKey == 1 ? 'value': keyKey;
								console.warn(selector +' datum index `'+i+'` was filtered.\ndatum does not have data for the key `'+args.key[keyKey] + '`, which is set as the property for `'+humanForKey+'`')
							}



						}
						
					});

					if(toInclude){
						return dis;
					}

				});


				if(_.data.length > 0 ){
				
				
					//sort data 0 so that it doesnt go forward then backward then forward on the graph which is weird
					if(args.nameIsNum == true){
						
						var sortable = [];

						for(var i = 0 ;i < _.data.length; i++){
							if(_.data[i]){
								sortable.push(_.data[i]);
							}
						}
						
						sortable.sort(function(a, b) {
							return deepGet(a,args.key[0],true) - deepGet(b,args.key[0],true);
						});

						_.data = sortable;
					}
					

					// fallback + validate color data
					// if color data key aint set put in name
					if(!(arr.key.color)){ 
						arr.key.color = args.key[0];

						//if legend was not fucked with we take the authority to kill legend
						if(!arr.colorLegend){
							args.colorLegend = false;
						}
					};


					// setup padding and sizes
					_.legend_size = (args.textLegendSize * parseFloat(args.fontSize) * 2);
					
					_.margin = {
						top:	args.margin[0] || args.margin,
						right: 	args.margin[1] || args.margin[0] || args.margin,
						bottom:	args.margin[2] || args.margin[0] || args.margin,
						left:	args.margin[3] || args.margin[1] || args.margin[0] || args.margin,
					};
					
					
					//add tooltipcontent function if there is none;

					_.tooltip_html = args.tooltipContent || function(dis,i) {

						var html = '<div class="'+prefix+'tooltip-data">';

						for (var prop in dis) {
							if (Object.prototype.hasOwnProperty.call(dis, prop)) {
								//item
								html += '<div class="'+prefix+'tooltip-data-property">';

									//@TODO speshal


									// label
									html += '<strong class="'+prefix+'tooltip-data-property-label">'+prop+':</strong> ';
									// content
									html += '<span class="'+prefix+'tooltip-data-property-content">'+dis[prop]+'</span>';
								html += '</div>';
								
							}
						}

						html += '</div>';

						return html;
					}

					
					//set them dimensions
					_.outer_width = args.width + _.margin.left + _.margin.right;
					_.outer_height = args.height + _.margin.top + _.margin.bottom;




					d3.select(selector).append('div').lower()
						.attr('class',prefix+'heading');
					
					_.heading_sel = d3.select(selector).select('div.'+prefix+'heading');

						if(args.title){
							_.heading_title = _.heading_sel.append('span')
							.attr('class',prefix+'title')
							.text(args.title)
						}

						if(args.description){
							_.heading_description = _.heading_sel.append('span')
							.attr('class',prefix+'description')
							.text(args.description)
						}

					_.heading_sel
						.style('padding-top', function(){
							return  ((_.margin.top / args.height) * 50) + '%'
						})
						.style('padding-left', function(){
							return  ((_.margin.left / _.outer_width) * 100) + '%'
						})
						.style('padding-right', function(){
							return  ((_.margin.right / _.outer_width) * 100) + '%'
						})
						.transition(_.duration)
						.styleTween('opacity',function(){return getInterpolation(0,1)});
				
					_.canvas = d3.select(selector)
						.append('div')
						.attr('class', prefix + 'wrapper')
						.style('position','relative')
						.style('padding-bottom',function(){
							return (( _.outer_height / _.outer_width) * 100) + '%';
						})
						.style('position','relative');

					var dimensionString = '0 0 '+ _.outer_width +' ' + _.outer_height;
					
					//check if its scrolled on the place it should be at
					_.dv_init = false;
					
					document.addEventListener('scroll',function(e) {
						var graphPosition = dataContainer.getBoundingClientRect().top;
						if(graphPosition < (window.innerHeight * .5) && !_.dv_init) {
							_.dv_init = true;
							
							setTimeout(function(){

								_.svg = _.canvas.append('svg')
									.attr('id',selector+'-svg')
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
										prefix + 'svg'
										+ ' ' + prefix + 'type-' + args.type
										+ ' ' + prefix + ( (args.colorPalette.length > 0 || args.linePointsColor !== null || args.lineColor !== null) ?  'has' : 'no' ) + '-palette'
										+ ' ' + prefix + ((args.type !== 'pie' && !args.xTicks && !args.yTicks) ? 'no' : 'has') + '-ticks'
										+ ' ' + prefix + ((args.colorLegend ) ? 'has' : 'no') + '-legend'
										+ ((args.type == 'pie' && args.piLabelStyle !== null) ? ' ' + prefix +'pi-label-style-'+args.piLabelStyle : ' '+prefix+'no-label')
									)
									.attr('viewBox', dimensionString)
									.attr("preserveAspectRatio", "xMidYMid meet")
									.attr('xml:space','preserve')
									.attr('width',_.outer_width)
									.attr('height',_.outer_height)
									;

									
								//duration
								_.duration = _.svg.transition().duration( args.transition ).ease(d3.easeLinear);
									
								_.container = _.svg.append('g')
									.attr('class',prefix+'svg-wrapper')
									.attr('font-size',args.fontSize)
									.style('line-height',1)
									.attr('transform','translate('+ _.margin.left +','+ _.margin.top +')');


								//tooltip
								if(args.tooltipEnable) {

									
									_.svg.append('circle')
										.attr('class',prefix+'cursor-stalker')
										// .attr('r',10)
										// // .style('opacity',0)
										// .attr('fill','red');

									_.tooltip_cursor_stalker = _.svg.select('circle.'+prefix+'cursor-stalker')

									_.tooltip = d3.tip()
										.attr('class',prefix+'tooltip')
										.style('width', function(){
											if(typeof args.tooltipWidth === 'number'){
												return parseFloat(args.tooltipWidth) + 'px';
											}else if(args.tooltipWidth == 'auto'){
												return args.tooltipWidth;
											}
										})
										.style('text-align',args.tooltipTextAlign)
										.direction(args.tooltipDirectionParameter || args.tooltipDirection)
										.html(_.tooltip_html)

									_.svg.call(_.tooltip);
								}

								
								if(args.type == 'pie'){
									//radius boi
									_.pi_radius = (function(){
										var value = Math.min((args.width * .5),(args.height * .5));
					
										if(args.colorLegend){
											value -= (value * .25)
										}
										
										if( args.piLabelStyle == 'linked' ){
											value -= (value * .25)
										}
					
										return value;
									}());

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
								if(args.type == 'pie'){
									_.container_graph
										.attr('transform','translate('+ getPiOrigin('x') +','+ getPiOrigin('y') +')');
								}
								

								// scales and shit
								datum_keys.forEach(function(keyKey){

									//range
									_['range_'+keyKey] = getRange(keyKey);

									//scale
									_['the_'+keyKey] = setScale(keyKey);

									//formatting of data on the graph
									_['format_'+keyKey] = (function(){
										
										if(typeof args['format'+keyKey+'Parameter'] === 'function' ) {
											
											return args['format'+keyKey+'Parameter']

										}else if( typeof args['format'+keyKey+'Parameter'] === 'string'  ) {
											
											return function(value){
												return d3.format(args['format'+keyKey+'Parameter'])(value)
											}

										}else{
											
											return function(value){

												var divider = args[ 'format' + keyKey.toString().toUpperCase() + 'Divider'],
													prepend = args[ 'format' + keyKey.toString().toUpperCase() + 'Prepend'],
													append = args[ 'format' + keyKey.toString().toUpperCase() + 'Append'],
													dataPossiblyDivided = (keyKey == 1 || args.nameIsNum == true ) ? (value / divider): value,
													formatted = prepend + dataPossiblyDivided + append;

												return formatted;
											}
										}
									}());

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
								
								// _.resize = null;

								window.addEventListener("resize", function(){
									clearTimeout(_.resize);
									_.resize = setTimeout(function(){
										renderGraph(_.data);
									},100);
								});
								
							},args.delay);

						}
					},true);
				}else{
					renderError('Data was filtered and all items are invalid for visualizing. check provided data keys and make sure they are correct');
				}
			}

		/*****************************************************************************
		 * ENDFUNCTION: init
		*****************************************************************************/





		/*****************************************************************************
		 * GETREADY TO USE ALL OF THEM FUCKHOLES
		*****************************************************************************/

		//data is embedded on the page oooooo
		if(args.srcPath.indexOf(window.location.href) > -1){
			var jsonSelector = document.getElementById(args.srcPath.getHash()).innerHTML;
			
			if(jsonSelector.isValidJSONString()){

				var dataIsJSON = JSON.parse(jsonSelector);
				init(dataIsJSON);
			}else{
				renderError('Data input may not be valid. Please check and update the syntax');
			}

		//o its not ok we normal now
		}else{
			switch(args.srcPath.getFileExtension()) {
				case 'csv':
				case 'dsv':
				case 'tsv':
				case 'xml':
					d3[args.srcPath.getFileExtension()](args.srcPath,function(d){
							return d;
						})
						.then(init)
						.catch(function(error){
							renderError(error,false);
						});
					break;
				
				default:
					d3.json(args.srcPath,function(d){
							return d;
						})
						.then(init)
						.catch(function(error){
							renderError(error,false);
						});
					break;
			}
		}
	}

	window._1p21 = _1p21;
	
}(window,d3));