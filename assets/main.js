// "use strict";

(function(window,d3){
    var _1p21 = _1p21 || {};

    // helpful variables
    //for bar
    var coordinates = ['x','y'],
        prefix = 'data-visualizer-';
    
    
    var dimensionAttribute = function(axisString,opposite){

        
        if(opposite){
            return (axisString == 'x') ? 'height' : 'width';
        }else{
            return (axisString == 'x') ? 'width' : 'height';
        }
    }

    var oppositeAxisString = function(axisString) {
        return (axisString == 'x') ? 'y' : 'x';
    }
    

    //string helpers

    String.prototype.getFileExtension = function() {
        return this.split('.').pop();
    }

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

    // y.domain([
    //     0,
    //     d3.max(dat,function(dis){
    //         return dis[args.dataKey[args.yData]];
    //     })
    // }

    

    //initial function
    var dataVisualizer = function(selector,arr){
        var dataContainer = document.querySelector(selector);

        //stor variables initiated after sucessful data call + parameter declaration set as something_x so its easier to tell apart which shit is set by hooman and which one javascript sets up for hooman
        var _ = {};

        //default params
        var defaults  = {
            width: 600,
            height:400,
            margin: 20,
            marginOffset: 3,
            duration: 1000,
            delay: 500,
            type: 'bar',
            dataKey: [
                0, //data 1 / name
                1 //data 2 / value
            ],
            dataOneIsNum: false,
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
    
            //area? in case scatter plot ir pi idk what the fuck i'm doing right now
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

        // @TODO gmake this happen for dataY,dataX,colorda
        var getData = function(data,dataKeyArr){
            data = data || [];
            //remove the shit dumbass str_replace of php didn't get to
            dataKeyArr = dataKeyArr.filter(function(key){
                return key !== '';

            });
            ;

            dataKeyArr.forEach(function(key,i){
                if(data.hasOwnProperty(dataKeyArr[i]) ){
                    data = data[dataKeyArr[i]]
                }
            });

            return data;
        }

        //set range of the bois
        var getRange = function(dimension,axisString){


            var range = [];
            if(args[oppositeAxisString(axisString)+'Align'] == 'top' || args[oppositeAxisString(axisString)+'Align'] == 'left') {
                range = [0,dimension]
            }else{
                range = [dimension,0]
            }
            return range;
        }
        
        var getDomain = function(axisString,dat){

            var dataKeyI =  args[ axisString+'Data'];
            axisString = axisString.toLowerCase();
            
            if( dataKeyI  == 0 && !args.dataOneIsNum) {


                return dat.map(function(dis){
                    return dis[ args.dataKey[ dataKeyI ] ];
                });
            }else{
                var domain = [],
                min,
                max;

                if(args[axisString + 'Min'] !== null){
                    min = args[axisString + 'Min'];

                }else{
                    min = d3.min(dat,function(dis){
                        return dis[ args.dataKey[ dataKeyI ] ];
                    });
                }



                if(args[axisString + 'Max'] !== null){
                    max = args[axisString + 'Max']
                }else{
                    max = d3.max(dat,function(dis){
                        return dis[ args.dataKey[ dataKeyI ] ];
                    });
                }
                domain = [min,max];

                return domain;
                
            }
        };


    //AXIS STRING AND AXIS POSITION COORDINATES ARE VERY DIFFERENT THINGS U DUMB FUCK
        var getLabelPosition = function(coordinateAttribute,axisString){ 
            var theOffset = 0;

            if(coordinateAttribute == 'x'){ //x

                if(axisString == 'x'){
                    theOffset = args[dimensionAttribute(axisString)] / 2;
                }else if(axisString == 'y'){
                    theOffset = -(args[dimensionAttribute(axisString)] / 2)
                };
                
            }else{ //y
                
                if(axisString == 'x'){
                    if(args[axisString+'Align'] == 'bottom'){
                        theOffset = args[dimensionAttribute(axisString,true)] + (_.offV - (args.margin * .75)); //args.height + ()
                    }else{
                        theOffset = -(_.offV - (args.margin * .75));
                    }
                }else if(axisString == 'y'){
                    if(args[axisString+'Align'] == 'right'){
                        theOffset = args[dimensionAttribute(axisString,true)] + (_.offH * .75);
                    }else{
                        theOffset = -(_.offH * .75)
                    }
                };
            }

            return theOffset;
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

                    if(dataKeyI  == 0 && !args.dataOneIsNum){
                        dimension = _['the_'+axisString].bandwidth()
                    }else{
                        if(initial) {
                            dimension = 0;
                        }else{

                            if( oppositeAxisAlignment == 'right' || oppositeAxisAlignment == 'bottom' ){
                                dimension = args[dimensionAttribute(axisString)] - _['the_'+axisString](dis[dataKey]);
                            }else{

                                dimension = _['the_'+axisString](dis[dataKey]);
                            }
                        }
                    }

            }
            

            return dimension
        }
        
        //oh god im so confuse
        var getBlobTextBaseline = function (dis,i){
            var baseline = 'middle';

            if(args.xData == 0 && !args.dataOneIsNum) {
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

                if(args.yData == 0 && !args.dataOneIsNum) {
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
                if((!args.xTicks && args.yTicks) || (args.xTicks && !args.yTicks) ){
                    if(args[coordinateAttribute+'Data'] !== 0 && !args.dataOneIsNum ){
                        console.log('fuck');
                        if(args[oppositeAxisString(coordinateAttribute)+'Data'] == 'top' ){

                            shift = -1;
                        }else{
                            
                            shift = 1;

                        }
                    }
                }else{
                    if(coordinateAttribute == 'x'){
                    }else{ //y

                        if(args[coordinateAttribute+'Data'] == 0 && args.dataOneIsNum){

                        }else{
                        
                            if(args[oppositeAxisString(coordinateAttribute) + 'Align'] == 'bottom'){ //aligned to coordinate which is y
                                shift = 1.5
                            }else{
                                if( dis[ args.dataKey[ args[coordinateAttribute + 'Data'] ] ] !== dis[ args.dataKey[ args[axisString + 'Data'] ] ] ){ //current
    
                                    shift = -2
                                }else{
                                    shift = -1.75
    
                                }
                            }

                        }
                        
                    }
                }
            }

            var shiftString = shift + "em";
            return shiftString;
        }

        var getBlobTextOrigin = function(coordinate,dis,i){
            //coordinate is influenced by the axis right now so this is the only time coordinate and axis is one and the same. i think... do not trust me on this
            var dataKeyI =  args[ coordinate+'Data'];

                offset = 0;

            if(args.type == 'pie'){
            
            }else if(args.type == 'line'){
            }else{

                    if(dataKeyI  == 0 && !args.dataOneIsNum) {

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
                    

                    
                    if(dataKeyI  == 0 && !args.dataOneIsNum){
                        offset = _['the_'+coordinate](dis[dataKey]);
                    }else{
                        if( oppositeAxisAlignment == 'right' || oppositeAxisAlignment == 'bottom' ){
                            if(initial){
                                offset = args[dimensionAttribute(coordinate)];

                            }else{
                                offset = args[dimensionAttribute(coordinate)] - (args[dimensionAttribute(coordinate)] - _['the_'+coordinate](dis[dataKey]));
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
        var setScale = function(axisString){
            var axis;
            var dataKeyI = args[ axisString+'Data'];
            if(dataKeyI == 0 && !args.dataOneIsNum) {
                axis = d3.scaleBand() //scales shit to dimensios
                    .range(_['range_'+axisString]) // scaled data from available space
                    .paddingInner(.1) //spacing between
                    .paddingOuter(.1); //spacing of first and last item from canvas
            }else{
                axis = d3.scaleLinear()
                .range(_['range_'+axisString]);
            }

            if(args.type == 'bar'){
                axis
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
                retrievedData = getData(data,args.srcKey);
            }


            //half ass parse dem numeric data bois

            coordinates.forEach(function(coordinate){

                retrievedData.forEach(function(dis){
                    var currentDataKey = args.dataKey[ args[ coordinate+'Data' ] ];
                    if(  !args.dataOneIsNum && args[coordinate + 'Data'] !== 0 ){
                        dis[ currentDataKey ] = +dis[ currentDataKey ];
                    }
                });
            })

            //canvas
                _.canvas = d3.select(selector)
                    .style('padding-top', (args.margin * args.marginOffset) + 'px')
                    .append('div')
                    .attr('class', prefix + 'wrapper'),

                    _.offH = (args.yLabel) ?  args.margin * args.marginOffset : args.margin * (args.marginOffset * .5),
                    _.offV = (args.xLabel) ?  args.margin * args.marginOffset : args.margin * (args.marginOffset * .5),
                    _.outerWidth = args.width + (_.offH * 2),
                    _.outerHeight = args.height + (_.offV * 2)


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
                    };

                    transformX = _.offH;
                    transformY = _.offV;

                    //x COORDINATE value
                    switch ( args.yAlign+' '+ ((args.xLabel == '') ? 'empty' : 'has') ){
                        case 'left has':
                            _.transformX = (_.offH * shift.more);
                            break;
                        case 'right has':
                            _.transformX = (_.offH * shift.less);
                            break;
                        default:
                            _.transformX = (_.offH);
                    }


                    //y COORDINATE value
                    switch ( args.xAlign+' '+ ((args.yLabel == '') ? 'empty' : 'has') ){
                        case 'top has':
                            _.transformX = (_.offV * shift.more);
                            break;
                        case 'bottom has':
                            _.transformX = (_.offV * shift.less);
                            break;
                        default:
                            _.transformX = (_.offV);
                    }





                    // switch ( args.yAlign+' '+args.xAlign ){
                    //     case 'left'+' '+'top':
                    //         _.containerTransform = (_.offH * shift.more)+','+(_.offV * shift.more);
                    //         break;
                    //     case 'right'+' '+'top':
                    //         _.containerTransform = (_.offH * shift.less)+','+(_.offV * shift.more);
                    //         break;
                    //     case 'right'+' '+'bottom':
                    //         _.containerTransform = (_.offH * shift.less)+','+ (_.offV * shift.less);
                    //         break;
                    //     default:
                    //         _.containerTransform = (_.offH * shift.more) +','+ (_.offV * shift.less);
                    // }
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
                    _['range_'+coordinate] = getRange(args[dimensionAttribute(coordinate)],coordinate),

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
            _.dom_x = getDomain(
                'x',
                dat
            );
            _.the_x.domain(_.dom_x);
            args.xTicks && _.rule_x.transition(_.duration).call( _.axis_x)
                .attr('font-family','inherit');


            // ok do the thing now
            _.dom_y = getDomain(
                'y',
                dat
            );
            _.the_y.domain(_.dom_y);
            args.yTicks && _.rule_y.transition(_.duration).call( _.axis_y)
                .attr('font-family','inherit');


            //select
            _.graph = _.container.insert('g',':first-child')
                .attr('class', prefix + 'graph');

            _.blob = _.graph.selectAll(_.graphItem)
                .data(dat,function(dis){
                    return dis[args.dataKey[args.xData]]
                });

                
            console.log('x');
            console.log('domain',_.dom_x);
            console.log('range',_.range_x);

            console.log('----------------');

            console.log('y');
            console.log('domain',_.dom_y);
            console.log('range',_.range_y);


            if(args.type == 'line'){

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
                        .attr('class', prefix + 'item-text' + ( (!args.dataOneIsNum) ? ' '+ prefix +'item-data-one-not-num' : '') )
                        .attr('transform',function(dis,i){
                            return 'translate('+getBlobTextOrigin('x',dis,i)+','+getBlobTextOrigin('y',dis,i)+')'
                        })
                        .text('butthole');

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
                                            return dis[args.dataKey[ args[coordinate+'Data'] ]];
                                        })
                                        .attr('x',function(dis,i){
                                            return getBlobTextShift('x',coordinate,dis,i)
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
            
            case 'json' || 'geojson':
                d3.json(args.srcPath).then(function(data){
                    renderData(selector,data,_);
                });
                break;
            //probably embeded
            default:
                if(args.srcPath.getHash()){

                    jsonSelector = dataContainer.querySelector('script[type="application/json"').innerHTML;
                    if(jsonSelector.isValidJSONString()){

                        var dataAsJSON = JSON.parse(jsonSelector);
                    
                        renderData(selector,dataAsJSON,_);
                    }else{
                        console.error('The data source is not a supported format. Please make sure data is linked either as a json,csv, tsv or direct input in the fields')
                    }
                }
        }
        
        
        
    }

    

    _1p21.dataVisualizer = dataVisualizer;

    window._1p21 = _1p21;
}(window,d3));