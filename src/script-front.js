/*!
* 1point21 Data Vizualiser Version 1.2.0
* Render Script
* @license yes
* DO NOT EDIT min.js
* edit its corresponding unminified js file in /src instead
*/

/* DO NOT TOUCH I DEV ON THIS BOI I ENQUEUE THE MINIFIED ONE ANYWAY  :< */
(function(window,d3){
	"use strict";


	var _1p21 = window._1p21 || {};

	// helpful variables
	var coordinates = ['x','y'],

		//check if the graph item's length is enough for vertical bois idk i'll work on this some more later
		itemAtts = ['x','y','color','r'],
		datum_keys = [0,1,'color','area'], 

		//yeeee
		prefix = 'data-visualizer-', 

		label_size = '.75em',

		error_front = "Sorry, unable to display data.<br> Please check the console for more details",

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
			
			// duh
			String.prototype.getHash = function() {

				var hash = 0, i, chr;

				if(this.length === 0) return hash;

				for (i = 0; i < this.length; i++) {
					chr   = this.charCodeAt(i);
					hash  = ((hash << 5) - hash) + chr;
					hash |= 0; // Convert to 32bit integer
				}

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
		

	// function that is open to the pooblic. this initiates the speshal boi
	var dataVisualizer = function(selector,arr){
		
		// this is where the bitches at
		var dataContainer = document.querySelector(selector);
		
		if(isIE()){
			var error =  document.createElement('div')
			error.className = prefix+'wrapper fatality';
			error.innerHTML = 'Sorry, this graphic needs D3 to render the data but your browser does not support it.<br><br> Newer versions of Chrome, Edge, Firefox and Safari are recommended. <br><br>See <em><a target="_blank" rel="nofollow" href="https://d3-wiki.readthedocs.io/zh_CN/master/Home/#browser-platform-support">the official wiki</a></em> for more information';

			dataContainer.appendChild(error);
			

			// break;
			throw new Error('D3 not supported');
		}

		//stor variables initiated after sucessful data call + parameter declaration set as something_`axis` so its easier to tell apart which shit is set by hooman and which one javascript sets up for hooman
		var _ = {};

		//default params for hooman
		var defaults  = {
			
			//settings
				width: 600,
				height:600,
				margin: 10, // @TODO option to separate this thing
				marginOffset: 2,
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
					piInRadius: 0
		};

		//merge defaults with custom
		var args = defaults;
		for (var prop in arr) {
			if(arr.hasOwnProperty(prop)) {
				// Push each value from `obj` into `extended`
				args[prop] = arr[prop];
			}
		}



		var getAxisString = function(key){
			if (key == 0 || key == 1){
				return (args.xData == key) ? 'x' : 'y'
			}else{
				return key;
			}
		};

		// set up padding around the graph
		// @param axisString : duh 
		var getCanvasPadding = function(axisString){

			var padding = args.margin * args.marginOffset * 2;

			if(args.type !== 'pie'){
				
				// @TODO option to separate padding
				// if this axis has a label give it more space
				if( args[getAxisStringOppo(axisString)+'Ticks'] !== false ){
					padding += args.margin * (args.marginOffset * .25);

					if( args[getAxisStringOppo(axisString)+'Labels'] !== false ){
						padding += args.margin * (args.marginOffset * .5);
					}
		
					// x axis with name keys need more space because text is long
					if( axisString == 'x' && args[getAxisStringOppo(axisString)+'Data'] == 0 ){
						padding += args.margin * (args.marginOffset * 1.5);
					}

				}

			}

			return padding;

		}

		//get nearest power of tenth
		var getNearest = function(num){
			if(num > 10){

				return Math.pow(10, num.toString().length - 1) * 10;
			}else{
				return 1;
			}
		};

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

					if(args.nameIsNum || keyKey == 1 || keyKey == 'area'){

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

					break;

				}
			}
				
			return domain;
		};

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

						offset = args[getDimension(axisString,true)] + (_.transform_Y); 
						
					}else{

						offset = -(_.off_y - _.text_offset);

					}

				}else if(axisString == 'y'){

					if(args[axisString+'Align'] == 'right'){

						offset = args[getDimension(axisString,true)] + (_.off_x );

					}else{

						offset = -(_.transform_X - _.text_offset)

					}

				};

			}

			return offset;
		}

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

					if(args.nameIsNum ||  keyKey  == 1){
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

		//pls do not ask me po this broke my brain i will not likely know what just happened
		var getBlobTextBaselineShift = function(coordinateAttr,keyKey){

			var shift = '0em';

			if(
				(
					args.type !== 'pie'
				)
				|| (
					args.type == 'pie'
					&& !args.colorLegend
					&& args.piLabelStyle !== null
				)
			){

				if(coordinateAttr == 'y'){

					if(
						(
							args.type !== 'pie'
							&& (!args.xTicks && !args.yTicks)
						)
						|| (
							args.type == 'pie'
							&& (
								!args.colorLegend
							)
						)
					){
						shift = (keyKey == 1) ? '.375em' : '-1.5em'
					}
					
				}
			}
			
			return shift;

		}

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

				// offset by where the coordinates of the ends of the blob and axis alignment is at
				var shifter = function(){
					var value = 0,
					multiplier = 1;

					if(!(initial && args.type !== 'scatter')){

						if(
							(
								args.type == 'bar' 
								&& (
									args[getAxisStringOppo(coordinate)+'Align'] == 'top'
									|| args[getAxisStringOppo(coordinate)+'Align'] == 'right'
								)
							)
							|| (
								args.type !== 'bar' 
								&& (
									args[getAxisStringOppo(coordinate)+'Align'] == 'bottom'
									|| args[getAxisStringOppo(coordinate)+'Align'] == 'right'
								)
							)
						){
							multiplier *= -1;
						}
						

						if(args[getAxisStringOppo(coordinate)+'Data'] == 0){
							(coordinate == 'x') ? value = _.text_offset : value = ( ( _.mLength(coordinate,i) / 2 ) );
							_.mLength(coordinate,i);
						}

						value *= multiplier;
					}
					
					return value;

				},

				// offset if text is outside of boundaries
				shifterOut = function(){
					
					var multiplier = 1,
						value = 0;

					if(!(initial && args.type !== 'scatter')) {

						if(
							(
								args.type == 'bar'
								&& (
									args[getAxisStringOppo(coordinate)+'Align'] == 'bottom'
									|| args[getAxisStringOppo(coordinate)+'Align'] == 'right'
								)
							)
							|| (
								args.type !== 'bar' 
								&& (
									args[getAxisStringOppo(coordinate)+'Align'] == 'top'
									|| args[getAxisStringOppo(coordinate)+'Align'] == 'left'
								)
							)
						){
							multiplier = -1;
						}

						if(
							(
								(
									args.type == 'bar'
									&& parseFloat(getBlobSize(coordinate,dis,i)) < _.mLength(coordinate,i)
								)
								|| (
									args.type !== 'bar'
									&& parseFloat(getBlobSize(coordinate,dis,i)) >= (args[getDimension(coordinate,true)] - _.mLength(coordinate,i))
								)
							)
							&&  keyKey !== 0
						){
							if( coordinate == 'x'  && args.type !== 'line'){
								
								value = getBlobSize(coordinate,dis,i);

							}else{
								value = _.mLength(coordinate,i);

							}
							
						}
						

						value *= multiplier;
					
					}
					
					return value;

				};

				initial = initial || false;

				if( keyKey  == 0) {

					offset = getBlobOrigin(coordinate,dis,i);

					if(args.type == 'bar') {
						offset += getBlobSize(coordinate,dis,i) / 2;
					}

				}else{
					
					switch(args[getAxisStringOppo(coordinate)+'Align']){

						case 'top':

							offset = (initial && args.type !== 'scatter') ? getBlobOrigin(coordinate,dis,i) : getBlobSize(coordinate,dis,i);
							break;

						case 'right':
						case 'bottom':

								if(
									initial && args.type !== 'scatter'
									|| (
										args[getAxisStringOppo(coordinate)+'Align'] == 'right'
										&& args.type == 'bar'
									)
								) {

									offset = args[getDimension(coordinate)];

								}else{

									offset = args[getDimension(coordinate)] - getBlobSize(coordinate,dis,i);
									
								}

								break;

						case 'left':

							if(args.type !== 'bar') {
								offset = getBlobSize(coordinate,dis,i);
							}

					}

				}

				offset += shifter() + shifterOut();
				
			}
			
			return offset;

		}

		var getBlobOrigin = function(coordinate,dis,i,initial){
			// same here.. could be the same probably
			var keyKey =  args[ coordinate+'Data'],
				oppositeAxisAlignment = args[ getAxisStringOppo(coordinate)+'Align'],
				offset = 0;

				initial = initial || false;

			if(args.type !== 'pie') {

				if( args.nameIsNum || keyKey == 1){
					
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

						value = length + _.text_offset;

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

		var getPiData = function(i){

			var pie =  d3.pie()
				.sort(null)
				.value(function(dis,i){
					return deepGet(dis,args.key[1],true)
				});

				return pie(_.data)[i];
		}

		var getPiOrigin = function(axisString){
			var offset = 0;

			if(args.colorLegend && axisString =='x'){
				offset = args[getDimension(axisString)] * .375;
			}else{
				offset  = (args[getDimension(axisString)] * .5);
			}

			return offset;
		}

		var getMidAngle = function(disPi){
		   return disPi.startAngle + (disPi.endAngle - disPi.startAngle)/2;
		}



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

		//set the scale function thingy for the axis shit
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

					if(args.nameIsNum || keyKey == 1 || keyKey == 'area' ){

						if(args.nameIsNum && keyKey == 0 && args.type == 'scatter'){

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
								.paddingInner(.1) //spacing between
								.paddingOuter(.1);
						}
					}

					break;
					
			}
			
			return scale;

		};
		//generates lab_coord, rule_coord and axis_coord
		var setAxis = function(axisString,containerObj,isGrid) {


			if( args[axisString+'Ticks']) {
				var gridString = isGrid ? 'grid_' : '',
					alignString = args[axisString+'Align'];
				isGrid = isGrid || false;

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
							.attr('opacity',0)
							.text(args[axisString+'Label']);


						if(axisString == 'y') {
							_['lab_'+axisString].attr('transform', 'rotate(-90)');
						}

						_['lab_'+axisString]
							.transition(_.duration)
							.attr('opacity',1);

					}

				//ruler
					_['rule_'+gridString+axisString] = containerObj.append('g')
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
		
					_['rule_'+gridString+axisString].attr('transform','translate('+transformCoord+')');
	

				//axis

					var axisKey = 'Axis '+ alignString;

					_['axis_'+gridString+axisString] = d3[axisKey.toCamelCase()](_['the_'+ args[axisString+'Data']]);

					if(args[axisString +'Ticks']){

						if(args.type == 'scatter' && args[axisString+'Data'] == 0 ){
							var tickValues = function(){
								var values = [],
									currVal = _.dom_0[0];
								do{
									values.push(currVal);
									currVal *= 10;

								}while(currVal <= _.dom_0[1]);

								return values;
							}

							_['axis_'+gridString+axisString].tickValues( tickValues() );
						}

						if(args[axisString +'TicksAmount']){
							
							var ticksAmount = function(){

								if( isGrid && args[axisString +'TicksAmount']  ){
									return args[axisString +'TicksAmount'] * args[axisString +'GridIncrement'];
								} else {
									return args[axisString +'TicksAmount']
								}

							};
							
							_['axis_'+gridString+axisString].ticks( ticksAmount() );
						};

						if(isGrid){

							_['axis_'+gridString+axisString].
								tickSize(-args[ getDimension( axisString,true ) ])
								.tickFormat("");

						}else {
							_['axis_'+gridString+axisString]
								.tickFormat(function(dis,i){
									return _['format_'+ args[axisString+'Data'] ](dis)
								})
						}
					}

			}
		}

		var renderError = function(console_error,custom_error_front){
			d3.select(selector).classed(prefix+'initialized',true);
			d3.select(selector).append('div')
			.attr('class',prefix+'wrapper fatality')
			.html(custom_error_front || error_front);


			throw new Error(console_error);
		}


		//render a good boi
		var init = function(retrievedData){
			
			d3.select(selector).classed(prefix+'initialized' ,true )
			_.data = null;

			//element
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


		
		// relative to 1em supposedly idk
			_.text_offset =parseFloat(args.fontSize);

			
			//filter data that has null value
			_.data = _.data.filter(function(dis,i){

				var toInclude = true;


				datum_keys.forEach(function(keyKey){

					if(args.key[keyKey] && deepGet(dis,args.key[keyKey]) == null) {
							// _.has[keyKey] = false;
						toInclude = false;

						console.info(selector +' datum index `'+i+'` was filtered.\ndatum does not have data for the key `'+args.key[keyKey] + '`, which is set as data for `'+keyKey+'`')


					}
					
				});

				if(toInclude){
					return dis;
				}

			});


			if(_.data.length > 0 ){
			
			
				//sort data 0 so that it doesnt go forward then backward then forward on the graph which is weird

				
				if(args.nameIsNum){
					
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
					_.legend_size = 30;
					_.off_x = getCanvasPadding('x');
					_.off_y = getCanvasPadding('y');

					var shift = {
						more: 1.5,
						less: .5
					};

					_.transform_X = _.off_x,
					_.transform_Y = _.off_y;

					if(args.type !== 'pie'){
						//x COORDINATE value @TODO fucking loop na lang
						switch ( args.yAlign+' '+ ((args.xLabel == null) ? 'empty' : 'has') ){
							
							case 'left has':
								_.transform_X = (_.off_x * shift.more);
								break;

							case 'right has':
								_.transform_X = (_.off_x * shift.less);
								break;

							default:
								_.transform_X = (_.off_x);

						}


						//y COORDINATE value
						switch ( args.xAlign+' '+ ((args.yLabel == null) ? 'empty' : 'has') ){
							
							case 'top has':
								_.transform_Y = (_.off_y * shift.more);
								break;
							
							case 'bottom has':
								_.transform_Y = (_.off_y * shift.less);
								break;

							default:
								_.transform_Y = (_.off_y);

						}

					}
					
					_.outerWidth = args.width + (_.off_x * 2);
					_.outerHeight = args.height + (_.off_y * 2);


					d3.select(selector).append('div',':first-child')
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
							return  ((_.transform_Y / args.height) * 50) + '%'
						})
						.style('padding-left', function(){
							return  ((_.transform_X / args.width) * 100) + '%'
						})
						.style('padding-right', function(){
							return  ((_.transform_X / args.width) * 100) + '%'
						})
						.transition(_.duration)
						.styleTween('opacity',function(){return getInterpolation(0,1)});
				
					_.canvas = d3.select(selector)
						.append('div')
						.attr('class', prefix + 'wrapper')
						.style('position','relative')
						.style('padding-bottom',function(){
							return (( _.outerHeight / _.outerWidth) * 100) + '%';
						})
						.style('position','relative');

					var dimensionString = '0 0 '+ _.outerWidth +' ' + _.outerHeight;


					// _.canvas.style('padding-bottom', Math.floor(_.outerHeight/_.outerWidth * 100 )  + '%');
					
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
								.style('width','100%')
								.style('height','auto')
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
								.attr('width',_.outerWidth)
								.attr('height',_.outerHeight)
								;

								
							//duration
							_.duration = _.svg.transition().duration( args.transition ).ease(d3.easeLinear);
								
							_.container = _.svg.append('g')
								.attr('class',prefix+'svg-wrapper')
								.attr('font-size',args.fontSize)
								.attr('transform','translate('+ _.transform_X +','+ _.transform_Y +')');

							
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

								// labels and shit
								_.container_lab = _.container.append('g')
									.attr('class', prefix + 'label');
					
								//axis
								_.container_rule = _.container.append('g')
									.attr('class', prefix + 'axis')
									.attr('font-size',label_size);
									
								//kung may grid gibo kang grid
								(args.xGrid || args.yGrid) && (_.container_grid = _.container.append('g')
									.attr('class', prefix + 'grid'))
									.attr('font-size',label_size);
							}
							

							datum_keys.forEach(function(keyKey){
								// scales and shit
								_['range_'+keyKey] = getRange(keyKey),
								_['dom_'+keyKey] = getDomain(keyKey,_.data);
								_['the_'+keyKey] = setScale(keyKey);

								//set that fucker
								(_['the_'+keyKey] && _['dom_'+keyKey]) && _['the_'+keyKey].domain(_['dom_'+keyKey]);

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
												dataPossiblyDivided = (keyKey == 1 || args.nameIsNum ) ? (value / divider): value,
												formatted = prepend + dataPossiblyDivided + append;

											return formatted;
										}
									}
								}());

								switch(keyKey){

									case 0:
									case 1:

										setAxis(getAxisString(keyKey),_.container_rule)

										//formatter
										

										if(args[getAxisString(keyKey)+'Grid']) {
											setAxis(getAxisString(keyKey),_.container_grid,true)
										}

										

									case 'color':
										//colors kung meron
										if(args.colorPalette.length) {
											break;
										}
										
									default:
										
									
								}


							});



							//select
							_.container_graph = _.container.insert('g')
								.attr('class',
									prefix + 'graph'
								);

								if(args.type == 'pie'){
									_.container_graph
										.attr('transform','translate('+ getPiOrigin('x') +','+ getPiOrigin('y') +')');
								}
								
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

							if(!(args.type == 'line' && !args.linePoints)){


								_.blob = _.container_graph.selectAll(_.graph_item_element +'.'+prefix + 'graph-item graph-item-blob')
									.data(_.data,function(dis){
										return deepGet(dis,args.key[0])
									});

								if(
									(
										args.type !== 'pie'
										&& ( !args.xTicks || !args.yTicks )
									)
									|| (
										args.type == 'pie'
										&& ( args.piLabelStyle || !args.colorLegend )
									)
								){

									_.blob_text = _.container_graph.selectAll('text.'+prefix + 'graph-item graph-item-text')
										.data(_.data,function(dis){
											return deepGet(dis,args.key[0])
										});
									
									if(args.type == 'pie' && args.piLabelStyle == 'linked'){

										_.blob_text_link = _.container_graph.selectAll('polyline.'+prefix + 'graph-item graph-item-link')
											.data(_.data,function(dis){
												return deepGet(dis,args.key[0])
											});

									}
								}
							}

				
							renderGraph();
						},args.delay);
					}
				},true);
			}else{
				renderError('Data was filtered and all items are invalid for visualizing. check provided data keys and make sure they are correct');
			}


		}
				



		// tick inits
		var renderGraph = function() {
			// ok do the thing now
			// console.log(
			// 	 selector,'-------------------------------------------------------------------',"\n",
			// 	 'calculated',_,"\n",
			// 	 'data',_.data,"\n",
			// 	 'args',args,"\n"
			// );

			//generate the graph boi

			if(args.type == 'pie'){
				
			}else{
				
				// axis + grid
				coordinates.forEach(function(coordinate){
					if( args[coordinate+'Ticks'] ){
								
						_['rule_'+coordinate].transition(_.duration).call( _['axis_'+coordinate])
							.attr('font-family',null)
							.attr('font-size',null);
	
						if(args[coordinate+'Grid']){
							
							_['rule_grid_'+coordinate].transition(_.duration).call( _['axis_grid_'+coordinate]);
	
							_['rule_grid_'+coordinate].selectAll('.tick')
								.attr('class',function(dis,i){
									var classString = 'grid';
									
									//IM HERE FUCKER
									_['rule_'+coordinate].selectAll('.tick').each(function(tik){
										//if current looped tik matches dis grid data, add the class boi
										(tik == dis) && (classString += ' tick-aligned');
									})
	
									return classString;
	
								})
	
						}
	
					}
				});


				// line graph + fill
				if(args.type == 'line'){
					if(args.lineFill){
						_.fill = _.container_graph.append('path')
						.attr('class',prefix+'fill'+ ((args.lineFillColor !== null || args.lineColor !== null) ? ' has-color' : ' no-color' ))
						.attr('fill-opacity',args.lineFillOpacity)

						_.fill
							.transition(_.duration)
								.attrTween('d',function(){
									return getInterpolation(
										getLinePath(true,true),
										getLinePath(true,false)
									)
								});

						if( args.lineFillColor || args.lineColor ) {
							_.fill
								.attr('fill', args.lineFillColor || args.lineColor);
						}

					}


					_.line = _.container_graph.append('path')
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
						
				}
			
			}

			// bars, scatter plots, pizza, points
			if(
				!(args.type == 'line' && !args.linePoints)
			){
			
				_.blob.exit()
					// .transition(_.duration)
					.remove();
				
				
				_.enter_blob = _.blob.enter()
					.append(_.graph_item_element)
						.attr('class', function(dis){
							return prefix + 'graph-item graph-item-blob'
								+ ' '+ 'data-name-'+deepGet(dis,args.key[0]);
						});
						
					//coordinates
					if(args.type !== 'pie'){

						_.blob.merge(_.enter_blob)
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
						
						_.blob.merge(_.enter_blob)
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

					}else if(args.type == 'line' || args.type == 'scatter'){
						_.blob.merge(_.enter_blob)
							.transition(_.duration)
								.attrTween('r',function(dis,i){
									return getInterpolation(
										getBlobRadius(dis,i,true),
										getBlobRadius(dis,i,false)
									);
								})


					}else{
						_.blob.merge(_.enter_blob)
							.transition(_.duration)
								.attrTween('width',function(dis,i){
									return getInterpolation(
										getBlobSize('x',dis,i,true),
										getBlobSize('x',dis,i,false)
									);
								}) // calculated width
								.attrTween('height',function(dis,i){
									return getInterpolation(
										getBlobSize('y',dis,i,true),
										getBlobSize('y',dis,i,false)
									);
								})
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
							_.blob.merge(_.enter_blob)
								.attr('fill',function(){
									return args.linePointsColor || args.lineColor;
								});

						}
					}else{
						_.blob.merge(_.enter_blob)
							.attr('fill',function(dis,i){
								return _.the_color(deepGet(dis,args.key.color));
							});

							if(args.type == 'scatter'){
								_.blob.merge(_.enter_blob)
									.attr('fill-opacity',args.areaOpacity)
									.attr('stroke-width',1)
									.attr('stroke',function(dis,i){
										return _.the_color(deepGet(dis,args.key.color));
									})
							}
					}

			}
				  
			//graph item label if ticks are not set
			if(
				_.blob_text
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

					
					_.blob_text_link.merge(_.enter_blob_text_link)
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
					.append('text');

				if(args.type == 'pie' && args.piLabelStyle == 'within' && args.colorPalette.length > 0){
					_.enter_blob_text.attr('stroke',function(dis){
						return _.the_color(deepGet(dis,args.key.color))
					})
				}

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
										toReturn = '.75em';
									}else{
										toReturn = '1.75em';
									}	
								}

								return toReturn;
							}) // @TODO migrate embed css styles to here
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

							

							_['blob_text_'+keyKey]
								.attr('x',getBlobTextBaselineShift('x',keyKey))
								.attr('y',getBlobTextBaselineShift('y',keyKey));

					}
					
				});


				//set a minimum length for graph items to offset its text bois. doesnt matter which data key is on the axis we just want the width or height of the graph item on the given axis
				_.mLength = function(axisString,i){
					
					var value = 0;

						length = _.enter_blob_text ? _.enter_blob_text.nodes()[i].getBoundingClientRect()[ getDimension( axisString ) ] : 0
						
						value = length + _.text_offset;

					return value;
				};

				//continue fucking with text blob
				_.blob_text.merge(_.enter_blob_text)
					.attr('class', function(dis,i){
						var classString =  prefix + 'graph-item graph-item-text';
						
						[0,1].forEach(function(keyKey){
							
							if( 
								(
									(args.type == 'bar')
									&& (keyKey  == 1)
									&& (
										
										(parseFloat(getBlobSize(getAxisString(keyKey),dis,i,false)) < _.mLength(getAxisString(keyKey),i))
										
										|| (
											(args.colorPalette.length > 0)
											&& (parseFloat(getBlobSize(getAxisString(keyKey),dis,i,false)) >= _.mLength(getAxisString(keyKey),i))
											&& !isDark( _.the_color(deepGet(dis,args.key.color)) )
										)
									)
								)
								|| (args.type == 'line' || args.type == 'scatter')
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
										)
									)
								)
							){
								classString +=  ' dark';
							}
						});
						
						return classString;
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

				_.container_legend = _.container.append('g')
					.attr('class',prefix+'legend')
					.attr('font-size',label_size);
					
					
				_.dom_color.forEach(function(key,i){
					_.legend = _.container_legend.append('g')
						.attr('class',prefix+'legend-item')


					_.legend.append('rect')
					.attr('class','legend-item-blob')
						.attr('width',_.legend_size * .66)
						.attr('height',_.legend_size * .66)
						.attr('fill',_.the_color(key) );

					_.legend.append("text")
						.attr('class','legend-item-text')
						.text(key)
						.attr('dominant-baseline','middle')
						.attr('x',_.legend_size)
						.attr('y',_.legend_size * .375)
						
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

			// _1p21.graphs = [];
			// _1p21.graphs.push({data:data,calculated:_,})



		}

		if(args.srcType == 'text' || args.srcType == 'rows'){
			var jsonSelector = dataContainer.querySelector('script[type="application/json"]').innerHTML;
			
			if(jsonSelector.isValidJSONString()){

				var dataIsJSON = JSON.parse(jsonSelector);
				init(dataIsJSON);
			}else{
				renderError('Data input may not be valid. Please check and update the syntax');
			}


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
							renderError(error,'Data source couldn\'t be requested. Please check console for more details');
						});
					break;
				
				default:
					d3.json(args.srcPath,function(d){
							return d;
						})
						.then(init)
						.catch(function(error){
							renderError(error,'Data source couldn\'t be requested. Please check console for more details');
						});
					break;
			}
		}

		
		
		
	}

	

	_1p21.dataVisualizer = dataVisualizer;
	window._1p21 = _1p21;
	
}(window,d3));