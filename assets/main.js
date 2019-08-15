"use strict";
/* DO NOT TOUCH I DEV ON THIS BOI I ENQUEUE THE MINIFIED ONE ANYWAY  :< */
(function(window,d3){
    var _1p21 = _1p21 || {};

    // helpful variables
    var coordinates = ['x','y'], //yes
        itemAtts = ['x','y','colors','area','r'], //opo //check if the graph item's length is enough for vertical bois idk i'll work on this some more later
        prefix = 'data-visualizer-'; //yeeee
    
    //get the length attribute to associate with the axis bro
    var dimensionAttribute = function(axisString,opposite){
        

        if(opposite){
            return (axisString == 'x') ? 'height' : 'width';
        }else{
            // switch(axisString){
            //     case 'x':
            //         return 'width';
            //     case 'y':
            //         return 'height';
            //     case 'r':
            //         return 'r';
            // }
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
            } 
            else {
        
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
            width: 600,
            height:400,
            margin: 20, // @TODO option to separate padding
            marginOffset: 2,
            transition: 1500,
            delay: 300,
            type: 'bar',
            dataKey: [
                0, //data 1 / name
                1 //data 2 / value
            ],
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
            yPrepend: '',
            yAppend: '',
            yDivider: 1,

            //line
            lineStyle: '',
            lineColor: null,
            linePoints: false,
            lineFill: false,
            linePointsColor: null,
            linePointsSize: null,
            lineFillColor: null,
            lineFillAxis: 'x',
            lineDash: [],
    
            //kulay
            colors : [],
            colorsData: null,
    
            //area? in case scatter plot ir pi idk what the fuck i'm doing right now but its here in case. yes i shall need this boi
            areaKey: '',
    
            //src
            srcType: '',
            srcPath: '',
            srcKey: null,
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
            var splitString = keysString.split('.');

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
                    toReturn = obj;
                }

                return toReturn;
            }

            var value = isNum ? parseFloat(multiIndex(obj,splitString)) : multiIndex(obj,splitString);
            return value;
        }

        //set range of the bois
        // @param - itemAtt : duh
        var getRange = function(itemAtt){

            var range = [];

            switch(itemAtt){

                case 'colors':
                    range = args[itemAtt];
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
                    case 'colors':
                        
                        var keyString =  args.colorsData || args.dataKey[0];
                        
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
                        
                        switch(dataKeyI){
                            case 1: // numeric fuck
                                var min,max;
                                
                                if(args[itemAtt + 'Min'] !== null){
                                    min = args[itemAtt + 'Min'];

                                }else{
                                    min = d3.min(dat,function(dis){
                                        return deepGet(dis,args.dataKey[ dataKeyI ],dataKeyI);
                                    });
                                }
                                
                                if(args[itemAtt + 'Max'] !== null){
                                    max = args[itemAtt + 'Max']
                                }else{
                                    max = d3.max(dat,function(dis){
                                        return deepGet(dis,args.dataKey[ dataKeyI ],dataKeyI);
                                    });
                                }

                                domain = [min,max];

                                break;
                            
                            default: //not a numeric fuck and each instance is ok
                                
                                domain =  dat.map(function(dis){
                                    return deepGet(dis,args.dataKey[ dataKeyI ], dataKeyI);
                                });

                                break;
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


                    if(dataKeyI  == 0){
                        dimension = _['the_'+axisString].bandwidth()
                    }else{
                        
                        if(initial) {
                            dimension = 0;
                        }else{

                            if( oppositeAxisAlignment == 'right' || oppositeAxisAlignment == 'bottom' ){
                                dimension = args[dimensionAttribute(axisString)] - _['the_'+axisString]( deepGet(dis,dataKey,dataKey) );
                            }else{
                                dimension = _['the_'+axisString]( deepGet( dis,dataKey,dataKey ) );
                            }

                        }

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
            var getBlobTextBaseline = function (dis,i){
                var baseline = 'middle';

                if(args.xData == 0) {
                    
                    if(args.xAlign == 'bottom'){
                        baseline = 'hanging';
                    }else{
                        baseline = 'auto';
                    }

                }

                return baseline;

            }

            //more confusuin
            var getBlobTextAnchor = function(dis,i){
                var anchor = 'middle';

                if(args.type == 'pie'){
                
                }else{

                    if(args.yData == 0) {
                            anchor = 'start';
                    }

                }
                return anchor;
            }


        //pls do not ask me po this broke my brain i will not likely know what just happened
        var getBlobTextShift = function(coordinateAttribute,axisString,dis,i,initial){

            var shift = 0;
            initial = initial || false;
            if(args.type == 'pie'){

            }else{
                if((!args.xTicks && args.yTicks) || (args.xTicks && !args.yTicks) ){ //if only one of the ticks is set
                    if(args[coordinateAttribute+'Data'] == 1 ){ // wait what the fuck wait
                        if(args['xAlign'] == 'top' ){ //doesnt matter what data is in x i have to set the vertical boi
                            if(
                                ( parseFloat( getBlobSize('y',dis,i,false) ) > _.mLength )
                                || ( initial && parseFloat( getBlobSize('y',dis,i,false) ) < _.mLength )
                            ) {
                                shift = '-1em';
                            }else{
                                    shift = '2em';
                            }
                        }else{
                            
                            shift = '1em';

                        }
                    }
                }else{ //oh boi both are not there
                    if(coordinateAttribute == 'x'){ // set x coordinate
                        if(args[coordinateAttribute+'Data'] == 1 ){
                            shift = '10'
                        }
                    }else{ //set y coordinate
                        if(args[oppositeAxisString(coordinateAttribute) + 'Data'] == 0 ){ //if x axis is labels
                            if(args[oppositeAxisString(coordinateAttribute) + 'Align'] == 'bottom'){ //aligned to coordinate which is y
                                if(
                                    ( parseFloat( getBlobSize('y',dis,i,false) ) > _.mLength )
                                    || ( initial && parseFloat( getBlobSize('y',dis,i,false) ) < _.mLength )
                                ) {
                                    shift = '1.5em';
                                }else{
                                        shift = '-2.5em';
                                }
                            }else{
                                if( dis[ args.dataKey[ args[coordinateAttribute + 'Data'] ] ] !== dis[ args.dataKey[ args[axisString + 'Data'] ] ] ){ // if text is the label data
    
                                    shift = '-2em'
                                }else{
                                    shift = '-1.75em'
    
                                }
                            }
                        }else{
                            if( dis[ args.dataKey[ args[coordinateAttribute + 'Data'] ] ] !== dis[ args.dataKey[ args[axisString + 'Data'] ] ] ){ // if text is the label data
                                shift = '-.25em'
                            }else{
                                shift = '1.375em'
                            }
                        }
                    }
                }
            }

            
            return shift;
        }

        var getBlobTextOrigin = function(coordinate,dis,i,initial){
            //coordinate is influenced by the axis right now so this is the only time coordinate and axis is one and the same. i think... do not trust me on this
            var dataKeyI =  args[ coordinate+'Data'],
                offset = 0;
                initial = initial || false;

            if(args.type == 'pie'){
            
            }else{

                    if(dataKeyI  == 0) {
                        offset = getBlobOrigin(coordinate,dis,i) + (getBlobSize(coordinate,dis,i) / 2);
                        if(args.type == 'line' || args.type == 'scatter') {
                            offset -= getBlobSize(coordinate,dis,i) / 2;
                        }
                    }else{

                        if( args[oppositeAxisString(coordinate)+'Align'] == 'bottom' || args[oppositeAxisString(coordinate)+'Align'] == 'right' ){
                            if(initial) {
                                offset = args[dimensionAttribute(coordinate)] - ((!args.xTicks && !args.yTicks) ? 65 : 30)
                            }else{
                                offset = args[dimensionAttribute(coordinate)] - getBlobSize(coordinate,dis,i);
                            }
                            
                        }else if( args[oppositeAxisString(coordinate)+'Align'] == 'top' ){
                            if(initial) {
                                if( args[oppositeAxisString(coordinate)+'Data'] !== 0 ){
                                    offset = args[dimensionAttribute(coordinate)] - getBlobSize(coordinate,dis,i);
                                }else{
                                    offset = offset + ((!args.xTicks && !args.yTicks) ? _.mLength : 30) 
                                }
                            }else{
                                offset = getBlobSize(coordinate,dis,i);
                            }

                        }else{
                            
                        }

                    }
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
                case 'scatter':
                case 'line':
                default:
                    

                    
                    if(dataKeyI  == 0){
                        offset = _['the_'+coordinate](deepGet(dis,dataKey,dataKeyI));
                        if(args.type == 'line' || args.type == 'scatter') {
                            offset += getBlobSize(coordinate,dis,i) / 2;
                        }
                    }else{
                        if( oppositeAxisAlignment == 'right' || oppositeAxisAlignment == 'bottom' ){
                            if(initial){
                                offset = args[dimensionAttribute(coordinate)];

                            }else{
                                offset = args[dimensionAttribute(coordinate)] - (args[dimensionAttribute(coordinate)] - _['the_'+coordinate]( deepGet(dis,dataKey,dataKeyI )));
                            }
                        }else{
                            if(args.type == 'line' || args.type == 'scatter'){
                                offset = _['the_'+coordinate]( deepGet(dis,dataKey,dataKeyI ));
                            }
                        }
                    }
                    

            }
            

            return offset;
        }

        // var getPathPoints = function(axisString,dis,i,initial){
        //     var point = 0,
        //         dataKeyI =  args[ axisString+'Data'],
        //         dataKey = args.dataKey[dataKeyI],
        //         oppositeAxisAlignment = args[ oppositeAxisString(axisString)+'Align'];
        //     if(initial){
        //         if(axisString == 'x'){

        //             if( dataKeyI == 0 ){
        //                 point = _['the_'+axisString]( deepGet(dis,dataKey,dataKeyI ));
        //             }
        //         }else{

        //             if( oppositeAxisAlignment == 'bottom' ){
        //                 point = args[dimensionAttribute(axisString)]
        //             }
        //         }

        //     }else{
        //         console.log(deepGet(dis,dataKey,dataKeyI ));
        //         point = _['the_'+axisString]( deepGet(dis,dataKey,dataKeyI ));

        //         if(dataKeyI  == 0) {
        //             point += getBlobSize(axisString,dis,i) / 2;
        //         }

        //     }
        //     return point;
        // }

        var getLinePath = function(data,initial){

            initial = initial || false;

            var line = d3.line()
                .x(function(dis,i){
                    return getBlobOrigin('x',dis,i,initial);
                })
                .y(function(dis,i){
                    return getBlobOrigin('y',dis,i,initial);
                });

            return line(data);

        }

        var setRuleContainer = function(axisString,containerObj){
            var rule = containerObj.append('g')
                .attr('class', prefix + 'axis-'+axisString+' '+ prefix +'axis-align-'+args[axisString+'Align'])

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




        var setAxis = function(axisString) {
            var axis,
                axisKey = 'Axis '+args[axisString+'Align'];




            
            axis = d3[axisKey.toCamelCase()](_['the_'+axisString]);


            if(args.hasOwnProperty(axisString +'Ticks')){
               if( args.hasOwnProperty(axisString +'TicksFormat') ){
                    axis.tickFormat( _['format_'+axisString] );
                };

                args.hasOwnProperty(axisString +'TicksAmount') && axis.ticks( args[axisString +'TicksAmount'] );
            }



            return axis;
            
        }

        //set the scale function thingy for the axis shit
        var setScale = function(itemAtt){
            var axis;
            var dataKeyI = args[ itemAtt+'Data'];

            switch(itemAtt){
                case 'colors':
                        axis = d3.scaleOrdinal()
                            .range(_['range_'+itemAtt]) 
                    break;
                case 'x':
                case 'y':
                    switch(dataKeyI){
                        case 0:
                            axis = d3.scaleBand() //scales shit to dimensios
                            .range(_['range_'+itemAtt]) // scaled data from available space

                            if(args.type == 'bar'){
                            axis
                                .paddingInner(.1) //spacing between
                                .paddingOuter(.1); //spacing of first and last item from canvas
                            }
                            break;
                        default:
                            axis = d3.scaleLinear()
                            .range(_['range_'+itemAtt]);
                            break;
                    }
                        
                    

            }
            
            return axis;

        };

        var renderAxis = function(axisString,containerObj) {
            if( args[axisString+'Ticks']) {

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
                    _['rule_'+axisString] = setRuleContainer(axisString,containerObj);

                //axis
                    _['axis_'+axisString] = setAxis(axisString);
                
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



            //half ass parse dem numeric data bois

            

            //     retrievedData.forEach(function(dis,i){
            //         coordinates.forEach(function(coordinate){
            //             var currentDataKey = args.dataKey[ args[ coordinate+'Data' ] ];
            //             if(  args[coordinate + 'Data'] !== 0 ){
            //                 dis['parsed_'+currentDataKey] = parseFloat( deepGet(dis,currentDataKey) );
            //             }
            //         });
            //     })

            // console.log(retrievedData);



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
                    };


                })

                //x axis
                _.dom_x = getDomain(
                    'x',
                    data
                );
                _.the_x.domain(_.dom_x);
                args.xTicks && _.rule_x.transition(args.delay).call( _.axis_x)
                    .attr('font-family','inherit')
                    .attr('font-size',null);


                // y axis
                _.dom_y = getDomain(
                    'y',
                    data
                );
                _.the_y.domain(_.dom_y);
                args.yTicks && _.rule_y.transition(args.delay).call( _.axis_y)
                    .attr('font-family','inherit')
                    .attr('font-size',null);


                //select
                _.graph = _.container.insert('g',':first-child')
                    .attr('class', prefix + 'graph' + ' ' + prefix + ( (args.colors.length > 0 || args.linePointsColor || args.lineColor) ?  'has-palette' : 'no-palette' ));
                    if(data.length > 9 && args.width == defaults.width && args.height == defaults.height){

                        console.log(selector+' Width and height was not adjusted. graph elements may not fit in the canvas');
                    }

                if(!(args.type == 'line' && !args.linePoints)){


                    _.blob = _.graph.selectAll(_.graphItem)
                        .data(data,function(dis){
                            return dis[args.dataKey[args.xData]]
                        });
                }


                if(args.type == 'line'){
                    _.line = _.graph.append('path')
                        .attr('class',prefix+'line')
                        .attr('fill','none')
                        .attr('d',function(){
                            return getLinePath(data,true)
                        });

                        if(args.lineColor) {
                            _.line
                                .attr('stroke',args.lineColor)
                        }

                
                }

                //colors kung meron
                if(args.colors.length > 0) {
                    _.dom_color = getDomain('colors',data);
                }

                // // scale
                // _.range_x = getRange(args.width,'x'),
                // _.range_y =  getRange(args.height,'y');

                // //vars
                // _.the_x = setScale('x');
                // _.the_y = setScale('y');


                // renderAxis('x',_.rule);
                // renderAxis('y',_.rule);



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
            // console.log(selector,'-------------------------------------------------------------------')
            // console.log('calculated',_);
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
                            .attr('class', prefix + 'item')

                    
                            

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

                        if(!args.colors.length){
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
                                    return _.the_colors(dis[args.colorsData]);
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


                if(args.type == 'line') {



                    if(args.type == 'line'){
                        _.line
                            .transition(_.duration)
                            .attr('d',function(){
                                return getLinePath(data)
                            });
                    }
                }
            }
                    
            //graph item label if ticks are not set
            if( !args.xTicks || !args.yTicks ){

                _.blobText = _.blobWrap.append('g')
                    .attr('class', prefix + 'item-text' + ( (!args.xTicks && !args.yTicks) ? ' '+ prefix +'item-data-no-ticks' : '') )
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



                ['x','y'].forEach(function(coordinate){

                    if( !args[coordinate+'Ticks'] ){

                        _['blobText'+coordinate] = _.blobText.append('text')
                            .attr('class', function(dis,i){
                                var classString =  prefix + 'item-data-'+args[coordinate+'Data'];
                                
                                if( 
                                    parseFloat(getBlobSize('y',dis,i,false)) < _.mLength
                                    || (
                                        (args.colors.length > 0)
                                        && (parseFloat(getBlobSize('y',dis,i,false)) > _.mLength)
                                        && !isDark( _.the_colors(dis[args.colorsData]) )
                                    )
                                    || (args.type == 'line')
                                ){
                                    classString += ' item-text-dark' + ' color-palette-'+args.colors.length;
                                }

                                return classString;
                            })
                            .attr('dominant-baseline',function(dis,i){
                                return getBlobTextBaseline(dis,i);
                            })
                            .attr('text-anchor',function(dis,i){
                                return getBlobTextAnchor(dis,i);
                            })
                            .attr('font-size',null)
                            .text(function(dis,i){
                                return deepGet(dis,args.dataKey[ args[coordinate+'Data'] ],args[coordinate+'Data']);
                            })
                            .attr('x',function(dis,i){
                                return getBlobTextShift('x',coordinate,dis,i,true)
                                // return 0;
                            })
                            .attr('y',function(dis,i){
                                return getBlobTextShift('y',coordinate,dis,i,true)
                            })

                        _['blobText'+coordinate]
                            .transition(_.duration)
                            .attr('x',function(dis,i){
                                return getBlobTextShift('x',coordinate,dis,i)
                                // return 0;
                            })
                            .attr('y',function(dis,i){
                                return getBlobTextShift('y',coordinate,dis,i)
                            })
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
                    var jsonSelector = dataContainer.querySelector('script[type="application/json"').innerHTML;
                    if(jsonSelector.isValidJSONString()){

                        var dataIsJSON = JSON.parse(jsonSelector);

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