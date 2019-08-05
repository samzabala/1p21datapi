(function(window,d3){
    var _1p21 = _1p21 || {};

    //default parameters
    
    //render a good boi
    renderData = function(selector,set,data){

        


        //canvas
            var canvas = d3.select(selector)
                .append('div')
                .attr('class','data-visualizer-wrapper'),

                offH = set.margin * set.marginOffset,
                offV = set.margin * (set.marginOffset * 2),
                outerWidth = ,
                outerHeight = 


            dimensionString = '0 0 '+ (set.width + (set.margin * set.marginOffset)) +' ' + (set.height + (set.margin * set.marginOffset));



            var svg = canvas.append('svg')
            .attr('id',selector+'-svg')
                .attr('viewBox',dimensionString)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .style('style','enable-background','new '+dimensionString)
                .attr('width',set.width)
                .attr('height',set.height);

            var container = svg.append('g'),
                containerTransform;
                switch ([set.xAlign,set.yAlign]){
                    case ['top','left']:
                        containerTransform = offH+','+offV;
                        break;
                    case ['top','right']:
                        containerTransform = '0,'+offV;
                        break;
                    case ['bottom','right']:
                        containerTransform = '0,0';
                        break;
                    default:
                        containerTransform = offH +',0'
                }
            container.attr('transform','translate('+containerTransform+')');


        //labels
        xLab = container.append('text')
                .attr('y', set.height - set.margin)
                .attr('x', set.width / 2)
                .attr('font-size', '18px')
                .attr('text-anchor', 'middle')
                .text(set.xLabel || set.Data || '');


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

    String.prototype.IsValidJSONString = function() {
        try {
            JSON.parse(this);
        } catch (e) {
            return false;
        }
        return true;
    }

    
    //initial function
    dataVisualizer = function(selector,args){
        dataContainer = document.querySelector(selector);
        var defs  = {
            width: 600,
            height:600,
            margin: 20,
            marginOffset: 3,
            type: 'bar',
            dataKey: [
                0, //data 1 / name
                1 //data 2 / value
            ],
            //x settings
            xData: 0,
            xLabel: '',
            xAlign: 'bottom',
            xTicks: 5,
            xTickFormat: '',
    
            //y settings
            yData: 0,
            yLabel: '',
            yAlign: 'right',
            yTicks: 5,
            yTickFormat: '',
    
            //kulay
            colors : [],
            colorData: [],
    
            //area? in case scatter plot
    
            //src
            srcType: '',
            srcPath: '',
            srcKey: '',
        };

        //merge defaults with custom
        var set = defs;
        for (var prop in args) {
            if (args.hasOwnProperty(prop)) {
                // Push each value from `obj` into `extended`
                set[prop] = args[prop];
            }
        }


        switch(set.srcPath.getFileExtension()) {
            case 'csv':
                d3.csv(set.srcPath).then(function(data){
                    renderData(selector,set,data);
                });
                break;
            case 'tsv':
                d3.tsv(set.srcPath).then(function(data){
                    renderData(selector,set,data);
                });
                break;
            
            case 'json':
                d3.json(set.srcPath).then(function(data){
                    renderData(selector,set,data);
                });
                break;
            //probably embeded
            default:
                if(set.srcPath.getHash()){

                    jsonSelector = dataContainer.querySelector('script[type="application/json"').innerHTML;
                    if(jsonSelector.IsValidJSONString()){

                        var parsedData = JSON.parse(jsonSelector);
                    
                        renderData(selector,set,parsedData);
                    }else{
                        console.error('The data source is not a supported format. Please make sure data is linked either as a json,csv, tsv or direct input in the fields')
                    }
                }
        }
        
        
        
    }

    _1p21.dataVisualizer = dataVisualizer;

    window._1p21 = _1p21;
}(window,d3));