// "use strict";
/* DO NOT TOUCH I DEV ON THIS BOI I ENQUEUE THE MINIFIED ONE ANYWAY  :< */
(function(window,d3){
    var _1p21 = _1p21 || {};

    // helpful variables
    var coordinates = ['x','y'],
        itemAttributes = ['x','y','colors','area'],
        prefix = 'data-visualizer-';
    
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
    

    // function that is open to the pooblic. this initiates the shiet
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
            duration: 1000,
            delay: 500,
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
            xTicksFormat: null,
            xMin: null,
            xMax: null,
    
            //y settings
            yData: 1,
            yAlign: 'left',
            yTicks: false,
            yLabel: null,
            yTicksAmount: null,
            yTickFormat: null,
            yMin: null,
            yMax: null,
    
            //kulay
            colors : [],
            colorsData: '',
    
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

        // set up padding 
        // @param - axisString : duh 
        var getCanvasPadding = function(axisString){
            var padding = 0;

            if(args.type !== 'pie'){
                padding = args.margin * (args.marginOffset * .5);

                // @TODO option to separate padding

                // if this axis has a label give it more space
                if( args[axisString+'Label'] ){
                    padding = args.margin * args.marginOffset;
                }
                
                // x axis with name keys need more space because text is long
                if(axisString == 'x' && args[oppositeAxisString(axisString)+'Data'] == 0 ){
                    padding = (args.margin * (args.marginOffset * 1.5));

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
        // @param - axisString : duh
        var getRange = function(itemAttribute){

            var range = [];

            switch(itemAttribute){
                case 'colors':
                    range = args[itemAttribute];
                    break;
                    case 'x':
                    case 'y':
                        if(args[oppositeAxisString(itemAttribute)+'Align'] == 'top' || args[oppositeAxisString(itemAttribute)+'Align'] == 'left') {
                            range = [ 0, args[ dimensionAttribute(itemAttribute) ] ];
                        }else{
                            range = [ args[ dimensionAttribute(itemAttribute) ] , 0 ];
                        }
                        break;
            }
            return range;
        }
        
        var getDomain = function(itemAttribute,dat){

            var dataKeyI =  args[ itemAttribute+'Data'],
                domain = [];
            // var dataKeyI = deepGet();

            switch(itemAttribute){
                case 'colors':
                    
                    var keyString =  args.colorsData || args.dataKey[0];
                    
                    const instances = dat.reduce(function(acc,dis){
                        console.log(acc);
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

                            if(args[itemAttribute + 'Min'] !== null){
                                min = args[itemAttribute + 'Min'];

                            }else{
                                min = d3.min(dat,function(dis){
                                    return deepGet(dis,args.dataKey[ dataKeyI ],dataKeyI);
                                });
                            }



                            if(args[itemAttribute + 'Max'] !== null){
                                max = args[itemAttribute + 'Max']
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
                        offset = args[dimensionAttribute(axisString,true)] + (_.off_y - (args.margin * .75)); //args.height + ()
                    }else{
                        offset = -(_.off_y - (args.margin * 1.5));
                    }
                }else if(axisString == 'y'){
                    if(args[axisString+'Align'] == 'right'){
                        offset = args[dimensionAttribute(axisString,true)] + (_.off_x * .75);
                    }else{
                        offset = -(_.off_x * .75)
                    }
                };
            }

            return offset;
        }

        //attricutie setup for types
            //BAR

        var getBlobSize = function(axisString,dis,i,initial) {
            var dataKeyI =  args[ axisString+'Data'],
                dataKey = args.dataKey[dataKeyI],
                oppositeAxisAlignment = args[ oppositeAxisString(axisString)+'Align'],
                dimension = 20,
                initial = initial || false;



            switch(args.type) {
                case 'pie':
                    break;
                case 'scatter':
                        //radius
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
        
        //oh god im so confuse
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


        //pls do not ask me this broke my brain i will not likely know what just happened
        var getBlobTextShift = function(coordinateAttribute,axisString,dis,i){

            var shift = 0;
            if(args.type == 'pie'){

            }else{
                if((!args.xTicks && args.yTicks) || (args.xTicks && !args.yTicks) ){ //if only one of the ticks is set
                    if(args[coordinateAttribute+'Data'] !== 0 ){
                        
                        if(args[oppositeAxisString(coordinateAttribute)+'Data'] == 'top' ){

                            shift = '-1em';
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
                                shift = '1.5em'
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

        var getBlobTextOrigin = function(coordinate,dis,i){
            //coordinate is influenced by the axis right now so this is the only time coordinate and axis is one and the same. i think... do not trust me on this
            var dataKeyI =  args[ coordinate+'Data'],
                offset = 0;

            if(args.type == 'pie'){
            
            }else if(args.type == 'line'){
            }else{

                    if(dataKeyI  == 0) {

                        offset = getBlobOrigin(coordinate,dis,i) + (getBlobSize(coordinate,dis,i) / 2)
                    }else{
                        if( args[oppositeAxisString(coordinate)+'Align'] == 'bottom' || args[oppositeAxisString(coordinate)+'Align'] == 'right' ){
                            offset = args[dimensionAttribute(coordinate)] - getBlobSize(coordinate,dis,i)
                        }else if( args[oppositeAxisString(coordinate)+'Align'] == 'top'){
                            offset = getBlobSize(coordinate,dis,i);

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
                initial = initial || false,
                offset = 0;

                switch(args.type) {
                case 'pie':
                    break;
                case 'scatter':
                        //radius
                    break;
                default:
                    

                    
                    if(dataKeyI  == 0){
                        offset = _['the_'+coordinate](deepGet(dis,dataKey,dataKeyI));
                    }else{
                        if( oppositeAxisAlignment == 'right' || oppositeAxisAlignment == 'bottom' ){
                            if(initial){
                                offset = args[dimensionAttribute(coordinate)];

                            }else{
                                offset = args[dimensionAttribute(coordinate)] - (args[dimensionAttribute(coordinate)] - _['the_'+coordinate]( deepGet(dis,dataKey,dataKeyI )));
                            }
                        }
                    }
                    

            }
            

            return offset;
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
            var axis;
            switch(args[axisString+'Align']) {
                case 'top':
                    axis = d3.axisTop(_['the_'+axisString]);
                    break;
                case 'bottom':
                    axis = d3.axisBottom(_['the_'+axisString]);
                    break;
                case 'left':
                    axis = d3.axisLeft(_['the_'+axisString]);
                    break;
                case 'right':
                    axis = d3.axisRight(_['the_'+axisString]);
                    break;
            }



            if(args.hasOwnProperty(axisString +'Ticks')){
                args.hasOwnProperty(axisString +'TicksFormat') && axis.tickFormat( args[axisString +'TicksFormat'] );
                args.hasOwnProperty(axisString +'TicksAmount') && axis.ticks( args[axisString +'TicksAmount'] );
            }



            return axis;
            
        }

        //set the scale function thingy for the axis shit
        var setScale = function(itemAttribute){
            var axis;
            var dataKeyI = args[ itemAttribute+'Data'];

            switch(itemAttribute){
                case 'colors':
                        axis = d3.scaleOrdinal()
                            .range(_['range_'+itemAttribute]) 
                    break;
                case 'x':
                case 'y':
                    switch(dataKeyI){
                        case 0:
                            axis = d3.scaleBand() //scales shit to dimensios
                            .range(_['range_'+itemAttribute]) // scaled data from available space
                            .paddingInner(.1) //spacing between
                            .paddingOuter(.1); //spacing of first and last item from canvas
                            break;
                        default:
                            axis = d3.scaleLinear()
                            .range(_['range_'+itemAttribute]);
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
        var renderData = function(selector,data,_){
            // heck if src key exists
            var retrievedData = data;

            //duration
            _.duration = d3.transition().duration(args.duration);


            //element
            switch(args.type){
                case 'bar':
                    _.graphItem = 'rect';
                    break;
                case 'scatter':
                    _.graphItem = 'circle';
                    break;
            }

            if (args.srcKey) {
                retrievedData = deepGet(data,args.srcKey);
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
                    .attr('class', prefix + 'wrapper'),



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

                coordinates.forEach(function(coordinate){
                    // scale
                    _['range_'+coordinate] = getRange(coordinate),

                    //vars
                    _['the_'+coordinate] = setScale(coordinate);


                    renderAxis(coordinate,_.rule);
                })

                // // scale
                // _.range_x = getRange(args.width,'x'),
                // _.range_y =  getRange(args.height,'y');

                // //vars
                // _.the_x = setScale('x');
                // _.the_y = setScale('y');


                // renderAxis('x',_.rule);
                // renderAxis('y',_.rule);



            } 

            setTimeout(function(){

                renderUpdate(retrievedData,_);
            },args.delay);

        }
                



        // tick inits
        var renderUpdate = function(dat,_) {
            // ok do the thing now
            console.log('calculated',_);
            console.log('data',dat);
            console.log('args',args);


            //x axis
            _.dom_x = getDomain(
                'x',
                dat
            );
            _.the_x.domain(_.dom_x);
            args.xTicks && _.rule_x.transition(_.duration).call( _.axis_x)
                .attr('font-family','inherit')
                .attr('font-size',null);


            // y axis
            _.dom_y = getDomain(
                'y',
                dat
            );
            _.the_y.domain(_.dom_y);
            args.yTicks && _.rule_y.transition(_.duration).call( _.axis_y)
                .attr('font-family','inherit')
                .attr('font-size',null);


            //select
            _.graph = _.container.insert('g',':first-child')
                .attr('class', prefix + 'graph');

            _.blob = _.graph.selectAll(_.graphItem)
                .data(dat,function(dis){
                    return dis[args.dataKey[args.xData]]
                });

            //colors kung meron

            if(args.colors) {
                // _.dom_color = getDomain('colors',dat);
                
            }

                
            console.log('x');
            console.log('domain',_.dom_x);
            console.log('range',_.range_x);

            console.log('----------------');

            console.log('y');
            console.log('domain',_.dom_y);
            console.log('range',_.range_y);


            if(args.type == 'pie'){

            }else{
                
                _.blob.exit()
                    .transition(_.duration)
                    .attr('height',0)
                    .remove();

                    
                _.blobWrap = _.blob
                    .enter()
                    .append('g')
                        .attr('class', prefix + 'item')
                        

                _.blobWrap
                    .append(_.graphItem)
                    .attr('width',function(dis,i){
                        return getBlobSize('x',dis,i,true);
                    }) // calculated width
                    .attr('height',function(dis,i){
                        return getBlobSize('y',dis,i,true);
                    })

                    .attr('x',function(dis,i){
                        return getBlobOrigin('x',dis,i,true)
                        // return _.the_x(dis[args.dataKey[args.xData]])
                    })

                    .attr('y',function(dis,i){
                        return getBlobOrigin('y',dis,i,true)
                        // return getBlobOrigin('y','y',dis,i)
                        // return 0;
                        // return args.height - _.the_y(dis[args.dataKey[args.yData]])
                        // return _.the_y(dis[args.dataKey[args.yData]])
                    })

                    // .merge(_.blob)
                    .transition(_.duration)
                        .attr('width',function(dis,i){
                            return getBlobSize('x',dis,i);
                        }) // calculated width
                        .attr('height',function(dis,i){
                            return getBlobSize('y',dis,i);
                        })

                        .attr('x',function(dis,i){
                            return getBlobOrigin('x',dis,i)
                            // return _.the_x(dis[args.dataKey[args.xData]])
                        })

                        .attr('y',function(dis,i){
                            return getBlobOrigin('y',dis,i)
                            // return getBlobOrigin('y','y',dis,i)
                            // return 0;
                            // return args.height - _.the_y(dis[args.dataKey[args.yData]])
                            // return _.the_y(dis[args.dataKey[args.yData]])
                        });
                        
                


                if( !args.xTicks || !args.yTicks ){
                    // data 1

                    _.blobText = _.blobWrap.append('g')
                        .attr('class', prefix + 'item-text' + ( (!args.xTicks && !args.yTicks) ? ' '+ prefix +'item-data-no-ticks' : '') )
                        .attr('transform',function(dis,i){
                            return 'translate('+getBlobTextOrigin('x',dis,i)+','+getBlobTextOrigin('y',dis,i)+')'
                        })

                        if(args.type == 'pie'){

                        }else{

                            coordinates.forEach(function(coordinate){

                                if( !args[coordinate+'Ticks'] ){

                                    _['blobText'+coordinate] = _.blobText.append('text')
                                        .attr('class', prefix + 'item-data-'+args[coordinate+'Data'])
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

            }


        }


        switch(args.srcPath.getFileExtension()) {
            case 'csv':
                d3.csv(args.srcPath).then(function(data){
                    renderData(selector,data,_);
                });
                break;
            case 'tsv':
                d3.tsv(args.srcPath).then(function(data){
                    renderData(selector,data,_);
                });
                break;
            
            case 'json':
                d3.json(args.srcPath).then(function(data){
                    renderData(selector,data,_);
                });
                break;
            //probably embeded
            default:
                if(args.srcPath.getHash()){
                    var jsonSelector = dataContainer.querySelector('script[type="application/json"').innerHTML;
                    if(jsonSelector.isValidJSONString()){

                        var dataIsJSON = JSON.parse(jsonSelector);

                        renderData(selector,dataIsJSON,_);
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