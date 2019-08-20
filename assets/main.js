"use strict";
/* DO NOT TOUCH I DEV ON THIS BOI I ENQUEUE THE MINIFIED ONE ANYWAY  :< */
(function(window,d3){
    var _1p21 = _1p21 || {};

    // helpful variables
    var coordinates = ['x','y'], //yes
        itemAtts = ['x','y','color','area','r'], //opo //check if the graph item's length is enough for vertical bois idk i'll work on this some more later
        prefix = 'data-visualizer-', //yeeee
    

        textOffset = 15;
    //get the length attribute to associate with the axis bro
    var dimensionAttribute = function(axisString,opposite){
        

        if(opposite){
            return (axisString == 'x') ? 'height' : 'width';
        }else{
            return (axisString == 'x') ? 'width' : 'height';
        }
    }

    // get the opposite boi for alignmeny purposes
    var oppositeAxisString = function(axisString) {

        return (axisString == 'x') ? 'y' : 'x';

    }

    //string helpers
        // duh
        String.prototype.getFileExtension = function() {

            return this.split('.').pop();

        }
        // duh
        String.prototype.getHash = function() {

            var hash = 0, i, chr;
            if (this.length === 0) return hash;
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
            if (color.match(/^rgb/)) {
        
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
            
            if (hsp>170) { //127.5
                return false;
            } else {
                return true;
            }
        }
    

    // function that is open to the pooblic. this initiates the speshal boi
    var dataVisualizer = function(selector,arr){
        
        var dataContainer = document.querySelector(selector);

        //stor variables initiated after sucessful data call + parameter declaration set as something_`axis` so its easier to tell apart which shit is set by hooman and which one javascript sets up for hooman
        var _ = {};


        //default params for hooman
        var defaults  = {
            //settings
            width: 600,
            height:400,
            margin: 20, // @TODO option to separate padding
            marginOffset: 2,
            transition: 2000,
            delay: 300,

            
            type: 'bar',
            dataKey: [
                0, //data 1 / name
                1 //data 2 / value
            ],
            nameIsNum: false,
    
            //src
            srcType: '',
            srcPath: '',
            srcKey: null,

    
            //kulay
            colorPalette : [],
            colorData: null,
            
            //x settings
            xData: 0,
            xAlign: 'bottom',
            xTicks: false,
            xLabel: null,
            xTicksAmount: null,
            xTicksParameter: null,
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
            yTicksParameter: null,
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
            lineFillInvert: 'x',
            lineDash: [100,0],
    
            //area? in case scatter plot ir pi idk what the fuck i'm doing right now but its here in case. yes i shall need this boi
            areaKey: '',
        };

        //merge defaults with custom
        var args = defaults;
        for (var prop in arr) {
            if (arr.hasOwnProperty(prop)) {
                // Push each value from `obj` into `extended`
                args[prop] = arr[prop];
            }
        }

        //set a minimum height
        _.mLength = (!args.xTicks && !args.yTicks) ? 120 : 70;

        // set up padding 
        // @param - axisString : duh 
        var getCanvasPadding = function(axisString){

            var padding = 0;

            if(args.type !== 'pie'){
                padding = args.margin * (args.marginOffset * .75);
                
                // @TODO option to separate padding
                // if this axis has a label give it more space
                if( args[axisString+'Label'] ){
                    padding = args.margin * args.marginOffset;
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
        // @param - obj : duh 
        // @param - keystring : hooman provided object key string that is hopefully correct 
        // @param - isNum : if the data is a number 
        var deepGet = function (obj,keysString, isNum) { 
            var splitString = keysString.toString().split('.');

            //remove empty instances because they just mess with the loop
            splitString.forEach(function(key,i){

                if(key == ''){
                    splitString.splice(i, 1);
                }

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
            return value;
        }

        //set range of the bois
        // @param - itemAtt : duh
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
        
        var getDomain = function(itemAtt,dat){

            var dataKeyI =  args[ itemAtt+'Data'],
                domain = [];
            // var dataKeyI = deepGet();

            if(dataKeyI !== null){
                switch(itemAtt){
                    case 'color':
                        
                        var keyString =  args.colorData || args.dataKey[0];
                        
                        var instances = dat.reduce(function(acc,dis){
                            if(!acc.includes(deepGet(dis,keyString))){
                                acc.push(deepGet(dis,keyString));
                            }
                            return acc;
                        },[]);

                        domain = instances;

                        break;

                    case 'x':
                    case 'y':

                        if(args.nameIsNum || dataKeyI == 1){

                            var min,max;
                                //min
                                if(args[itemAtt + 'Min'] !== null){
                                    min = args[itemAtt + 'Min'];
                                }else{
                                    min = d3.min(dat,function(dis){
                                        return deepGet(dis,args.dataKey[ dataKeyI ],true);
                                    });
                                }
                                
                               //max
                                if(args[itemAtt + 'Max'] !== null){
                                    max = args[itemAtt + 'Max']
                                }else{
                                    max = d3.max(dat,function(dis){
                                        return deepGet(dis,args.dataKey[ dataKeyI ],true);
                                    });
                                }

                                domain = [min,max];
                        }else{
                            // console.log('my',dat);
                            domain =  dat.map(function(dis){
                                return deepGet(dis,args.dataKey[ dataKeyI ],false);
                            });
                        }

                        break;
                    }

                return domain;
            }
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
                        offset = args[dimensionAttribute(axisString,true)] + (_.off_y - (args.margin * .125)); //args.height + ()
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
            

            return dimension
        }

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

        //set baseline and alignment for text labels of graphic items. it works and it is confusion so dont fuck with it anymore
            //oh god i am confusion
            // var getBlobTextBaseline = function (dis,i){
            //     var baseline = 'middle';

            //     if(args.xData == 0) {
                    
            //         if(args.xAlign == 'bottom'){
            //             baseline = 'hanging';
            //         }else{
            //             baseline = 'auto';
            //         }

            //     }

            //     return baseline;

            // }

            //more confusuin
            var getBlobTextAnchor = function(dis,i){
                var anchor = 'middle';

                if(args.type == 'pie'){
                
                }else{

                    if(args.yData == 0) {
                            anchor = 'start';
                    }

                    coordinates.forEach(function(coordinate){

                        // if(
                        //     (
                        //         parseFloat(getBlobSize(coordinate,dis,i,false)) < _.mLength
                        //         && args[oppositeAxisString(coordinate)+'Align'] == 'right'
                        //     )
                        // ){
    
                        //     anchor = 'end';
                        // }


                        if( args[oppositeAxisString(coordinate)+'Data'] == 0 && args[oppositeAxisString(coordinate)+'Align'] == 'right' ){
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
                        shift = (args[axisString+'Data'] == 1) ? '.5em' : '-1.5em'
                    }
                }

            }


            
            return shift;
        }

        var getBlobTextOrigin = function(coordinate,dis,i,initial){
            //coordinate is influenced by the axis right now so this is the only time coordinate and axis is one and the same. i think... do not trust me on this
            var dataKeyI =  args[ coordinate+'Data'],
                offset = 0,
                yShifter = (!args.xTicks && !args.yTicks && coordinate == 'y') ? (textOffset * 2.5) : textOffset * 1.25,
                shifter = function(){
                    var value = 0,
                    multiplier = 1;

                    


                    if(
                        args[oppositeAxisString(coordinate)+'Align'] == 'top'
                        || args[oppositeAxisString(coordinate)+'Align'] == 'right'
                    ){
                        multiplier *= -1;
                    }
                    


                    if(coordinate == 'x'){
                        // only when y data is set to name
                        if(args[oppositeAxisString(coordinate)+'Data'] == 0){
                            value = textOffset;
                        }

                        // !initial && console.log(dis.name,coordinate,args[coordinate+'Align'],multiplier,value);
                    }else{
                        if(args[oppositeAxisString(coordinate)+'Data'] == 0){
                            if(!args.xTicks && !args.yTicks){
                                value = (textOffset * 2.5)
                            }else{
                                value = textOffset * 1.25
                            }
                        }

                    }

                    value *= multiplier;



                    return value;

                },
                shifterOut = function(){
                    var multiplier = 1,
                        value = 0;
                        

                    if(
                        (
                            args[oppositeAxisString(coordinate)+'Align'] == 'bottom'
                            || args[oppositeAxisString(coordinate)+'Align'] == 'right'
                        )
                    ){
                        multiplier = -1;
                    }

                    if(args.type == 'line'){
                        multiplier
                    }

                    if(parseFloat(getBlobSize(coordinate,dis,i)) < _.mLength && dataKeyI !== 0 ) {
                        if(coordinate == 'x'){
                            !initial && console.log(dis.name,coordinate,'uuugh',multiplier);
                            value = getBlobSize(coordinate,dis,i);
                        }else{
                            value = shifter() * 2
                        }
                        
                    }



                    value *= multiplier;
                    
                    return value;

                };
                initial = initial || false;



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

                                    if(initial) {

                                        getBlobOrigin(coordinate,dis,i)

                                    }else{

                                        offset = getBlobSize(coordinate,dis,i);

                                    }
                                    break;

                            case 'right':
                            case 'bottom':

                                    if(initial 
                                        || (
                                            args[oppositeAxisString(coordinate)+'Align'] == 'right'
                                            && args.type == 'bar'
                                        )
                                    ) {
                                        offset = args[dimensionAttribute(coordinate)]
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
                    
                

                    !initial && (offset += shifter() + shifterOut());

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
                        // if(
                        //     (args.type == 'line' || args.type == 'scatter')
                        //     && !args.nameIsNum 
                        // ) {
                        //     offset += getBlobSize(coordinate,dis,i) / 2;
                        // }
                    }
                    

            }

            return offset;


        }

        var getLinePath = function(data,isArea,initial){

            initial = initial || false;


            var pathInitiator = isArea ? 'area' : 'line',
                axisToFill = (args.xData == 0)  ? 'x' : 'y',
                path = d3[pathInitiator]();


            if(pathInitiator == 'area') {
                //name coord, value coord, fill coordinate
                var aCord = { //default is top
                    name: axisToFill,
                    value: oppositeAxisString(axisToFill)+1,
                    fill: oppositeAxisString(axisToFill)+0 //initial of data name is the bottom of the fill
                };

                

                if( (
                        !args.lineFillInvert
                        && (args[oppositeAxisString(axisToFill)+'Align'] == 'right' || args[oppositeAxisString(axisToFill)+'Align'] == 'bottom')
                    )
                    || (
                        args.lineFillInvert
                        && !(args[oppositeAxisString(axisToFill)+'Align'] == 'right' || args[oppositeAxisString(axisToFill)+'Align'] == 'bottom')
                    )
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
                    })
            }else{
                path
                    .x(function(dis,i){
                        return getBlobOrigin('x',dis,i,initial);
                    })
                    .y(function(dis,i){
                        return getBlobOrigin('y',dis,i,initial);
                    });
            }

            return path(data);

        }

        var setRuleContainer = function(axisString,containerObj,isGrid){
            var rule = containerObj.append('g')
                .attr(
                    'class', function(){
                        var contClass = null;

                        if(isGrid){
                            contClass = prefix + 'grid-'+axisString+' ';
                        }else{
                            contClass =
                                prefix +
                                'axis-'+axisString+' '+
                                prefix +'axis-align-'+args[axisString+'Align']
                        }

                        return contClass;
                    }
                )

            var transformCoord = '';
            
            switch( axisString+' '+args[axisString+'Align'] ) {
                case 'x bottom':
                    transformCoord = '0,'+ args.height;
                    break;
                case 'y right':
                    transformCoord = args.width+',0';
                    break;
                default: 
                    transformCoord = '0,0'
            }


            rule.attr('transform','translate('+transformCoord+')');

            return rule;
        }




        var setAxis = function(axisString,isGrid) {
            var axis,
                axisKey = 'Axis '+args[axisString+'Align'];

            isGrid = isGrid || false;

            axis = d3[axisKey.toCamelCase()](_['the_'+axisString]);


            if(args.hasOwnProperty(axisString +'Ticks')){

                if(args[axisString +'TicksAmount']){
                    
                    var ticksAmount = function(){
                        if( isGrid && args[axisString +'TicksAmount']  ){
                            return args[axisString +'TicksAmount'] / args[axisString +'GridIncrement'];
                        } else {
                            return args[axisString +'TicksAmount']
                        }
                    };


                    axis.ticks( ticksAmount(),_['format_'+axisString] );
                };

                if(isGrid){
                    axis.
                        tickSize(-args[ dimensionAttribute( oppositeAxisString(axisString) ) ])
                        .tickFormat("");
                }
            }



            return axis;
            
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

        var renderAxis = function(axisString,containerObj,isGrid) {
            if( args[axisString+'Ticks']) {
                var gridString = isGrid ? 'grid_' : '';

                // x label
                if( args[axisString+'Label'] ){
                    _['lab_'+axisString] = _.labels.append('text')
                        .attr('class', prefix + 'label-'+axisString)
                        .attr('y', function(){
                            return getLabelPosition('y',axisString);
                        })
                        .attr('x', function(){
                            return getLabelPosition('x',axisString);
                        })
                        .attr('font-size', '1em')
                        .attr('text-anchor', 'middle')
                        .text(args[axisString+'Label']);


                    if(axisString == 'y') {
                        _['lab_'+axisString].attr('transform', 'rotate(-90)');
                    }
                }

                //ruler
                    _['rule_'+gridString+axisString] = setRuleContainer(axisString,containerObj,isGrid);
                    

                //axis
                    _['axis_'+gridString+axisString] = setAxis(axisString,isGrid);

            }
        }


        //render a good boi
        var setData = function(retrievedData,_){
            var data = null;

            //duration
            _.duration = d3.transition().duration(args.transition);


            //element
            switch(args.type){
                case 'bar':
                    _.graphItem = 'rect';
                    break;
                case 'line':
                case 'scatter':
                    _.graphItem = 'circle';
                    break;
            }
            // heck if src key exists
            if (args.srcKey) {
                data = deepGet(retrievedData,args.srcKey);
            }else{
                data = retrievedData;
            }
            
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


            //canvas
                _.off_x = getCanvasPadding('x'),
                _.off_y = getCanvasPadding('y'),
                _.outerWidth = args.width + (_.off_x * 2),
                _.outerHeight = args.height + (_.off_y * 2),
                _.canvas = d3.select(selector)
                    // .style('padding-top', (args.margin * (args.marginOffset * .75)) + 'px')
                    .append('div')
                    .attr('class', prefix + 'wrapper');

                _.dimensionString = '0 0 '+ _.outerWidth +' ' + _.outerHeight;



                _.svg = _.canvas.append('svg')
                    .attr('id',selector+'-svg')
                    .attr('class', prefix + 'svg')
                    .attr('viewBox',_.dimensionString)
                    .attr("preserveAspectRatio", "xMinYMin meet")
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

                    //x COORDINATE value
                    switch ( args.yAlign+' '+ ((args.xLabel == '') ? 'empty' : 'has') ){
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
                    switch ( args.xAlign+' '+ ((args.yLabel == '') ? 'empty' : 'has') ){
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

            }else{
                // legends and shit
                _.labels = _.container.append('g')
                    .attr('class', prefix + 'labels');
    
                _.rule = _.container.append('g')
                    .attr('class', prefix + 'axis');

                    
                _.grid = _.container.append('g')
                    .attr('class', prefix + 'grid');
                    

                itemAtts.forEach(function(itemAtt){
                    
                    // scale
                    _['range_'+itemAtt] = getRange(itemAtt),

                    //vars
                    _['the_'+itemAtt] = setScale(itemAtt);

                    if (itemAtt == 'x' || itemAtt == 'y'){
                        renderAxis(itemAtt,_.rule)

                        

                        //formatter
                        _['format_'+itemAtt] = args[itemAtt+'Parameter'] || function(dis){
                            var dataPossiblyDivided = (args[axisString+'Data'] == 1 ) ? (dis / args[axisString+'Divider']): dis,
                            formatted = args[axisString+'Prepend'] + dataPossiblyDivided + args[axisString+'Append'];

                            return formatted;
                        }


                        _['dom_'+itemAtt] = getDomain(
                            itemAtt,
                            data
                        );
                        _['the_'+itemAtt].domain(_['dom_'+itemAtt]);
                        if( args[itemAtt+'Ticks'] ){
                            _['rule_'+itemAtt].transition(args.delay).call( _['axis_'+itemAtt])
                                .attr('font-family','inherit')
                                .attr('font-size',null);

                            if(args[itemAtt+'Grid']){
                                renderAxis(itemAtt,_.grid,true)
                                _['rule_grid_'+itemAtt].call( _['axis_grid_'+itemAtt]);
                            }
                        }
                    };


                })



                //select
                _.graph = _.container.insert('g',':first-child')
                    .attr(
                        'class',
                        prefix + 'graph' + ' '
                        + prefix + ( (args.colorPalette.length > 0 || args.linePointsColor !== null || args.lineColor !== null) ?  'has-palette' : 'no-palette' )
                        + ((!args.xTicks && !args.yTicks) ? ' '+prefix+'item-data-no-ticks' : '')
                    );
                    if(data.length > 9 && args.width == defaults.width && args.height == defaults.height){

                        console.log(selector+' Width and height was not adjusted. graph elements may not fit in the canvas');
                    }

                if(!(args.type == 'line' && !args.linePoints)){


                    _.blob = _.graph.selectAll(_.graphItem)
                        .data(data,function(dis){
                            return dis[args.dataKey[args.xData]]
                        });
                }

                //colors kung meron
                if(args.colorPalette.length > 0) {
                    _.dom_color = getDomain('color',data);
                }



            } 

            //check if it's loaded boi
            _.dv_init = false;

            document.addEventListener('scroll',function(e) {
                var graphPosition = dataContainer.getBoundingClientRect().y;

                if(graphPosition < (window.innerHeight * .5) && !_.dv_init) {
                    _.dv_init = true;
                    setTimeout(function(){
                        renderGraph(_,data);
                    },args.delay);
                }
            },true);

        }
                



        // tick inits
        var renderGraph = function(_,data) {
            // ok do the thing now
            console.log(selector,'-------------------------------------------------------------------')
            console.log('calculated',_);
            // console.log('data',dat);
            // console.log('args',args);

                
            // console.log('x');
            // console.log('domain',_.dom_x);
            // console.log('range',_.range_x);

            // console.log('----------------');

            // console.log('y');
            // console.log('domain',_.dom_y);
            // console.log('range',_.range_y);


            //generate the graph boi

            if(args.type == 'pie'){
                
            }else{
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
                                    return _.the_color(dis[args.colorData]);
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




                if(args.type == 'line'){


                    if(args.lineFill){
                        _.fill = _.graph.append('path')
                        .attr('class',prefix+'fill')
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


                    _.line = _.graph.append('path')
                        .attr('class',prefix+'line')
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
                
            }
                    
            //graph item label if ticks are not set
            if( !args.xTicks || !args.yTicks ){

                _.blobText =  _.blobWrap.append('text')
                    .attr('class', function(dis,i){
                        var classString =  prefix + 'item-text';

                        coordinates.forEach(function(coordinate){
                            // console.log(selector,dis.name, coordinate,getBlobSize(coordinate,dis,i,false), args[coordinate+'Data']);
                            if( 
                                (
                                    parseFloat(getBlobSize(coordinate,dis,i,false)) < _.mLength
                                    && args[coordinate+'Data']  == 1
                                )
                                || (
                                    (args.colorPalette.length > 0)
                                    && (parseFloat(getBlobSize('x',dis,i,false)) > _.mLength)
                                    && (parseFloat(getBlobSize('y',dis,i,false)) > _.mLength)
                                    && !isDark( _.the_color(dis[args.colorData]) )
                                )
                                || (args.type == 'line')
                            ){
                                classString +=  ' dark';
                            }
                        });
                        console.log('shiet',classString);

                        return classString;
                    })

                    
                    .attr('transform',function(dis,i){
                        return 'translate('+getBlobTextOrigin('x',dis,i,true)+','+getBlobTextOrigin('y',dis,i,true)+')'
                    })
                    .style('opacity',1);

                _.blobText
                    .transition(_.duration)
                    .attr('transform',function(dis,i){
                        return 'translate('+getBlobTextOrigin('x',dis,i)+','+getBlobTextOrigin('y',dis,i)+')'
                    })
                    .style('opacity',1);



                    coordinates.forEach(function(coordinate){

                    if( !args[coordinate+'Ticks'] ){

                        _['blobText'+coordinate] = _.blobText.append('tspan')

                            .attr('class', prefix+'item-data-'+args[coordinate+'Data'] )
                            .attr('dominant-baseline','middle')
                            .attr('text-anchor',function(dis,i){
                                return getBlobTextAnchor(dis,i);
                            })
                            .attr('font-size',null)
                            .text(function(dis,i){
                                var text = deepGet(dis,args.dataKey[ args[coordinate+'Data'] ])
                                return text;
                            })
                            .attr('x',getBlobTextBaselineShift('x',coordinate))
                            .attr('y',getBlobTextBaselineShift('y',coordinate));
                    }
                });
                
            }


        }


        switch(args.srcPath.getFileExtension()) {
            case 'csv':
                d3.csv(args.srcPath).then(function(data){
                    setData(data,_);
                });
                break;
            case 'tsv':
                d3.tsv(args.srcPath).then(function(data){
                    setData(data,_);
                });
                break;
            
            case 'json':
                d3.json(args.srcPath).then(function(data){
                    setData(data,_);
                });
                break;
            //probably embeded
            default:
                if(args.srcPath.getHash()){
                    var jsonSelector = dataContainer.querySelector('script[type="application/json"]').innerHTML;
                    if(jsonSelector.isValidJSONString()){

                        var dataIsJSON = JSON.parse(jsonSelector);

                        // console.log('data json',dataIsJSON);

                        setData(dataIsJSON,_);
                    }else{
                        if(args.srcType == 'text'){

                            console.error('Data input may not be valid. Please check and update the syntax')
                        }else{

                            console.error('The data source is not a supported format. Please make sure data is linked either as a json,csv, tsv or direct input in the fields')
                        }
                    }
                }
        }
        
        
        
    }

    

    _1p21.dataVisualizer = dataVisualizer;

    window._1p21 = _1p21;
}(window,d3));