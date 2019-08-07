(function(window,d3){
    var _1p21 = _1p21 || {};

    //default parameters
    

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
    dataVisualizer = function(selector,arr){
        dataContainer = document.querySelector(selector);

        //stor variables initiated after sucessful data call + parameter declaration set as something_x so its easier to tell apart which shit is set by hooman and which one javascript sets up for hooman
        var _ = {};

        //default params
        var defaults  = {
            width: 600,
            height:400,
            margin: 20,
            marginOffset: 3,
            duration: 100,
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
            xLabel: '',
            xTicksAmount: 5,
            xTicksFormat: '',
            xMin: null,
            xMax: null,
    
            //y settings
            yData: 0,
            yAlign: 'left',
            yTicks: false,
            yLabel: '',
            yTicksAmount: 5,
            yTickFormat: '',
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




        // x = setScale(args.xData,args.dataOneIsNum,range);
        // args.xData,_.range_x
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

        //what the fucking fuk
        var setRange = function(dimension,axisString){

            var oppositeAxisString = (axisString == 'x') ? 'y' : 'x';

            var range = [];
            if(args[oppositeAxisString+'Align'] == 'top' || args[oppositeAxisString+'Align'] == 'left') {
                range = [0,dimension]
            }else{
                range = [dimension,0]
            }
            return range;
        }
        
        var setDomain = function(axisString,dat){

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

                if(args.hasOwnProperty(axisString + 'Min')){
                    min = args[axisString + 'Min'];

                }else{
                    min = d3.min(dat,function(dis){
                        return dis[ args.dataKey[ dataKeyI ] ];
                    });
                    console.log(args[axisString + 'Min']);
                }



                if(args.hasOwnProperty(axisString + 'Max')){
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

        

        var setAxis = function(axisString) {
            var axis;
            switch(args[axisString+'Align']) {
                case 'top':
                    axis = d3.axisTop(_[axisString]);
                    break;
                case 'bottom':
                    axis = d3.axisBottom(_[axisString]);
                    break;
                case 'left':
                    axis = d3.axisLeft(_[axisString]);
                    break;
                case 'right':
                    axis = d3.axisRight(_[axisString]);
                    break;
            }



            if(args.hasOwnProperty(axisString +'Ticks')){
                args.hasOwnProperty(axisString +'TicksFormat') && axis.tickFormat( args[axisString +'TicksFormat'] );
                args.hasOwnProperty(axisString +'TicksAmount') && axis.ticks( args[axisString +'TicksAmount'] );
            }


            return axis;
            
        }

        var setRuleContainer = function(axisString,containerObj){
            var rule = containerObj.append('g')
                .attr('class','data-visualizer-axis-'+axisString+' data-visualizer-axis-align-'+args[axisString+'Align']);

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

        var renderAxis = function(axisString,containerObj) {
            if(args[axisString+'Ticks']) {

                // x label
                    _['lab_'+axisString] = _.labels.append('text')
                        .attr('class','data-visualizer-label-'+axisString)
                        .attr('y', function(){
                            return (axisString == 'x') ? args.height - args.margin : -40;
                        })
                        .attr('x', function(){
                            return (axisString == 'x') ? args.width / 2 : -(args.height / 2);
                        })
                        .attr('font-size', '1em')
                        .attr('text-anchor', 'middle')
                        .text(args[axisString+'Label'] || args.dataKey[ args[axisString+'Data'] ] || '');


                    if(axisString == 'y') {
                        _['lab_'+axisString].attr('transform', 'rotate(-90)');
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


            //have ass parse dem numeric data bois
            retrievedData.forEach(function(dis){
                if(dis.hasOwnProperty(args.dataKey[args.yData])){
                    dis[args.dataKey[args.yData]] = +dis[args.dataKey[args.yData]];
                }

                if(args.dataOneIsNum) {
                    if(dis.hasOwnProperty(args.dataKey[args.xData])){
                        dis[args.dataKey[args.xData]] = +dis[args.dataKey[args.xData]];
                    }
                }
            })
            // console.log(retrievedData);

            //canvas
                _.canvas = d3.select(selector)
                    .append('div')
                    .attr('class','data-visualizer-wrapper'),

                    _.offH = args.margin * args.marginOffset,
                    _.offV = args.margin * (args.marginOffset * 1.5),
                    _.outerWidth = args.width + _.offH,
                    _.outerHeight = args.height + _.offV


                _.dimensionString = '0 0 '+ _.outerWidth +' ' + _.outerHeight;



                _.svg = _.canvas.append('svg')
                    .attr('id',selector+'-svg')
                    .attr('class','data-visualizer-svg')
                    .attr('viewBox',_.dimensionString)
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .style('style','enable-background','new '+_.dimensionString)
                    .attr('width',_.outerWidth)
                    .attr('height',_.outerHeight);

                    
                _.container = _.svg.append('g');
                _.containerTransform = null;
                    switch ( args.xAlign+' '+args.yAlign ){
                        case 'top'+' '+'left':
                            _.containerTransform = _.offH+','+_.offV;
                            break;
                        case 'top'+' '+'right':
                            _.containerTransform = '0,'+_.offV;
                            break;
                        case 'bottom'+' '+'right':
                            _.containerTransform = '0,0';
                            break;
                        default:
                            _.containerTransform = _.offH +',0'
                    }
                _.container.attr('transform','translate('+ _.containerTransform +')');



            if(args.type == 'pie'){

            }else{
                // legends and shit
                _.labels = _.container.append('g')
                    .attr('class','data-visualizer-labels');
    
                _.rule = _.container.append('g')
                    .attr('class','data-visualizer-axis');

                // scale
                _.range_x = setRange(args.width,'x'),
                _.range_y =  setRange(args.height,'y');

                //vars
                _._x = setScale('x');
                _.y = setScale('y');


                renderAxis('x',_.rule);
                renderAxis('y',_.rule);



            } 

            update(retrievedData,_)

        }
                



        // tick inits
        var update = function(dat,_) {
            // ok do the thing now
            // _.dom_x = setDomain(
            //     'x',
            //     dat
            // );
            // _._x.domain(_.dom_x);
            // args.xTicks && _.rule_x.transition(_.duration).call( _.axis_x);

            // _.rule_x.call( _.axis_x);


            // ok do the thing now
            _.dom_y = setDomain(
                'y',
                dat
            );
            _.y.domain(_.dom_y);


            
            args.yTicks && _.rule_y.transition(_.duration).call( _.axis_y);


            //select
            _.bitches = _.container.selectAll(_.graphItem)
                .data(dat,function(dis){
                    return dis[args.dataKey[args.xData]]
                });

            // delete unqualified bois


            if(args.type == 'bar'){
                _.bitches.exit()
                    .transition(_.duration)
                    .attr('height',0)
                    .attr('fill-opacity',0)
                    .remove();

                _.bitches
                    .enter()
                    .append(_.graphItem)
                    // .attr('width',function(dis,i){
                        
                    //     return _._x.bandwidth()
                    // }) // calculated width
                    // .attr('height',function(dis,i){
                        
                    //     return args.height + _.y(dis[args.dataKey[args.yData]])
                    // })

                    // .attr('x',function(dis,i){
                    //     return _._x(dis[args.dataKey[args.xData]])
                    // })

                    // .attr('y',function(dis,i){
                    //     return _.y(dis[args.dataKey[args.yData]])
                    // });
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