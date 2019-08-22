

/* DO NOT TOUCH I DEV ON THIS BOI I ENQUEUE THE MINIFIED ONE ANYWAY  :< */
(function(window,d3){
    "use strict";


    var _1p21 = _1p21 || {};

    // helpful variables
    var coordinates = ['x','y'],

        //check if the graph item's length is enough for vertical bois idk i'll work on this some more later
        itemAtts = ['x','y','color','area','r'], 

        //yeeee
        prefix = 'data-visualizer-', 
    
        // relative to 1em supposedly idk
        textOffset = 15,

        //get the length attribute to associate with the axis bro
        dimensionAttribute = function(axisString,opposite){

            return opposite ?  ((axisString == 'x') ? 'height' : 'width') : ((axisString == 'x') ? 'width' : 'height');

        },

        // get the opposite boi for alignmeny purposes
        oppositeAxisString = function(axisString) { return (axisString == 'x') ? 'y' : 'x'; };

        //d3 does not support ie 11. kill it
        function isIE(){
            var ua = navigator.userAgent;
            return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1
        }


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
                margin: 20, // @TODO option to separate this thing
                marginOffset: 2,
                transition: 2000,
                delay: 300,
            //src
                srcType: '',
                srcPath: '',
                srcKey: null,
                
            // fields
                dataKey: [
                    0, //data 1 / name
                    1 //data 2 / value
                ],
                type: 'bar',
                nameIsNum: false,
    
                

    
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
                    lineFillOpacity: .5,
                    lineDash: [100,0],
                
                //pi
        
                //area? in case scatter plot ir pi idk what the fuck i'm doing right now but its here in case. yes i shall need this boi
                    areaKey: '',
        };

        //merge defaults with custom
        var args = defaults;
        for (var prop in arr) {
            if(arr.hasOwnProperty(prop)) {
                // Push each value from `obj` into `extended`
                args[prop] = arr[prop];
            }
        }

        // set up padding around the graph
        // @param axisString : duh 
        var getCanvasPadding = function(axisString){

            var padding = 0;

            if(args.type !== 'pie'){
                padding = args.margin * (args.marginOffset * .75);
                
                // @TODO option to separate padding
                // if this axis has a label give it more space
                if( args[axisString+'Label'] ){
                    padding = args.margin * (args.marginOffset * 1.5);
                }
        
                // x axis with name keys need more space because text is long
                if(axisString == 'x' && args[oppositeAxisString(axisString)+'Data'] == 0 ){
                    
                    padding = (args.margin * (args.marginOffset * 1.75));

                    //link @ line 123 boi
                    if( args[oppositeAxisString(axisString)+'Label'] ){
                        padding = padding + (args.marginOffset * .5);
                    }

                }

            }

            return padding;

        }

        // get data but with aility to get down deep because we never know where the fuck the date will be at
        // @param obj : duh 
        // @param keystring : hooman provided object key string that is hopefully correct 
        // @param isNum : if the data is a number 
        var deepGet = function (obj,keysString, isNum) { 
            
            var splitString = keysString.toString().split('.');
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
                    toReturn = isNum ? parseFloat(obj) : obj;


                }

                return toReturn;
            }

            var value = multiIndex(obj,splitString);
            

            if(isNum == true && isNaN(value)){

                console.warn(selector+' data with the key source of '+keysString+ ' was passed as numeric but is not.' )
            }
            return value;

        }

        //set range of the bois
        // @param itemAtt : duh
        var getRange = function(itemAtt){

            var range = [];

            switch(itemAtt){

                case 'color':

                    range = args[itemAtt+'Palette'];
                    break;

                    case 'x':
                    case 'y':
                        
                        if(args[oppositeAxisString(itemAtt)+'Align'] == 'top' || args[oppositeAxisString(itemAtt)+'Align'] == 'left') {
                            range = [ 0, args[ dimensionAttribute(itemAtt) ] ];
                        }else{
                            range = [ args[ dimensionAttribute(itemAtt) ] , 0 ];
                        }

                        break;

            }

            return range;
        }

        //set domain of the bois
        // @param itemAtt : duh
        // @param dat : ooh boi
        var getDomain = function(itemAtt,dat){

            var dataKeyOrI =  args[ itemAtt+'Data'],
                domain = [];

            switch(itemAtt){
                
                case 'color':
                    
                    var instances = dat.reduce(function(acc,dis){
                        if(!acc.includes(deepGet(dis,args[ itemAtt+'Data']))){
                            acc.push(deepGet(dis,args[ itemAtt+'Data']));
                        }
                        
                        return acc;
                    },[]);

                    domain = instances;

                    break;

                case 'x':
                case 'y':

                    if(args.nameIsNum || dataKeyOrI == 1){

                        var min,max;

                        //min
                        if(args[itemAtt + 'Min'] !== null){
                            min = args[itemAtt + 'Min'];
                        }else{
                            min = d3.min(dat,function(dis){
                                return deepGet(dis,args.dataKey[ dataKeyOrI ],true);
                            });
                        }
                        
                        //max
                        if(args[itemAtt + 'Max'] !== null){
                            max = args[itemAtt + 'Max']
                        }else{
                            max = d3.max(dat,function(dis){
                                return deepGet(dis,args.dataKey[ dataKeyOrI ],true);
                            });
                        }

                        domain = [min,max];

                    }else{
                        
                        domain =  dat.map(function(dis){
                            return deepGet(dis,args.dataKey[ dataKeyOrI ],false);
                        });

                    }

                    break;

                }

            return domain;
        };

        //AXIS STRING AND AXIS POSITION COORDINATES ARE VERY DIFFERENT THINGS U DUMB FUCK
        var getLabelPosition = function(coordinateAttribute,axisString){ 
            var offset = 0;

            if(coordinateAttribute == 'x'){ //x

                if(axisString == 'x'){

                    offset = args[dimensionAttribute(axisString)] / 2;

                }else if(axisString == 'y'){

                    offset = -(args[dimensionAttribute(axisString)] / 2)
                    
                };
                
            }else{ //y
                
                if(axisString == 'x'){

                    if(args[axisString+'Align'] == 'bottom'){

                        offset = args[dimensionAttribute(axisString,true)] + (_.off_y - (args.margin * .125)); 
                        
                    }else{

                        offset = -(_.off_y - (args.margin * 1.5));

                    }

                }else if(axisString == 'y'){

                    if(args[axisString+'Align'] == 'right'){

                        offset = args[dimensionAttribute(axisString,true)] + (_.off_x);

                    }else{

                        offset = -(_.off_x * .125)

                    }

                };

            }

            return offset;
        }

        //width,height or radius boi
        var getBlobSize = function(axisString,dis,i,initial) {

            var dataKeyI =  args[ axisString+'Data'],
                dataKey = args.dataKey[dataKeyI],
                oppositeAxisAlignment = args[ oppositeAxisString(axisString)+'Align'],
                dimension = 20;
                initial = initial || false;



            switch(args.type) {

                case 'pie': //eehhhh
                    break;

                default:

                    if(args.nameIsNum || dataKeyI == 1){
                        if(initial) {
                            
                            dimension = 0;
                        
                        }else{

                            if( oppositeAxisAlignment == 'right' || oppositeAxisAlignment == 'bottom' ){
                                
                                dimension = args[dimensionAttribute(axisString)] - _['the_'+axisString]( deepGet(dis,dataKey,dataKey,true) );
                            
                            }else{
                                
                                dimension = _['the_'+axisString]( deepGet( dis,dataKey,dataKey,true ) );
                            
                            }

                        }
                    }else{

                        dimension = _['the_'+axisString].bandwidth()

                    }

            }
            
            return dimension;
        }

        //duh 
        var getBlobRadius = function(dis,i,initial){
            var radius = 2;
            
            if(!initial){

                if(args.type == 'line' && args.linePointsSize){
                    radius = args.linePointsSize
                }

            }else{

                radius = 0;

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
                        args[oppositeAxisString(coordinate)+'Data'] == 0
                        && args[oppositeAxisString(coordinate)+'Align'] == 'right'
                    ){
                        anchor = 'end';
                    }

                });

            }
            
            return anchor;

        }

        //pls do not ask me po this broke my brain i will not likely know what just happened
        var getBlobTextBaselineShift = function(coordinateAttr,axisString){

            var shift = '0em';

            if(args.type == 'pie'){

            }else{

                if(coordinateAttr == 'y'){

                    if(!args.xTicks && !args.yTicks){
                        shift = (args[axisString+'Data'] == 1) ? '.375em' : '-1.625em'
                    }
                    
                }

            }
            
            return shift;

        }

        var getBlobTextOrigin = function(coordinate,dis,i,initial){
            
            //coordinate is influenced by the axis right now so this is the only time coordinate and axis is one and the same. i think... do not trust me on this
            var dataKeyI =  args[ coordinate+'Data'],
                offset = 0,

                // offset by where the coordinates of the ends of the blob and axis alignment is at
                shifter = function(){
                    var value = 0,
                    multiplier = 1;

                    if(
                        (
                            args.type == 'bar' 
                            && (
                                args[oppositeAxisString(coordinate)+'Align'] == 'top'
                                || args[oppositeAxisString(coordinate)+'Align'] == 'right'
                            )
                        )
                        || (
                            args.type !== 'bar' 
                            && (
                                args[oppositeAxisString(coordinate)+'Align'] == 'bottom'
                                || args[oppositeAxisString(coordinate)+'Align'] == 'right'
                            )
                        )
                    ){
                        multiplier *= -1;
                    }
                    

                    if(args[oppositeAxisString(coordinate)+'Data'] == 0){
                        (coordinate == 'x') ? value = textOffset : value = ( ( _.mLength(coordinate,i) / 2 ) );
                        _.mLength(coordinate,i);
                    }

                    value *= multiplier;
                    
                    return value;

                },

                // offset if text is outside of boundaries
                shifterOut = function(){
                    
                    var multiplier = 1,
                        value = 0;

                    if(
                        (
                            args.type == 'bar'
                            && (
                                args[oppositeAxisString(coordinate)+'Align'] == 'bottom'
                                || args[oppositeAxisString(coordinate)+'Align'] == 'right'
                            )
                        )
                        || (
                            args.type == 'line' 
                            && (
                                args[oppositeAxisString(coordinate)+'Align'] == 'top'
                                || args[oppositeAxisString(coordinate)+'Align'] == 'left'
                            )
                        )
                    ){
                        multiplier = -1;
                    }

                    if(
                        (
                            (
                                args.type !== 'line'
                                && parseFloat(getBlobSize(coordinate,dis,i)) < _.mLength(coordinate,i)
                            )
                            || (
                                args.type == 'line'
                                && parseFloat(getBlobSize(coordinate,dis,i)) >= (args[dimensionAttribute(oppositeAxisString(coordinate))] - _.mLength(coordinate,i))
                            )
                        )
                        && dataKeyI !== 0
                    ){
                        if( coordinate == 'x'  && args.type !== 'line'){
                            
                            value = getBlobSize(coordinate,dis,i);

                        }else{
                            value = _.mLength(coordinate,i);

                        }
                        
                    }
                    

                    value *= multiplier;
                    
                    return value;

                };

                initial = initial || false;

            //fuck it up    
            switch(args.type) {

                case 'pie':
                    break;

                default:

                    if(dataKeyI  == 0) {

                        offset = getBlobOrigin(coordinate,dis,i);

                        if(args.type == 'bar') {
                            offset += getBlobSize(coordinate,dis,i) / 2;
                        }

                    }else{
                        
                        switch(args[oppositeAxisString(coordinate)+'Align']){

                            case 'top':

                                initial ? offset = getBlobOrigin(coordinate,dis,i) : offset = getBlobSize(coordinate,dis,i);
                                break;

                            case 'right':
                            case 'bottom':

                                    if(
                                        initial 
                                        || (
                                            args[oppositeAxisString(coordinate)+'Align'] == 'right'
                                            && args.type == 'bar'
                                        )
                                    ) {

                                        offset = args[dimensionAttribute(coordinate)];

                                    }else{

                                        offset = args[dimensionAttribute(coordinate)] - getBlobSize(coordinate,dis,i);
                                        
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
            var dataKeyI =  args[ coordinate+'Data'],
                dataKey = args.dataKey[dataKeyI],
                oppositeAxisAlignment = args[ oppositeAxisString(coordinate)+'Align'],
                offset = 0;

                initial = initial || false;

                switch(args.type) {

                    case 'pie':


                        break;

                    default:

                        if( args.nameIsNum || dataKeyI == 1){
                            
                            if( oppositeAxisAlignment == 'right' || oppositeAxisAlignment == 'bottom' ){
                                
                                if(initial && dataKeyI !== 0){

                                    offset = args[dimensionAttribute(coordinate)];

                                }else{

                                    offset = args[dimensionAttribute(coordinate)] - (args[dimensionAttribute(coordinate)] - _['the_'+coordinate]( deepGet(dis,dataKey,true )));

                                }

                            }else{

                                if(args.type == 'line' || args.type == 'scatter'){

                                    if(!(initial && dataKeyI !== 0)){

                                        offset = _['the_'+coordinate]( deepGet(dis,dataKey,true ));

                                    }

                                }
                                
                            }

                        }else{

                            offset = _['the_'+coordinate](deepGet(dis,dataKey,false));

                            if(
                                (args.type == 'line' || args.type == 'scatter')
                                && !args.nameIsNum 
                            ) {
                                offset += getBlobSize(coordinate,dis,i) / 2;
                            }
                        }
                    

            }

            return offset;


        }

        var getLegendPosition = function(axisString){
            if( _.container_legend ){
                var offset = 0,
                shifter = function(){
                    var value = 0,
                        multiplier = 1;

                        if (
                            args[oppositeAxisString(axisString)+'Align'] == 'left'
                            || args[oppositeAxisString(axisString)+'Align'] == 'top'
                        ){
                            multiplier = -1;
                            value = _.container_legend.nodes()[0].getBoundingClientRect()[dimensionAttribute(axisString)] * .75;
                        }
                        
                    return value * multiplier;
                };


                if (
                    args[oppositeAxisString(axisString)+'Align'] == 'left'
                    || args[oppositeAxisString(axisString)+'Align'] == 'top'
                ){
                    offset = args[dimensionAttribute(axisString)];
                }


                return offset + shifter();

            }
            

        }

        var getLinePath = function(data,isArea,initial){

            initial = initial || false;


            var pathInitiator = isArea ? 'area' : 'line',
                axisToFill = (args.xData == 0)  ? 'x' : 'y',
                
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
                    name: axisToFill,
                    value: oppositeAxisString(axisToFill)+1,
                    fill: oppositeAxisString(axisToFill)+0 //initial of data name is the bottom of the fill
                };
                
                if( 
                    args[oppositeAxisString(axisToFill)+'Align'] == 'right'
                    || args[oppositeAxisString(axisToFill)+'Align'] == 'bottom'
                ){

                    aCord.value = oppositeAxisString(axisToFill)+0,
                    aCord.fill = oppositeAxisString(axisToFill)+1

                }
                
                path
                    [aCord.name](function(dis,i){
                        return getBlobOrigin(axisToFill,dis,i,initial);
                    })
                    [aCord.value](function(dis,i){
                        return getBlobOrigin(oppositeAxisString(axisToFill),dis,i,initial);
                    })
                    [aCord.fill](function(dis,i){
                        return getBlobOrigin( oppositeAxisString(axisToFill) ,dis,i,true);
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

            return path(data);

        }

        //set the scale function thingy for the axis shit
        var setScale = function(itemAtt){
            
            var axis;
            var dataKeyI = args[ itemAtt+'Data'];

            switch(itemAtt){

                case 'color':
                        axis = d3.scaleOrdinal()
                            .range(_['range_'+itemAtt]) 
                    break;

                case 'x':
                case 'y':

                    if(args.nameIsNum || dataKeyI == 1 ){
                        
                        axis = d3.scaleLinear()
                            .range(_['range_'+itemAtt]);
                        
                    }else{
                        axis = d3.scaleBand() //scales shit to dimensios
                            .range(_['range_'+itemAtt]) // scaled data from available space
                            .paddingInner(.1) //spacing between
                            .paddingOuter(.1);
                    }

                    break;
                    
            }
            
            return axis;

        };
        //generates lab_coord, rule_coord and axis_coord
        var renderAxis = function(axisString,containerObj,isGrid) {

            if( args[axisString+'Ticks']) {
                var gridString = isGrid ? 'grid_' : '',
                    alignString = args[axisString+'Align'];
                isGrid = isGrid || false;

                // label
                    if( args[axisString+'Label'] ){
                        
                        _['lab_'+axisString] = _.container_lab.append('text')
                            .attr('class', prefix + 'label-'+axisString)
                            .attr('y', function(){
                                return getLabelPosition('y',axisString);
                            })
                            .attr('x', function(){
                                return getLabelPosition('x',axisString);
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
                                        + ' grid-increment-' + args[axisString+'GridIncrement']
                                        + ' tick-amount-' + args[axisString+'TickAmount'];
                                    
                                }else{
        
                                    contClass =
                                        prefix
                                        + 'axis-'+axisString+' '
                                        + prefix +'axis-align-'+alignString
                                        + ' tick-amount' + args[axisString+'TickAmount'];
        
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

                    _['axis_'+gridString+axisString] = d3[axisKey.toCamelCase()](_['the_'+axisString]);

                    if(args[axisString +'Ticks']){

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
                                tickSize(-args[ dimensionAttribute( oppositeAxisString(axisString) ) ])
                                .tickFormat("");

                        }else {
                            _['axis_'+gridString+axisString]
                                .tickFormat(function(dis,i){
                                    return _['format_'+axisString](dis)
                                })
                        }
                    }

            }
        }

        var setPiData = function(data){

            var pie =  d3.pie()
                .sort(null)
                .value(function(dis,i){
                    return deepGet(dis,args.dataKey[0])
                });

                return pie(data);
        }


        //render a good boi
        var init = function(retrievedData){
            
            var data = null;

            //duration
            _.duration = d3.transition().duration(args.transition);

            //element
            switch(args.type){

                case 'bar':
                    _.graphItem = 'rect';
                    break;
                case 'pie':
                    _.graphItem = 'path';
                case 'line':
                case 'scatter':

                    _.graphItem = 'circle';
                    break;

            }
            // heck if src key exists
            data = args.srcKey ? deepGet(retrievedData,args.srcKey) : retrievedData;
            //validation
            
            //sort data 0 so that it doesnt go forward then backward then forward on the graph which is weird
            if(args.nameIsNum){
                
                var sortable = [];

                for(var i = 0 ;i < data.length; i++){
                    if(data[i]){
                        sortable.push(data[i]);
                    }
                }
                
                sortable.sort(function(a, b) {
                    return deepGet(a,args.dataKey[0],true) - deepGet(b,args.dataKey[0],true);
                });

                data = sortable;
            }

            //validate color args
            //if color data key aint set put in name
            if(!(arr.colorData)){ 
                args.colorData = args.dataKey[0];

                //if legend was not fucked with we take the authority to kill legend
                if(!arr.colorLegend){
                    args.colorLegend = false;
                }
            };


            //canvas
                _.off_x = getCanvasPadding('x'),
                _.off_y = getCanvasPadding('y'),
                
                _.outerWidth = args.width + (_.off_x * 2),
                _.outerHeight = args.height + (_.off_y * 2),
               
                _.canvas = d3.select(selector)
                    .append('div')
                    .attr('class', prefix + 'wrapper');

                _.dimensionString = '0 0 '+ _.outerWidth +' ' + _.outerHeight;
                

                _.svg = _.canvas.append('svg')
                    .attr('id',selector+'-svg')
                    .attr('version','1.1')
                    .attr('x','0px')
                    .attr('y','0px')
                    .attr('class', prefix + 'svg')
                    .attr('viewBox',_.dimensionString)
                    .attr("preserveAspectRatio", "xMaxYMax meet")
                    .attr('xml:space','preserve')
                    .style('style','enable-background','new '+_.dimensionString)
                    .attr('width',_.outerWidth)
                    .attr('height',_.outerHeight);

                    
                _.container = _.svg.append('g');
                _.containerTransform = null;

                var shift = {
                    more: 1.25,
                    less: .75
                },

                transformX = _.off_x,
                transformY = _.off_y;

                //x COORDINATE value @TODO fucking loop na lang
                switch ( args.yAlign+' '+ ((!args.xLabel) ? 'empty' : 'has') ){
                    
                    case 'left has':
                        _.transformX = (_.off_x * shift.more);
                        break;

                    case 'right has':
                        _.transformX = (_.off_x * shift.less);
                        break;

                    default:
                        _.transformX = (_.off_x);

                }


                //y COORDINATE value
                switch ( args.xAlign+' '+ ((!args.yLabel) ? 'empty' : 'has') ){
                    
                    case 'top has':
                        _.transformX = (_.off_y * shift.more);
                        break;
                    
                    case 'bottom has':
                        _.transformX = (_.off_y * shift.less);
                        break;

                    default:
                        _.transformX = (_.off_y);

                }
                    
                _.container.attr('transform','translate('+ transformX +','+ transformY +')');
                
            if(args.type == 'pie'){
                //setup data to be used by pi
                data = setPiData(data);

                console.log(data);

            }else{
                
                // labels and shit
                _.container_lab = _.container.append('g')
                    .attr('class', prefix + 'label');
    
                //axis
                _.container_rule = _.container.append('g')
                    .attr('class', prefix + 'axis');
                    
                //kung may grid gibo kang grid
                (args.xGrid || args.yGrid) && (_.container_grid = _.container.append('g')
                    .attr('class', prefix + 'grid'));

                itemAtts.forEach(function(itemAtt){

                    // scales and shit
                    _['range_'+itemAtt] = getRange(itemAtt),
                    _['dom_'+itemAtt] = getDomain(itemAtt,data);
                    _['the_'+itemAtt] = setScale(itemAtt);

                    //set that fucker
                    (_['the_'+itemAtt] && _['dom_'+itemAtt]) && _['the_'+itemAtt].domain(_['dom_'+itemAtt]);

                    switch(itemAtt){

                        case 'x':
                        case 'y':

                            renderAxis(itemAtt,_.container_rule)

                            //formatter
                            _['format_'+itemAtt] = (function(){

                                if(typeof args[itemAtt+'Parameter'] === 'function' ) {
                                    return args[itemAtt+'Parameter']

                                }else if( typeof args[itemAtt+'Parameter'] === 'string'  ) {
                                    
                                    return function(value){
                                        return d3.format(args[itemAtt+'Parameter'])(value)
                                    }

                                }else{
                                    
                                    return function(value){

                                        var dataPossiblyDivided = (args[itemAtt+'Data'] == 1 || args.nameIsNum ) ? (value / args[itemAtt+'Divider']): value,
                                        
                                        formatted = args[itemAtt+'Prepend'] + dataPossiblyDivided + args[itemAtt+'Append'];
            
                                        return formatted;
                                    }
                                }
                            }());

                            if(args[itemAtt+'Grid']) {
                                renderAxis(itemAtt,_.container_grid,true)
                            }

                            

                        // case 'color':
                        //     //colors kung meron
                        //     if(args.colorPalette.length) {
                         
                        //         break;
                        //     }
                            
                        default:
                        
                    }


                })



                //select
                _.container_graph = _.container.insert('g')
                    .attr('class',
                        prefix + 'graph' + ' '
                        + prefix + 'type-' + args.type + ' '
                        + prefix + ( (args.colorPalette.length > 0 || args.linePointsColor !== null || args.lineColor !== null) ?  'has-palette' : 'no-palette' )
                        + ((!args.xTicks && !args.yTicks) ? ' '+prefix+'item-data-no-ticks' : '')
                    );
                    
                    if(
                        args.width == defaults.width
                        && args.height == defaults.height
                        && data.length > 9
                    ){
                        
                        console.warn(selector+' Width and height was not adjusted. graph elements may not fit in the canvas');
                    
                    }else if(
                        args.width < defaults.width
                        && args.height < defaults.height
                    ){

                        console.warn(selector+' set canvas width and or height may be too small.\n Tip: The given height and width are not absolute and act more like aspect ratios. svgs are responsive and will shrink along with content.');

                    }

                if(!(args.type == 'line' && !args.linePoints)){


                    _.blob = _.container_graph.selectAll(_.graphItem)
                        .data(data,function(dis){
                            return dis[args.dataKey[args.xData]]
                        });
                }



            } 

            //check if it's loaded boi
            _.dv_init = false;

            document.addEventListener('scroll',function(e) {
                var graphPosition = dataContainer.getBoundingClientRect().y;

                if(graphPosition < (window.innerHeight * .5) && !_.dv_init) {
                    _.dv_init = true;
                    setTimeout(function(){
                        renderGraph(data);
                    },args.delay);
                }
            },true);

        }
                



        // tick inits
        var renderGraph = function(data) {
            // ok do the thing now
            console.log(selector,'-------------------------------------------------------------------')
            // console.log('calculated',_);
            // // console.log('data',dat);
            // console.log('args',args);

                
            // console.log('x');
            // console.log('domain',_.dom_x);
            // console.log('range',_.range_x);

            // console.log('----------------');

            // console.log('y');
            // console.log('domain',_.dom_y);
            // console.log('range',_.range_y);

            // console.log('\n');

            //generate the graph boi

            if(args.type == 'pie'){
                
            }else{
                // axis 
                coordinates.forEach(function(coordinate){

                    if( args[coordinate+'Ticks'] ){
                                
                        _['rule_'+coordinate].transition(args.delay).call( _['axis_'+coordinate])
                            .attr('font-family','inherit')
                            .attr('font-size',null);
    
                        if(args[coordinate+'Grid']){
                            
                            _['rule_grid_'+coordinate].call( _['axis_grid_'+coordinate]);
    
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
                
                if(args.type == 'line'){


                    if(args.lineFill){
                        _.fill = _.container_graph.append('path')
                        .attr('class',prefix+'fill'+ ((args.lineFillColor !== null) ? ' has-color' : ' no-color' ))
                        .attr('fill-opacity',0)
                        .attr('d',function(){
                            return getLinePath(data,true,true)
                        });

                        if( args.lineFillColor || args.lineColor ) {
                            _.fill
                                .attr('fill', args.lineFillColor || args.lineColor);
                        }

                        _.fill 
                            .transition(_.duration)
                            .attr('fill-opacity',args.lineFillOpacity)
                            .attr('d',function(){
                                return getLinePath(data,true)
                            });
                    }


                    _.line = _.container_graph.append('path')
                        .attr('class',prefix+'line' + ((args.lineColor !== null) ? ' has-color' : ' no-color' ))
                        .attr('fill','none')
                        .attr('stroke-width',args.lineWeight)
                        .attr('stroke-linejoin','round')
                        .attr('stroke-opacity',0)
                        .attr('d',function(){
                            return getLinePath(data,false,true)
                        })
                        .attr('stroke-dasharray','0,0');

                        if(args.lineColor) {
                            _.line
                                .attr('stroke',args.lineColor)
                        }


                    
                        _.line
                            .transition(_.duration)
                            .attr('d',function(){
                                return getLinePath(data,false)
                            })
                            .attr('stroke-dasharray',args.lineDash)
                            .attr('stroke-opacity',1);

                
                }

                if(
                    !(args.type == 'line' && !args.linePoints)
                ){
                
                    _.blob.exit()
                        .transition(_.duration)
                        .attr('height',0)
                        .remove();

                    
                    _.blobWrap = _.blob
                        .enter()
                        .append('g')
                            .attr('class', function(dis){
                                return prefix + 'item'+
                                    ' ' + prefix + deepGet(dis,args.dataKey[0]);
                            });

                    
                            

                    _.blobItem = _.blobWrap
                        .append(_.graphItem)
                        .attr(
                            (args.type == 'line' || args.type == 'scatter') ? 'cx' : 'x',
                            function(dis,i){
                                return getBlobOrigin('x',dis,i,true)
                            }
                        )

                        .attr(
                            (args.type == 'line' || args.type == 'scatter') ? 'cy' : 'y',
                            function(dis,i){
                                return getBlobOrigin('y',dis,i,true)
                            })
                        ;

                        if(args.type == 'line' || args.type == 'scatter'){
                            _.blobItem
                                .attr('r',function(dis,i){
                                    return getBlobRadius(dis,i,true)
                                })

                        }else{
                            _.blobItem
                                .attr('width',function(dis,i){
                                    return getBlobSize('x',dis,i,true);
                                }) // calculated width
                                .attr('height',function(dis,i){
                                    return getBlobSize('y',dis,i,true);
                                })
                        }

                        if(!args.colorPalette.length){
                            if(
                                args.type == 'line'
                                && (
                                    args.linePointsColor
                                    || args.lineColor
                                )
                            ) {
                                _.blobItem
                                    .attr('fill',function(){
                                        return args.linePointsColor || args.lineColor;
                                    });

                            }
                        }else{
                            _.blobItem
                                .attr('fill',function(dis,i){
                                    return _.the_color(deepGet(dis,args.colorData));
                                });
                        }

                        _.blobItem 
                        // .merge(_.blob)
                            .transition(_.duration)
                            .attr(
                                (args.type == 'line' || args.type == 'scatter' ) ? 'cx' : 'x',
                                function(dis,i){
                                    return getBlobOrigin('x',dis,i)
                                }
                            )
    
                            .attr(
                                (args.type == 'line' || args.type == 'scatter' ) ? 'cy' : 'y',
                                function(dis,i){
                                    return getBlobOrigin('y',dis,i)
                                })
                            ;
    
                            if(args.type == 'line' || args.type == 'scatter'){
                                _.blobItem
                                    .transition(_.duration)
                                    .attr('r',function(dis,i){
                                        return getBlobRadius(dis,i);
                                    })
    
                            }else{
                                _.blobItem
                                    .transition(_.duration)
                                    .attr('width',function(dis,i){
                                        return getBlobSize('x',dis,i);
                                    }) // calculated width
                                    .attr('height',function(dis,i){
                                        return getBlobSize('y',dis,i);
                                    })
                            }

                }
                
            }
                    
            //graph item label if ticks are not set
            if( !args.xTicks || !args.yTicks ){

                _.blobText =  _.blobWrap.append('text');

                //append content right away so we can calculate where shit offset
                coordinates.forEach(function(coordinate){

                    if( !args[coordinate+'Ticks'] ){

                        _['blobText_'+coordinate] = _.blobText.append('tspan')

                            .attr('class', prefix+'item-data-'+args[coordinate+'Data'] )
                            .attr('dominant-baseline','middle')
                            .attr('text-anchor',function(dis,i){
                                return getBlobTextAnchor(dis,i);
                            })
                            .attr('font-size',null)
                            .text(function(dis,i){
                                return _['format_'+coordinate](
                                    deepGet(dis,args.dataKey[ args[coordinate+'Data'] ])
                                );
                            })
                            .attr('x',getBlobTextBaselineShift('x',coordinate))
                            .attr('y',getBlobTextBaselineShift('y',coordinate));

                        

                            //set a minimum length for graph items to offset its text bois
                            _.mLength = function(axisString,i){
                                
                                var value = 0;

                                    length = _.blobText ? _.blobText.nodes()[i].getBoundingClientRect()[dimensionAttribute(axisString)] : 0
                                    
                                    value = length + textOffset;

                                return value;
                            };
                    }
                    
                });

                //continue fucking with text blob
                _.blobText
                    .attr('class', function(dis,i){
                        var classString =  prefix + 'item-text';

                        coordinates.forEach(function(coordinate){
                            
                            if( 
                                (

                                    (args[coordinate+'Data']  == 1)
                                    && (
                                        
                                        (parseFloat(getBlobSize(coordinate,dis,i,false)) < _.mLength(coordinate,i))
                                        
                                        || (
                                            (args.colorPalette.length > 0)
                                            && (parseFloat(getBlobSize(coordinate,dis,i,false)) >= _.mLength(coordinate,i))
                                            && !isDark( _.the_color(deepGet(dis,args.colorData)) )
                                        )
                                    )
                                )
                                || (args.type == 'line')
                            ){
                                classString +=  ' dark';
                            }
                        });

                        return classString;
                    })

                    
                    .attr('transform',function(dis,i){
                        return 'translate('+getBlobTextOrigin('x',dis,i,true)+','+getBlobTextOrigin('y',dis,i,true)+')'
                    })
                    .style('opacity',0);

                _.blobText
                    .transition(_.duration)
                    .attr('transform',function(dis,i){
                        return 'translate('+getBlobTextOrigin('x',dis,i)+','+getBlobTextOrigin('y',dis,i)+')'
                    })
                    .style('opacity',1);
            }

            //legends boi
            if(args.colorLegend){

                _.container_legend = _.container.append('g')
                    .attr('class',prefix+'legend');
                    
                    
                _.dom_color.forEach(function(key,i){
                    _.legend = _.container_legend.append('g')
                        .attr('class',prefix+'legend-item')


                    _.legend.append('rect')
                        .attr('width','1em')
                        .attr('height','1em')
                        .attr('fill',_.the_color(key) );

                    _.legend.append("text")
                        .text(key)
                        .attr('x','2em')
                        .attr('y','1.25em')

                        
                    _.legend
                        .attr("transform", "translate(0, " + (i * _.legend.nodes()[0].getBoundingClientRect().height ) + ")");
                });


                _.container_legend
                    .attr('opacity','0')
                    .attr('transform','translate('+getLegendPosition('x')+','+getLegendPosition('y')+')');

                _.container_legend
                    .transition(_.duration)
                    .attr('opacity','1')
            }


        }

        if(args.srcType == 'text' || args.srcType == 'rows'){
            var jsonSelector = dataContainer.querySelector('script[type="application/json"]').innerHTML;
            
            if(jsonSelector.isValidJSONString()){

                var dataIsJSON = JSON.parse(jsonSelector);
                init(dataIsJSON);
            }else{
                console.error('Data input may not be valid. Please check and update the syntax')
            }


        }else{
            switch(args.srcPath.getFileExtension()) {
                case 'csv':
                    d3.csv(args.srcPath,function(d){ return d; }).then(init);
                    break;
                case 'tsv':
                    d3.tsv(args.srcPath,function(d){ return d; }).then(init);
                    break;
                
                default:
                    d3.json(args.srcPath,function(d){ return d; }).then(init);
                    break;
            }
        }

        
        
        
    }

    

    _1p21.dataVisualizer = dataVisualizer;

    window._1p21 = _1p21;
}(window,d3));