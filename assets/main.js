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

        //stor variables initiated after sucessful data call + parameter declaration
        var dv = {};

        //default params
        var defaults  = {
            width: 600,
            height:400,
            margin: 20,
            marginOffset: 3,
            dataOneIsNum: false,
            type: 'bar',
            dataKey: [
                0, //data 1 / name
                1 //data 2 / value
            ],
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
            colorData: [],
    
            //area? in case scatter plot
    
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
        var setScale = function(dataKeyI,dataOneIsNum,range){
            var axis;
            if(dataKeyI == 0 && !dataOneIsNum) {
                axis = d3.scaleBand() //scales shit to dimensios
                    .range(range); // scaled data from available space
            }else{
                axis = d3.scaleLinear()
                .range(range);
            }

            return axis;

        };

        var setRange = function(dimension,whenMaxIsTheDimension){

            var range = [];
            if(whenMaxIsTheDimension) {
                range = [0,dimension]
            }else{
                range = [dimension,0]
            }
            return range;
        }

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

        var setDomain = function(dataKeyI,axisString,dat){

            axisString = axisString.toLowerCase();
            
            if(dataKeyI == 0 && !args.dataOneIsNum) {

                return dat.map(function(dis){
                    return dis[args.dataKey[dataKeyI]];
                });
            }else{
                var domain = [],
                min,
                max;

                if(args[axisString + 'Min']){
                    min = args[axisString + 'Min']
                }else{
                    min = d3.max(dat,function(dis){
                        return dis[args.dataKey[dataKeyI]];
                    });
                }


                if(args[axisString + 'Max']){
                    max = args[axisString + 'Max']
                }else{
                    max = d3.max(dat,function(dis){
                        return dis[args.dataKey[dataKeyI]];
                    });
                }

                domain = [min,max];

                return domain;
                
            }
        };

        var setAxis = function(axisString) {
            
        }


        //render a good boi
        var renderData = function(selector,data,dv){
            // heck if src key exists
            var parsedData = data;

            if (args.srcKey) {

                parsedData = getData(data,args.srcKey);

            }

            // console.log(parsedData);

            //canvas
                dv.canvas = d3.select(selector)
                    .append('div')
                    .attr('class','data-visualizer-wrapper'),

                    dv.offH = args.margin * args.marginOffset,
                    dv.offV = args.margin * (args.marginOffset * 1.5),
                    dv.outerWidth = args.width + dv.offH,
                    dv.outerHeight = args.height + dv.offV


                dv.dimensionString = '0 0 '+ dv.outerWidth +' ' + dv.outerHeight;



                dv.svg = dv.canvas.append('svg')
                    .attr('id',selector+'-svg')
                    .attr('class','data-visualizer-svg')
                    .attr('viewBox',dv.dimensionString)
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .style('style','enable-background','new '+dv.dimensionString)
                    .attr('width',dv.outerWidth)
                    .attr('height',dv.outerHeight);

                    
                dv.container = dv.svg.append('g');
                dv.containerTransform = null;
                    switch ([args.xAlign,args.yAlign]){
                        case ['top','left']:
                            dv.containerTransform = dv.offH+','+dv.offV;
                            break;
                        case ['top','right']:
                            dv.containerTransform = '0,'+dv.offV;
                            break;
                        case ['bottom','right']:
                            dv.containerTransform = '0,0';
                            break;
                        default:
                            dv.containerTransform = dv.offH +',0'
                    }
                dv.container.attr('transform','translate('+ dv.containerTransform +')');

            // legends and shit
            dv.labels = dv.container.append('g')
                .attr('class','data-visualizer-labels');
            if(args.type == 'pie'){

            }else{

                // scale
                dv.rangeX = setRange(args.width,args.xAlign == 'left'),
                dv.rangeY =  setRange(args.height,args.yAlign == 'top');

                dv.x = setScale(args.xData,args.dataOneIsNum,dv.rangeX)
                        .paddingInner(.1) //spacing between
                        .paddingOuter(.1); //spacing of first and last item from canvas

                dv.y = setScale(args.xData,args.dataOneIsNum,dv.rangeY)
                    .paddingInner(.1) //spacing between
                    .paddingOuter(.1); //spacing of first and last item from canvas

                if(args.xTicks || args.yTicks) {

                    // x label
                        dv.labX = dv.labels.append('text')
                        
                        .attr('class','data-visualizer-label-x')
                        .attr('y', args.height - args.margin)
                        .attr('x', args.width / 2)
                        .attr('font-size', '1em')
                        .attr('text-anchor', 'middle')
                        .text(args.xLabel || args.dataKey[args.xData] || '');

                    // Y Label
                        dv.labY = dv.labels.append('text')
                            .attr('class','data-visualizer-label-y')
                            .attr('y', -40)
                            .attr('x', -(args.height / 2))
                            .attr('font-size', '1em')
                            .attr('text-anchor', 'middle')
                            .attr('transform', 'rotate(-90)')
                            .text(args.yLabel || args.dataKey[args.yData] || '');
                }

                dv.rule = dv.container.append('g')
                    .attr('class','data-visualizer-axis');

                args.xTicks && (
                    dv.ruleX = dv.rule.append('g')
                        .attr('class','data-visualizer-axis-x')
                );
                
                args.yTicks && (
                    dv.ruleY = dv.rule.append('g')
                        .attr('class','data-visualizer-axis-y')
                );



                } 

            update(parsedData,dv)

        }
                



        // tick inits
        var update = function(dat,dv) {
            // console.log(dv);

            // // ok do the thing now
            // dv.x.domain(setDomain(
            //     args.xData,
            //     'x',
            //     dat
            // ));

            // dv.y.domain(setDomain(
            //     args.yData,
            //     'y',
            //     dat
            // ));
            

                




        }


        switch(args.srcPath.getFileExtension()) {
            case 'csv':
                d3.csv(args.srcPath).then(function(data){
                    renderData(selector,data,dv);
                });
                break;
            case 'tsv':
                d3.tsv(args.srcPath).then(function(data){
                    renderData(selector,data,dv);
                });
                break;
            
            case 'json':
                d3.json(args.srcPath).then(function(data){
                    renderData(selector,data,dv);
                });
                break;
            //probably embeded
            default:
                if(args.srcPath.getHash()){

                    jsonSelector = dataContainer.querySelector('script[type="application/json"').innerHTML;
                    if(jsonSelector.isValidJSONString()){

                        var parsedData = JSON.parse(jsonSelector);
                    
                        renderData(selector,parsedData,dv);
                    }else{
                        console.error('The data source is not a supported format. Please make sure data is linked either as a json,csv, tsv or direct input in the fields')
                    }
                }
        }
        
        
        
    }

    

    _1p21.dataVisualizer = dataVisualizer;

    window._1p21 = _1p21;
}(window,d3));