(function(window,d3){
    var _1p21 = _1p21 || {};


    

    _1p21.renderData = function(id,args){
        console.log(id);

        //default parametes
        var defs  = {
            width: 600,
            height:600,
            margin: 20,
            marginOffset: 3,
            name: '',
            value: '',
            x: {

            },
            y: {

            }
        };

        var set = defs;

        for (var prop in args) {
            if (args.hasOwnProperty(prop)) {
                // Push each value from `obj` into `extended`
                set[prop] = args[prop];
            }
        }

        var canvas = d3.select(id +' .data-visualizer-wrapper');

        dimensionString = '0 0 '+ (set.width + (set.margin * set.marginOffset)) +' ' + (set.height + (set.margin * set.marginOffset));



        var svg = canvas.append('svg')
            .attr('viewBox',dimensionString)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .style('style','enable-background','new '+dimensionString)
            .attr('width','100%')
            .attr('height','100%');
    }

    window._1p21 = _1p21;
}(window,d3));