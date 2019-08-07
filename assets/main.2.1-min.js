!function(t,g){var a=a||{};String.prototype.getFileExtension=function(){return this.split(".").pop()},String.prototype.getHash=function(){var t=0,a,e;if(0===this.length)return t;for(a=0;a<this.length;a++)t=(t<<5)-t+(e=this.charCodeAt(a)),t|=0;return t},String.prototype.isValidJSONString=function(){try{JSON.parse(this)}catch(t){return!1}return!0},dataVisualizer=function(a,t){dataContainer=document.querySelector(a);var r={},e,o={width:600,height:400,margin:20,marginOffset:3,duration:100,type:"bar",dataKey:[0,1],dataOneIsNum:!1,xData:0,xAlign:"bottom",xTicks:!1,xLabel:"",xTicksAmount:5,xTicksFormat:"",xMin:null,xMax:null,yData:0,yAlign:"left",yTicks:!1,yLabel:"",yTicksAmount:5,yTickFormat:"",yMin:null,yMax:null,colors:[],colorsData:"",areaKey:"",srcType:"",srcPath:"",srcKey:null};for(var n in t)t.hasOwnProperty(n)&&(o[n]=t[n]);var i=function(t,a){var e;return e=0!=t||o.dataOneIsNum?g.scaleLinear().range(a):g.scaleBand().range(a).paddingInner(.1).paddingOuter(.1),o.type,e},s=function(t,a){var e="x"==a?"y":"x",r=[];return r="top"==o[e+"Align"]||"left"==o[e+"Align"]?[0,t]:[t,0]},c=function(a,t,e){if(t=t.toLowerCase(),0!=a||o.dataOneIsNum){var r=[],n,i;return o.hasOwnProperty(t+"Min")?n=o[t+"Min"]:(n=g.min(e,function(t){return t[o.dataKey[a]]}),console.log(o[t+"Min"])),r=[n,i=o.hasOwnProperty(t+"Max")?o[t+"Max"]:g.max(e,function(t){return t[o.dataKey[a]]})]}return e.map(function(t){return t[o.dataKey[a]]})},l=function(e,r){return e=e||[],(r=r.filter(function(t){return""!==t})).forEach(function(t,a){e.hasOwnProperty(r[a])&&(e=e[r[a]])}),e},u=function(t,a){var e;switch(a){case"top":e=g.axisTop(r[t]);break;case"bottom":e=g.axisBottom(r[t]);break;case"left":e=g.axisLeft(r[t]);break;case"right":e=g.axisRight(r[t])}return o[t+"Ticks"]&&(o[t+"TicksFormat"]&&e.tickFormat(o[t+"TicksFormat"]),o[t+"TicksAmount"]&&e.ticks(o[t+"TicksAmount"])),e},d=function(t){var a=r.rule.append("g").attr("class","data-visualizer-axis-x"),e="0,0";switch([t,o[t+"Align"]]){case["x","bottom"]:e="0,"+o.height;break;case["y","right"]:e=o.width+",0"}return a.attr("transform","translate("+e+")"),a},h=function(t,a,e){var r=a;switch(e.duration=g.transition().duration(o.duration),o.type){case"bar":e.graphItem="rect";break;case"scatter":e.graphItem="circle"}switch(o.srcKey&&(r=l(a,o.srcKey)),r.forEach(function(t){t.hasOwnProperty(o.dataKey[o.yData])&&(t[o.dataKey[o.yData]]=+t[o.dataKey[o.yData]]),o.dataOneIsNum&&t.hasOwnProperty(o.dataKey[o.xData])&&(t[o.dataKey[o.xData]]=+t[o.dataKey[o.xData]])}),e.canvas=g.select(t).append("div").attr("class","data-visualizer-wrapper"),e.offH=o.margin*o.marginOffset,e.offV=o.margin*(1.5*o.marginOffset),e.outerWidth=o.width+e.offH,e.outerHeight=o.height+e.offV,e.dimensionString="0 0 "+e.outerWidth+" "+e.outerHeight,e.svg=e.canvas.append("svg").attr("id",t+"-svg").attr("class","data-visualizer-svg").attr("viewBox",e.dimensionString).attr("preserveAspectRatio","xMinYMin meet").style("style","enable-background","new "+e.dimensionString).attr("width",e.outerWidth).attr("height",e.outerHeight),e.container=e.svg.append("g"),e.containerTransform=null,[o.xAlign,o.yAlign]){case["top","left"]:e.containerTransform=e.offH+","+e.offV;break;case["top","right"]:e.containerTransform="0,"+e.offV;break;case["bottom","right"]:e.containerTransform="0,0";break;default:e.containerTransform=e.offH+",0"}e.container.attr("transform","translate("+e.containerTransform+")"),e.labels=e.container.append("g").attr("class","data-visualizer-labels"),"pie"==o.type||(e.range_x=s(o.width,"x"),e.range_y=s(o.height,"y"),e.x_the=i(o.xData,o.dataOneIsNum,e.range_x),e.y=i(o.yData,o.dataOneIsNum,e.range_y),(o.xTicks||o.yTicks)&&(e.labX=e.labels.append("text").attr("class","data-visualizer-label-x").attr("y",o.height-o.margin).attr("x",o.width/2).attr("font-size","1em").attr("text-anchor","middle").text(o.xLabel||o.dataKey[o.xData]||""),e.labY=e.labels.append("text").attr("class","data-visualizer-label-y").attr("y",-40).attr("x",-o.height/2).attr("font-size","1em").attr("text-anchor","middle").attr("transform","rotate(-90)").text(o.yLabel||o.dataKey[o.yData]||""),e.axisX=u("x",o.xAlign),e.axisY=u("y",o.yAlign),e.rule=e.container.append("g").attr("class","data-visualizer-axis"),o.xTicks&&(e.ruleX=d("x")),o.yTicks&&(e.ruleY=d("y")))),f(r,e)},f=function(t,e){console.log(e),console.log(o),e.domX=c(o.xData,"x",t),e.domY=c(o.yData,"y",t),console.log("X:\n","Domain: ",e.domX,"\n ","Rang:",e.range_x),console.log("Y:\n","Domain: ",e.domY,"\n ","Rang:",e.range_y),e.x_the.domain(e.domX),e.y.domain(e.domY),(o.xTicks||o.yTicks)&&(e.ruleX.transition(e.duration).call(e.axisX),e.ruleY.transition(e.duration).call(e.axisY)),e.bitches=e.container.selectAll(e.graphItem).data(t,function(t){return t[o.dataKey[o.xData]]}),"bar"==o.type&&(e.bitches.exit().transition(e.duration).attr("height",0).attr("fill-opacity",0).remove(),e.bitches.enter().append(e.graphItem).attr("width",function(t,a){return e.x_the.bandwidth()}).attr("x",function(t,a){return e.x_the(t[o.dataKey[o.xData]])}).attr("y",function(t,a){return e.y(t[o.dataKey[o.yData]])}))};switch(o.srcPath.getFileExtension()){case"csv":g.csv(o.srcPath).then(function(t){h(a,t,r)});break;case"tsv":g.tsv(o.srcPath).then(function(t){h(a,t,r)});break;case"json":g.json(o.srcPath).then(function(t){h(a,t,r)});break;default:if(o.srcPath.getHash())if(jsonSelector=dataContainer.querySelector('script[type="application/json"').innerHTML,jsonSelector.isValidJSONString()){var y=JSON.parse(jsonSelector);h(a,y,r)}else console.error("The data source is not a supported format. Please make sure data is linked either as a json,csv, tsv or direct input in the fields")}},a.dataVisualizer=dataVisualizer,t._1p21=a}(window,d3);