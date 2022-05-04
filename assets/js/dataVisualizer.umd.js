(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.dataVisualizer = factory());
})(this, (function () { 'use strict';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var id = 0;

  function _classPrivateFieldLooseKey(name) {
    return "__private_" + id++ + "_" + name;
  }

  function _classPrivateFieldLooseBase(receiver, privateKey) {
    if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
      throw new TypeError("attempted to use private field on non-instance");
    }

    return receiver;
  }

  var Component = /*#__PURE__*/function () {
    function Component(dv, props) {
      if (!dv) {
        return;
      }

      this.dv = dv;

      if (typeof props === 'object') {
        for (var key in props) {
          this[key] = props[key];
        }
      }
    }

    var _proto = Component.prototype;

    _proto.dispose = function dispose() {
      this.dv = null;
    };

    return Component;
  }();

  //sana 2d lang
  var Coordinates = ['x', 'y']; //kwan has scales domains and shit

  var DatumKeys = [0, 1, 'color', 'area'];
  var CoordDatumKeys = [0, 1];
  /*****************************************************************************
   *DATA HELPEE
   *****************************************************************************/
  // kinkily get data but with aility to get down deep because we never know where the fuck the date will be at
  // @param obj : duh
  // @param keystring : hooman provided object key string that is hopefully correct
  // @param isNum : if the data is a number
  //kinkily merge defaults with custom

  var DeepValidate = function DeepValidate(defaults, arr) {
    var args = defaults;
    Object.keys(arr).forEach(function (prop, i) {
      //ha?
      if (prop == 'key' || prop == 'reverse') {
        // if(Object.prototype.toString.call(arr[prop]) == '[object Object]'){
        args[prop] = DeepValidate(args[prop], arr[prop]);
      } else if (arr.hasOwnProperty.call(arr, prop)) {
        // Push each value from `obj` into `extended`
        args[prop] = arr[prop];
      }
    });
    return args;
  }; //get the length attribute to associate with the axis bro

  var ToSide = function ToSide(axisName, opposite) {
    return opposite ? axisName == 'x' ? 'height' : 'width' : axisName == 'x' ? 'width' : 'height';
  };
  var ToOppoAxis = function ToOppoAxis(axisName) {
    return axisName == 'x' ? 'y' : 'x';
  }; //d3 does not support ie 11. kill it

  var VaildateBrowser = function VaildateBrowser() {
    var ua = navigator.userAgent;
    return ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
  }; //string helpers

  var Str = {
    // duh
    fileExtension: function fileExtension(str) {
      return str.split('.').pop();
    },
    // convert boi to
    hash: function hash(str) {
      var url = str;
      var type = url.split('#');
      var hash = type[type.length - 1] || '';
      return hash;
    },
    // is dis json enough for u?
    isValidJSONString: function isValidJSONString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }

      return true;
    },
    //kemel
    toCamelCase: function toCamelCase(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\s+/g, '').replace('-', '');
    },
    //duh
    toCapitalize: function toCapitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };
  var ColorIsDark = function ColorIsDark(hexString) {
    // Variables for red, green, blue values
    var r, g, b, hsp; // Check the format of the hexString, HEX or RGB?

    if (hexString.match(/^rgb/)) {
      // If HEX --> store the red, green, blue values in separate variables
      hexString = hexString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      r = hexString[1];
      g = hexString[2];
      b = hexString[3];
    } else {
      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      hexString = +('0x' + hexString.slice(1).replace(hexString.length < 5 && /./g, '$&$&'));
      r = hexString >> 16;
      g = hexString >> 8 & 255;
      b = hexString & 255;
    } // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html


    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)); // Using the HSP value, determine whether the hexString is light or dark

    if (hsp > 170) {
      //127.5
      return false;
    } else {
      return true;
    }
  };
  var ValidMargin = function ValidMargin(variable) {
    if (typeof variable === 'number') {
      return variable;
    }
  };
  var GetNearest = function GetNearest(num) {
    if (num > 10) {
      return Math.pow(10, num.toString().length - 1) * 10;
    } else {
      return 1;
    }
  };
  var PlaceholderColors = ['#0480FE', '#F204A2', '#894EC7', '#00b754', '#fd7f03', '#fd0303', '#0037B4', '#5E01A8', '#FE85D6', '#FFF200', '#D7C368', '#0480FE', '#A168D9', '#FD7F03', '#16B900', '#01C6AB', '#FB1818', '#006943', '#F7BC00', '#B6E4B6', '#FEC87C', '#E18256', '#313F76', '#547B80', '#8F4139', '#ECC65F', '#D069A9', '#008EB0', '#5F6046', '#C26558', '#B00B69', '#042069', '#B00B1E', '#30261C', '#403831', '#36544F', '#1F5F61', '#0B8185', '#59B390', '#F0DDAA', '#E47C5D', '#E32D40', '#152B3C', '#E94E77', '#D68189', '#C6A49A', '#C6E5D9', '#F4EAD5', '#4B1139', '#3B4058', '#2A6E78', '#7A907C', '#C9B180', '#027B7F', '#FFA588', '#D62957', '#BF1E62', '#572E4F', '#A1DBB2', '#FEE5AD', '#FACA66', '#F7A541', '#F45D4C', '#59B390', '#F0DDAA', '#E47C5D', '#E32D40', '#152B3C', '#A69E80', '#E0BA9B', '#E7A97E', '#D28574', '#3B1922', '#2B222C', '#5E4352', '#965D62', '#C7956D', '#F2D974', '#9DC9AC', '#FFFEC7', '#F56218', '#FF9D2E', '#919167', '#E6B39A', '#E6CBA5', '#EDE3B4', '#8B9E9B', '#6D7578', '#D1313D', '#E5625C', '#F9BF76', '#8EB2C5', '#615375', '#75616B', '#BFCFF7', '#DCE4F7', '#F8F3BF', '#D34017', '#5E412F', '#FCEBB6', '#78C0A8', '#F07818', '#F0A830', '#EFEECC', '#FE8B05', '#FE0557', '#400403', '#0AABBA', '#FE4365', '#FC9D9A', '#F9CDAD', '#C8C8A9', '#83AF9B', '#D3D5B0', '#B5CEA4', '#9DC19D', '#8C7C62', '#71443F', '#F38A8A', '#55443D', '#A0CAB5', '#CDE9CA', '#F1EDD0', '#8C2318', '#5E8C6A', '#88A65E', '#BFB35A', '#F2C45A', '#FBC599', '#CDBB93', '#9EAE8A', '#335650', '#F35F55', '#75616B', '#BFCFF7', '#DCE4F7', '#F8F3BF', '#D34017', '#360745', '#D61C59', '#E7D84B', '#EFEAC5', '#1B8798', '#261C21', '#6E1E62', '#B0254F', '#DE4126', '#EB9605', '#FCFEF5', '#E9FFE1', '#CDCFB7', '#D6E6C3', '#FAFBE3', '#046D8B', '#309292', '#2FB8AC', '#93A42A', '#ECBE13', '#C6CCA5', '#8AB8A8', '#6B9997', '#54787D', '#615145', '#E7EDEA', '#FFC52C', '#FB0C06', '#030D4F', '#CEECEF', '#4E395D', '#827085', '#8EBE94', '#CCFC8E', '#DC5B3E', '#9DC9AC', '#FFFEC7', '#F56218', '#FF9D2E', '#919167', '#607848', '#789048', '#C0D860', '#F0F0D8', '#604848', '#C75233', '#C78933', '#D6CEAA', '#79B5AC', '#5E2F46', '#EFF3CD', '#B2D5BA', '#61ADA0', '#248F8D', '#605063', '#FFFBB7', '#A6F6AF', '#66B6AB', '#5B7C8D', '#4F2958', '#B1E6D1', '#77B1A9', '#3D7B80', '#270A33', '#451A3E', '#395A4F', '#432330', '#853C43', '#F25C5E', '#FFA566', '#382F32', '#FFEAF2', '#FCD9E5', '#FBC5D8', '#F1396D', '#E9E0D1', '#91A398', '#33605A', '#070001', '#68462B', '#FF9900', '#424242', '#E9E9E9', '#BCBCBC', '#3299BB', '#230F2B', '#F21D41', '#EBEBBC', '#BCE3C5', '#82B3AE', '#2B2726', '#0A516D', '#018790', '#7DAD93', '#BACCA4', '#D1E751', '#FFFFFF', '#000000', '#4DBCE9', '#26ADE4', '#CFB590', '#9E9A41', '#758918', '#564334', '#49281F', '#EFD9B4', '#D6A692', '#A39081', '#4D6160', '#292522', '#5E3929', '#CD8C52', '#B7D1A3', '#DEE8BE', '#FCF7D3', '#BBBB88', '#CCC68D', '#EEDD99', '#EEC290', '#EEAA88', '#0CA5B0', '#4E3F30', '#FEFEEB', '#F8F4E4', '#A5B3AA', '#75616B', '#BFCFF7', '#DCE4F7', '#F8F3BF', '#D34017', '#B6D8C0', '#C8D9BF', '#DADABD', '#ECDBBC', '#FEDCBA', '#1B676B', '#519548', '#88C425', '#BEF202', '#EAFDE6', '#1C2130', '#028F76', '#B3E099', '#FFEAAD', '#D14334', '#CC5D4C', '#FFFEC6', '#C7D1AF', '#96B49C', '#5B5847', '#E7EDEA', '#FFC52C', '#FB0C06', '#030D4F', '#CEECEF', '#382F32', '#FFEAF2', '#FCD9E5', '#FBC5D8', '#F1396D', '#75616B', '#BFCFF7', '#DCE4F7', '#F8F3BF', '#D34017', '#595643', '#4E6B66', '#ED834E', '#EBCC6E', '#EBE1C5', '#4D3B3B', '#DE6262', '#FFB88C', '#FFD0B3', '#F5E0D3', '#6DA67A', '#99A66D', '#A9BD68', '#B5CC6A', '#C0DE5D', '#1C0113', '#6B0103', '#A30006', '#C21A01', '#F03C02', '#6DA67A', '#99A66D', '#A9BD68', '#B5CC6A', '#C0DE5D', '#A70267', '#F10C49', '#FB6B41', '#F6D86B', '#339194', '#311D39', '#67434F', '#9B8E7E', '#C3CCAF', '#A51A41', '#0CA5B0', '#4E3F30', '#FEFEEB', '#F8F4E4', '#A5B3AA', '#351330', '#424254', '#64908A', '#E8CAA4', '#CC2A41', '#7E5686', '#A5AAD9', '#E8F9A2', '#F8A13F', '#BA3C3D', '#E6B39A', '#E6CBA5', '#EDE3B4', '#8B9E9B', '#6D7578', '#041122', '#259073', '#7FDA89', '#C8E98E', '#E6F99D', '#EFFFCD', '#DCE9BE', '#555152', '#2E2633', '#99173C', '#8DCCAD', '#988864', '#FEA6A2', '#F9D6AC', '#FFE9AF', '#594F4F', '#547980', '#45ADA8', '#9DE0AD', '#E5FCC2', '#E8D5B7', '#0E2430', '#FC3A51', '#F5B349', '#E8D5B9', '#000000', '#9F111B', '#B11623', '#292C37', '#CCCCCC', '#B1E6D1', '#77B1A9', '#3D7B80', '#270A33', '#451A3E', '#452E3C', '#FF3D5A', '#FFB969', '#EAF27E', '#3B8C88', '#B7CBBF', '#8C886F', '#F9A799', '#F4BFAD', '#F5DABD', '#C1B398', '#605951', '#FBEEC2', '#61A6AB', '#ACCEC0', '#000000', '#9F111B', '#B11623', '#292C37', '#CCCCCC', '#0CA5B0', '#4E3F30', '#FEFEEB', '#F8F4E4', '#A5B3AA', '#322938', '#89A194', '#CFC89A', '#CC883A', '#A14016', '#00A8C6', '#40C0CB', '#F9F2E7', '#AEE239', '#8FBE00', '#FFF3DB', '#E7E4D5', '#D3C8B4', '#C84648', '#703E3B', '#F0D8A8', '#3D1C00', '#86B8B1', '#F2D694', '#FA2A00', '#B1E6D1', '#77B1A9', '#3D7B80', '#270A33', '#451A3E', '#774F38', '#E08E79', '#F1D4AF', '#ECE5CE', '#C5E0DC', '#5E3929', '#CD8C52', '#B7D1A3', '#DEE8BE', '#FCF7D3', '#594F4F', '#547980', '#45ADA8', '#9DE0AD', '#E5FCC2', '#A8E6CE', '#DCEDC2', '#FFD3B5', '#FFAAA6', '#FF8C94', '#9CDDC8', '#BFD8AD', '#DDD9AB', '#F7AF63', '#633D2E', '#AAFF00', '#FFAA00', '#FF00AA', '#AA00FF', '#00AAFF', '#6DA67A', '#77B885', '#86C28B', '#859987', '#4A4857', '#331327', '#991766', '#D90F5A', '#F34739', '#FF6E27', '#A3A948', '#EDB92E', '#F85931', '#CE1836', '#009989', '#B3CC57', '#ECF081', '#FFBE40', '#EF746F', '#AB3E5B', '#774F38', '#E08E79', '#F1D4AF', '#ECE5CE', '#C5E0DC', '#E8D5B7', '#0E2430', '#FC3A51', '#F5B349', '#E8D5B9', '#5E9FA3', '#DCD1B4', '#FAB87F', '#F87E7B', '#B05574', '#FDE6BD', '#A1C5AB', '#F4DD51', '#D11E48', '#632F53', '#85847E', '#AB6A6E', '#F7345B', '#353130', '#CBCFB4', '#FF003C', '#FF8A00', '#FABE28', '#88C100', '#00C176', '#331327', '#991766', '#D90F5A', '#F34739', '#FF6E27', '#1D1313', '#24B694', '#D22042', '#A3B808', '#30C4C9;'];

  var Axis = /*#__PURE__*/function (_Component) {
    _inheritsLoose(Axis, _Component);

    function Axis(dv, axisName) {
      return _Component.call(this, dv, {
        axisName: axisName
      }) || this;
    }

    var _proto = Axis.prototype;

    _proto.amount = function amount(isGrid) {
      var dv = this.dv;
      var axisName = this.axisName;

      if (isGrid && dv.args(axisName + "TicksAmount")) {
        return dv.args(axisName + "TicksAmount") * dv.args(axisName + "GridIncrement");
      } else {
        return dv.args(axisName + "TicksAmount");
      }
    };

    _proto.values = function values() {
      var dv = this.dv;
      var values = [],
          currVal = dv.domain(0)[0];

      do {
        values.push(currVal);
        currVal *= 10;
      } while (currVal <= dv.domain(1).values);

      return values;
    };

    _proto.getCall = function getCall(isGrid) {
      isGrid = isGrid || false;
      var dv = this.dv;
      var axisName = this.axisName;
      var d3AxisKey = 'Axis ' + dv.args(axisName + "Align");
      var toReturn = d3[Str.toCamelCase(d3AxisKey)](dv.scale(dv.args(this.axisName + "Data")));

      if (dv._is_base('scatter') && dv.args(axisName + "Data") == 0 && dv._name_is_num == true) {
        toReturn.tickValues(this.values());
      }

      if (dv._has_axis_prop('ticksAmount', axisName)) {
        toReturn.ticks(this.amount(isGrid));
      }

      if (isGrid) {
        toReturn.tickSize(dv.args(ToSide(axisName, true)) * -1).tickFormat('');
      } else {
        toReturn.tickFormat(function (dis, i) {
          return dv.format(dv.args(axisName + "Data"))(dis, i);
        });
      }

      return toReturn;
    };

    return Axis;
  }(Component);

  var OPTIMAL_PI_MULTIPLIER = 0.5;
  var OPTIMAL_PI_LEGENDARY_MULTIPLIER = 0.375;

  var Pi = /*#__PURE__*/function (_Component) {
    _inheritsLoose(Pi, _Component);

    function Pi(dv, dis, i) {
      return _Component.call(this, dv, {
        dis: dis,
        i: i
      }) || this;
    }

    var _proto = Pi.prototype;

    _proto.offset = function offset(coord) {
      var dv = this.dv;
      var offset = 0;

      if (dv.args('colorLegend') && coord == 'x') {
        offset = dv.args(ToSide(coord)) * OPTIMAL_PI_LEGENDARY_MULTIPLIER;
      } else {
        offset = dv.args(ToSide(coord)) * OPTIMAL_PI_MULTIPLIER;
      }

      return offset;
    };

    _proto.path = function path(calcWithInnerRadius, subMethod, offsetMultiplier, initial) {
      var disPi = this.dis.pie;

      if (!disPi) {
        return;
      } //@TODO ha??


      var dv = this.dv;
      offsetMultiplier = offsetMultiplier || 1;
      subMethod = subMethod || '';
      calcWithInnerRadius = calcWithInnerRadius || false;
      initial = initial || false;
      var innerRadius = calcWithInnerRadius ? this.radius * dv.args("piInRadius") : 0;
      var outerRadius = !initial || initial && offsetMultiplier <= 1 && calcWithInnerRadius == false ? this.radius * offsetMultiplier : 0;
      var arc = d3.arc().outerRadius(outerRadius).innerRadius(innerRadius);

      if (subMethod) {
        return arc[subMethod](disPi);
      } else {
        return arc(disPi);
      }
    };

    _createClass(Pi, [{
      key: "radius",
      get: function get() {
        var dv = this.dv;
        var value = Math.min(dv.args('width') * 0.5, dv.args('height') * 0.5);

        if (dv.args("colorLegend")) {
          value -= value * 0.25;
        }

        if (dv.args("piLabelStyle") == 'linked') {
          value -= value * 0.25;
        }

        return value;
      }
    }]);

    return Pi;
  }(Component);

  var Shape = /*#__PURE__*/function (_Component) {
    _inheritsLoose(Shape, _Component);

    function Shape(dv, dis, i) {
      return _Component.call(this, dv, {
        dis: dis,
        i: i
      }) || this;
    }

    Shape.tag = function tag(dv) {
      switch (dv.baseType) {
        case 'bar':
          return 'rect';

        case 'pie':
          return 'path';

        case 'line':
        case 'scatter':
          return 'circle';

        default:
          return false;
      }
    };

    Shape.coordAttr = function coordAttr(dv, axisName) {
      return dv._is_base(['line', 'scatter']) ? "c" + axisName : "" + axisName;
    };

    var _proto = Shape.prototype;

    _proto.radius = function radius(initial) {
      var dv = this.dv,
          dis = this.dis;
          this.i;
      initial = initial || false;
      var radius = initial ? 0 : dv._is_base('scatter') ? (dv.args('areaMin') + dv.args('areaMax')) / 2 : 5;

      if (!initial) {
        switch (dv.baseType) {
          case 'scatter':
            if (dv.args("key['area']")) {
              radius = dv.scale('area', dv._get(dis, dv.args("key['area']"), true));
            } else {
              dv.args('areaMin') + dv.args('areaMax');
            }

            break;

          case 'line':
            radius = dv.args('linePointsSize');
            break;
        }
      }

      return radius;
    };

    _proto.scaledValue = function scaledValue(keyKey) {
      var dv = this.dv,
          dis = this.dis;
      var dataToScale, toReturn;

      if (dv._name_is_num == true && keyKey == 1) {
        dataToScale = dv._get(dis, dv.args("key['" + keyKey + "']"), true);
      } else {
        dataToScale = dv._get(dis, dv.args("key['" + keyKey + "']"), false);
      }

      toReturn = dv.scale(keyKey, dataToScale);
      return toReturn;
    };

    _proto.stroke = function stroke() {
      var toReturn = 0;

      switch (this.dv.baseType) {
        case 'scatter':
          toReturn = 1;
          break;
      }

      return toReturn;
    };

    _proto.opacity = function opacity(initial) {
      this.dv;
          this.dis;
          this.i;
      var toReturn = 1;

      switch (this.dv.baseType) {
        case 'line':
          if (initial) toReturn = 0;
          break;
      }

      return toReturn;
    };

    _proto.areaOpacity = function areaOpacity(initial) {
      var dv = this.dv;
          this.dis;
          this.i;
      var toReturn = 1;

      switch (this.dv.baseType) {
        case 'scatter':
          toReturn = dv.args("areaOpacity");
          break;
      }

      return toReturn;
    };

    _proto.palette = function palette() {
      var dv = this.dv,
          dis = this.dis;
          this.i;
      var toReturn = dv.args("colorPalette").length ? dv.scale("color", dv._get(dis, dv.args("key.color"))) : [];

      switch (this.dv.baseType) {
        case 'line':
          if (!toReturn.length) {
            toReturn = dv.args("linePointsColor") || dv.args("lineColor");
          }

          break;
      }

      return toReturn;
    };

    Shape.dTween = function dTween(dv) {
      if (dv.baseType !== 'pie') return;
      return function (dis, i) {
        var currPie = dis.pie;
        return dv.interpolate(currPie.endAngle, currPie.startAngle, function (value) {
          currPie.startAngle = value;
          return new Pi(dv, dis, i).path(true);
        });
      };
    };

    _proto.size = function size(coord, initial) {
      initial = initial || false;
      var dv = this.dv;

      if (dv._is_base('pie')) {
        return; //go on pi. git. u have no bidnes herr
      }

      var keyKey = dv.args(coord + "Data"),
          oppoAlign = dv.args(ToOppoAxis(coord) + "Align"),
          dimension = dv.dimensionFromAxis(coord),
          scaled = this.scaledValue(keyKey);
      var toReturn = 20;

      if (dv._name_is_num == true || keyKey == 1) {
        if (initial) {
          toReturn = 0;
        } else {
          if (oppoAlign == 'right' || oppoAlign == 'bottom') {
            toReturn = dimension - scaled;
          } else {
            toReturn = scaled;
          }
        }
      } else {
        toReturn = dv.scale(keyKey).bandwidth();
      } //cant be a negaative bitch... yet... what the fuq


      if (toReturn < 0) {
        toReturn = 0;
      }

      return toReturn;
    };

    _proto.offset = function offset(coord, initial) {
      initial = initial || false;
      var dv = this.dv;

      if (dv._is_base('pie')) {
        return; //go on pi. git. u have no bidnes herr
      } // same here.. could be the same probably


      var keyKey = dv.args(coord + "Data"),
          oppoAlign = dv.args(ToOppoAxis(coord) + "Align"),
          dimension = dv.dimensionFromAxis(coord),
          size = this.size(coord, initial),
          scaled = this.scaledValue(keyKey);
      var toReturn = 0;

      switch (dv.baseType) {
        default:
          if (dv._name_is_num == true || keyKey == 1) {
            if (oppoAlign == 'right' || oppoAlign == 'bottom') {
              if (initial && keyKey == 1 && dv._is_base(['bar', 'line'])) {
                toReturn = dimension;
              } else {
                toReturn = dimension - size;
              }
            } else {
              if (dv._is_base(['scatter'])) {
                if (!(initial && keyKey == 1 && dv._is_base('line'))) {
                  toReturn = scaled;
                }
              }
            }
          } else {
            toReturn = scaled;

            if (dv._is_base(['line', 'scatter']) && !dv._name_is_num) {
              toReturn += size / 2;
            }
          }

          break;
      }

      return toReturn;
    };

    return Shape;
  }(Component);

  var OPTIMAL_LABEL_OFFSET_MULTIPLIER = 0.875;

  var Label = /*#__PURE__*/function (_Component) {
    _inheritsLoose(Label, _Component);

    function Label(dv, axisName) {
      return _Component.call(this, dv, {
        axisName: axisName
      }) || this;
    }

    var _proto = Label.prototype;

    _proto.offset = function offset(coord) {
      var offset = 0;
      var dv = this.dv;
      var axisName = this.axisFromKey; //x

      if (coord == 'x') {
        if (axisName == 'x') {
          offset = dv.args(ToSide(axisName)) / 2;
        } else if (axisName == 'y') {
          offset = -(dv.args(ToSide(axisName)) / 2);
        } //y

      } else {
        if (axisName == 'x') {
          if (dv.args(axisName + "Align") == 'bottom') {
            offset = dv.args(ToSide(axisName, true)) + dv.margin.bottom * OPTIMAL_LABEL_OFFSET_MULTIPLIER;
          } else {
            offset = -(dv.margin.top * OPTIMAL_LABEL_OFFSET_MULTIPLIER);
          }
        } else if (axisName == 'y') {
          if (dv.args(axisName + "Align") == 'right') {
            offset = dv.args(ToSide(axisName, true)) + (dv.margin.right * OPTIMAL_LABEL_OFFSET_MULTIPLIER + dv.fontSize);
          } else {
            offset = -(dv.margin.left * OPTIMAL_LABEL_OFFSET_MULTIPLIER - dv.fontSize);
          }
        }
      }

      return offset;
    };

    return Label;
  }(Component);

  var Legend = /*#__PURE__*/function (_Component) {
    _inheritsLoose(Legend, _Component);

    function Legend(dv, unit) {
      return _Component.call(this, dv, {
        unit: unit,
        height: 0
      }) || this;
    }

    var _proto = Legend.prototype;

    _proto.offset = function offset(coord) {
      var dv = this.dv;

      var offset = 0,
          length = dv.legends.nodes()[0].getBoundingClientRect()[ToSide(coord)],
          // .8
      shifter = function shifter() {
        var value = 0,
            multiplier = 1;

        switch (dv.baseType) {
          case 'pie':
            multiplier = -1;
            value = coord == 'x' ? length + parseFloat(dv.args('fontSize')) : length * 0.5;
            break;

          default:
            if (dv.args(ToOppoAxis(coord) + 'Align') == 'left' || dv.args(ToOppoAxis(coord) + 'Align') == 'top') {
              multiplier = -1;
              value = length + parseFloat(dv.args('fontSize')); // } else {
              //     value = length * .5;
            }

            break;
        }

        return value * multiplier;
      };

      switch (dv.baseType) {
        case 'pie':
          offset = coord == 'x' ? dv.args(ToSide(coord)) : dv.args(ToSide(coord)) * 0.5;
          break;

        default:
          if (dv.args(ToOppoAxis(coord) + 'Align') == 'left' || dv.args(ToOppoAxis(coord) + 'Align') == 'top') {
            offset = dv.args(ToSide(coord)); // } else{
            //     offset = dv.args(ToSide(coord)) * .5;
          }

          break;
      } // return offset;


      return offset + shifter();
    };

    return Legend;
  }(Component);

  var Line = /*#__PURE__*/function (_Component) {
    _inheritsLoose(Line, _Component);

    function Line(dv, data) {
      return _Component.call(this, dv, {
        data: data
      }) || this;
    }

    var _proto = Line.prototype;

    _proto.path = function path(isArea, initial) {
      var _this = this;

      if (!this.data) {
        return;
      }

      initial = initial || false;
      var dv = this.dv;
      this.i;
      var d3PathType = isArea ? 'area' : 'line';
      var path = d3[d3PathType]();

      if (d3PathType == 'area') {
        //name coord, value coord, fill coordinate
        var aCord = {
          //default is top
          name: this.axisToFill,
          //x
          value: ToOppoAxis(this.axisToFill) + "1",
          //y
          fill: ToOppoAxis(this.axisToFill) + "0" //initial of data name is the bottom of the fill

        };
        path[aCord.name](function (dis, i) {
          return new Shape(dv, dis, i).offset(_this.axisToFill, initial);
        })[aCord.value](function (dis, i) {
          return new Shape(dv, dis, i).offset(ToOppoAxis(_this.axisToFill), initial);
        })[aCord.fill](function (dis, i) {
          return dv.args(_this.axisToFill + "Align") == 'bottom' || dv.args(_this.axisToFill + "Align") == 'right' ? dv.args(ToSide(_this.axisToFill)) : 0;
        });
      } else {
        path.x(function (dis, i) {
          return new Shape(dv, dis, i).offset('x', initial);
        }).y(function (dis, i) {
          return new Shape(dv, dis, i).offset('y', initial);
        });
      }

      path.curve(d3[this.style]);
      return path(this.data);
    };

    _createClass(Line, [{
      key: "axisToFill",
      get: function get() {
        return this.dv.args('xData') == 0 ? 'x' : 'y'; //fill to where name data is at
      }
    }, {
      key: "style",
      get: function get() {
        var theString;

        switch (this.dv.args('lineStyle')) {
          case 'step':
            theString = 'curveStepBefore';
            break;

          case 'curve':
            theString = 'curveMonotone' + this.axisToFill.toUpperCase();
            break;

          default:
            theString = 'curveLinear';
            break;
        }

        return theString;
      }
    }]);

    return Line;
  }(Component);

  var Stamp = /*#__PURE__*/function (_Component) {
    _inheritsLoose(Stamp, _Component);

    function Stamp(dv, dis, i) {
      return _Component.call(this, dv, {
        dis: dis,
        i: i
      }) || this;
    }

    var _proto = Stamp.prototype;

    _proto.length = function length(coord) {
      var dv = this.dv;
      var value = 0;

      if (ToSide(coord) == 'width') {
        value = dv.itemStamps.nodes()[this.i].getBBox()[ToSide(coord)] + Stamp.textPadding * dv.fontSize;
      } else {
        value = dv.fontSize * (dv.args('textNameSize') + dv.args('textValueSize') + Stamp.textPadding);
      }

      return parseFloat(value);
    };

    _proto.onLightPalette = function onLightPalette() {
      var dv = this.dv,
          dis = this.dis,
          i = this.i,
          axisName = dv.axisFromKey(1),
          offset = this.offset(axisName),
          currShape = new Shape(dv, dis, i),
          currSize = currShape.size(axisName),
          currOffset = currShape.offset(axisName);
          this.length(axisName);
          dv.args(dv.dimensionFromAxis(axisName));
      var toReturn = false;
      ColorIsDark(currShape.palette());

      switch (dv.baseType) {
        case 'pie':
          if (dv.args('piLabelStyle') == 'within' && !ColorIsDark(currShape.palette()) || dv.args('piLabelStyle') == 'linked' && !ColorIsDark(dv.args('colorBackground'))) {
            toReturn = true;
          }

          break;

        case 'bar':
          switch (dv.args(ToOppoAxis(axisName) + "Align")) {
            case 'top':
            case 'left':
              if (offset > currOffset + currSize && ColorIsDark(dv.args('colorBackground'))) {
                toReturn = true;
              }

              break;

            case 'right':
            case 'bottom':
              if (offset < currOffset && ColorIsDark(dv.args('colorBackground'))) {
                toReturn = true;
              }

              break;
          } // if (
          //     (
          //         this._is_bar_and_within &&
          //         ( // it out
          //             (currSize < currLength)
          //             && !ColorIsDark(dv.args('colorBackground'))
          //         )
          //         || ( //it in
          //             (currSize >= currLength)
          //             && !ColorIsDark(currShape.palette())
          //         )
          //     )
          //     || (
          //         !this._is_bar_and_within &&
          //         (
          //             ( // it out
          //                 (
          //                     (currSize + currLength) <=  dimension
          //                 )
          //                 && !ColorIsDark(dv.args('colorBackground'))
          //             )
          //             || ( //it in
          //                 (
          //                     (currSize + currLength) > dimension
          //                 )
          //                 && !ColorIsDark(currShape.palette())
          //             )
          //         )
          //     )
          // ) {
          // 	toReturn = true;
          // }


          break;

        default:
          if (!ColorIsDark(dv.args('colorBackground'))) {
            toReturn = true;
          }

          break;
      }

      return toReturn;
    };

    _proto._shiftPad = function _shiftPad(coord, initial) {
      var dv = this.dv;
          this.dis;
          this.i;
          var keyKey = dv.args(coord + "Data");
      var toReturn = 0,
          multiplier = 1;
      if (dv.baseType == 'pie') return toReturn;

      switch (this.dv.baseType) {
        case 'scatter':
          break;

        default:
          if (!initial) {
            if (dv.args(ToOppoAxis(coord) + "Align") == 'bottom' || dv.args(ToOppoAxis(coord) + "Align") == 'right') {
              multiplier = -1;
            }

            if (keyKey !== 0 && coord == 'x') {
              toReturn = Stamp.textPadding * 0.5 * dv.fontSize;
            }

            toReturn *= multiplier;
          }

          break;
      }

      return toReturn;
    };

    _proto._shiftArea = function _shiftArea(coord, initial) {
      var dv = this.dv,
          dis = this.dis,
          i = this.i,
          keyKey = dv.args(coord + "Data"),
          currShape = new Shape(dv, dis, i);
      var toReturn = 0,
          multiplier = 1;
      if (dv.baseType == 'pie') return toReturn;

      switch (this.dv.baseType) {
        case 'scatter':
          break;

        default:
          if (!initial) {
            if (!this._is_bar_and_within && (dv.args(ToOppoAxis(coord) + "Align") == 'bottom' || dv.args(ToOppoAxis(coord) + "Align") == 'right') || this._is_bar_and_within && (dv.args(ToOppoAxis(coord) + "Align") == 'top' || dv.args(ToOppoAxis(coord) + "Align") == 'left')) {
              multiplier = -1;
            }

            if (keyKey !== 0) {
              //smol boys dont need to shift for areas its... gonna be outside no matter whar
              if (coord == 'x') {
                if (!this._is_bar_and_within && currShape.size(coord) >= dv.dimensionFromAxis(coord) - this.length(coord)) {
                  toReturn = -this.length(coord);
                } else if (this._is_bar_and_within && currShape.size(coord) < this.length(coord)) {
                  toReturn = -currShape.size(coord);
                }
              } else {
                if (!this._is_bar_and_within && currShape.size(coord) >= dv.dimensionFromAxis(coord) - this.length(coord) || this._is_bar_and_within && currShape.size(coord) < this.length(coord)) {
                  toReturn = this.length(coord) * -0.5;
                } else {
                  toReturn = this.length(coord) * 0.5;
                }
              }
            }

            toReturn *= multiplier;
          }

          break;
      }

      return toReturn;
    };

    _proto.offset = function offset(coord, initial) {
      initial = initial || false;
      var dv = this.dv,
          dis = this.dis,
          i = this.i,
          keyKey = dv.args(coord + "Data"),
          currShape = new Shape(dv, dis, i);

      var toReturn,
          origin = 0,
          shiftPad = this._shiftPad(coord, initial),
          shiftArea = this._shiftArea(coord, initial),
          piInitial,
          piCalcWithInnerRadius,
          piMultiplier = 0,
          piValueArr = []; //get origin with no shifting for shapes and bitches first so you know where theyre offseting from. got dammit dumbass weve been through this again and again oh god i hate math


      switch (dv.baseType) {
        case 'pie':
          piInitial = dv.args('piLabelStyle') == 'linked' ? false : initial;

          if (dv.args('piLabelStyle') == 'linked') {
            piMultiplier = initial ? 1 : 2.5;
          } else {
            if (initial == false) {
              piMultiplier = 1;
            }
          }

          piCalcWithInnerRadius = dv.args('piLabelStyle') == 'linked' ? false : true, piValueArr = new Pi(dv, dis, i).path(piCalcWithInnerRadius, 'centroid', piMultiplier, piInitial);
          toReturn = coord == 'x' ? piValueArr[0] : piValueArr[1];
          break;

        default:
          if (keyKey == 0) {
            origin = currShape.offset(coord); //igitna ang dipukal

            if (dv.baseType == 'bar') {
              origin += currShape.size(coord) / 2;
            }
          } else {
            switch (dv.args(ToOppoAxis(coord) + "Align")) {
              case 'top':
                if (!initial && dv.baseType !== 'scatter') {
                  origin = currShape.size(coord);
                }

                break;

              case 'right':
              case 'bottom':
                if (initial && dv.baseType !== 'scatter' || this._is_bar_and_within && dv.args(ToOppoAxis(coord) + "Align") == 'right') {
                  origin = dv.dimensionFromAxis(coord);
                } else {
                  origin = dv.dimensionFromAxis(coord) - currShape.size(coord);
                }

                break;

              case 'left':
                if (!this._is_bar_and_within) {
                  if (!initial) {
                    origin = currShape.size(coord);
                  }
                }

                break;
            }
          }

          toReturn = origin + shiftPad + shiftArea; // toReturn = origin;
          // toReturn = origin + shiftArea;
          // toReturn = origin + shiftPad;

          break;
      }

      return toReturn;
    };

    _proto.toLight = function toLight() {};

    _proto.stroke = function stroke() {
      var dv = this.dv;
      var dis = this.dis;
      var i = this.i;
      var currShape = new Shape(dv, dis, i);
      var toReturn = dv.args('colorBackground');

      switch (this.dv.baseType) {
        case 'pie':
          if (dv.args('piLabelStyle') == 'within') {
            toReturn = currShape.palette();
          }

          break;

        case 'bar':
          if ((!this._is_bar_and_within && currShape.size(dv.axisFromKey(1))) >= dv.args(ToSide(dv.axisFromKey(1))) - this.length(dv.axisFromKey(1)) || (this._is_bar_and_within && currShape.size(dv.axisFromKey(1))) >= this.length(dv.axisFromKey(1))) {
            toReturn = currShape.palette();
          }

          break;
      }

      return toReturn;
    };

    _proto.baselineShift = function baselineShift(coord, keyKey) {
      var dv = this.dv;
      var toReturn = '0em';

      if (dv._has_both_text) {
        if (coord == 'y' && dv._has_both_text) {
          // calculate height
          var fullHeight = dv.fontSize * (dv.args('textNameSize') + dv.args('textValueSize') + Stamp.textPadding); // .5 margin top bottom and between text

          if (keyKey == 1) {
            toReturn = (fullHeight * -0.5 + dv.fontSize * dv.args('textValueSize') * 0.5 + dv.fontSize) / (dv.fontSize * dv.args('textValueSize')) + 'em';
          } else {
            toReturn = (fullHeight * 0.5 - dv.fontSize * dv.args('textNameSize') * 0.5 - dv.fontSize) / (dv.fontSize * dv.args('textNameSize')) + 'em';
          }
        }
      }

      return toReturn;
    };

    _createClass(Stamp, [{
      key: "_is_bar_and_within",
      get: function get() {
        var dv = this.dv;
        return dv.baseType == 'bar' && dv.args('barTextWithin');
      }
    }, {
      key: "textAnchor",
      get: function get() {
        var dv = this.dv;
        var anchor = 'middle';

        if (dv.args('type') == 'pie') ; else {
          if (dv.args("yData") == 0) {
            anchor = 'start';
          }

          Coordinates.forEach(function (coord) {
            if (dv.args(ToOppoAxis(coord) + "Data") == 0 && dv.args(ToOppoAxis(coord) + "Align") == 'right') {
              anchor = 'end';
            }
          });
        }

        return anchor;
      }
    }], [{
      key: "textPadding",
      get: function get() {
        return 2.25;
      }
    }]);

    return Stamp;
  }(Component);

  var Tip = /*#__PURE__*/function (_Component) {
    _inheritsLoose(Tip, _Component);

    function Tip(dv, classToAdd) {
      return _Component.call(this, dv, {
        classToAdd: classToAdd
      }) || this;
    }

    var _proto = Tip.prototype;

    _proto.getCall = function getCall() {
      var tt = this;
      var dv = this.dv;
      return d3.tip().attr('class', "" + tt.classToAdd).style('width', function () {
        if (typeof dv.args('tooltipWidth') === 'number') {
          return dv.args('tooltipWidth') + "px";
        } else if (dv.args('tooltipWidth') == 'auto') {
          return dv.args('tooltipWidth');
        }
      }).style('text-align', dv.args('tooltipTextAlign')).direction(dv.args('tooltipDirectionParameter') || dv.args('tooltipDirection')).html(Tip.html);
    };

    _proto.show = function show() {};

    _proto["default"] = function _default(dis, i) {
      var dv = this.dv;
      var html = "<div class=\"" + dv.createClass('tooltip-data') + "\">";

      var _loop = function _loop(prop) {
        if (Object.prototype.hasOwnProperty.call(dis, prop)) {
          var propIsOutputted = false;

          if (typeof dis[prop] !== 'object') {
            html += "<div class=\"" + dv.createClass('tooltip-data-property') + "\">"; // label

            if (dv.args('srcType') !== 'row') {
              html += "<strong class=\"" + dv.createClass('tooltip-data-property-label') + "\">" + prop + ":</strong> ";
            }

            DatumKeys.forEach(function (keyKey) {
              if (dv.args("key['" + keyKey + "']") && dv.args("key['" + keyKey + "']").lastIndexOf(prop) > -1 && dv.format(keyKey) && propIsOutputted == false) {
                html += "<span class=\"" + dv.createClass('tooltip-data-property-content') + "\">" + dv.format(keyKey)(dv._get(dis, dv.args("key['" + keyKey + "' ]"))) + " </span>";
                propIsOutputted = true;
              }
            });

            if (propIsOutputted == false) {
              // content
              html += "<span class=\"" + dv.createClass('tooltip-data-property-content') + "\">" + dis[prop] + "</span>";
            }

            html += '</div>';
          }
        }
      };

      for (var prop in dis) {
        _loop(prop);
      }

      html += '</div>';
      return html;
    };

    _createClass(Tip, [{
      key: "html",
      get: function get() {
        var dv = this.dv;
        return dv.args('tooltipContent') || Tip["default"];
      }
    }]);

    return Tip;
  }(Component);

  /*!
   * 1point21 Data Vizualiser Version 1.2.1
   * Render Script
   * @license yes
   * DO NOT EDIT min.js
   * edit its corresponding unminified js file in /src instead
   */

  /* DO NOT TOUCH I DEV ON THIS BOI I ENQUEUE THE MINIFIED ONE ANYWAY  :< */

  /*

  TODO:
  pie does not display a wHOLE PIE
  duisplay types for multiple
  - compare
  - slider
  - overlap
  - one
  */

  /*****************************************************************************
   * ATTR ABD SHIT DEFINITIONS
   *****************************************************************************/

  var //yeeee
  PREFIX = 'dv';
  var CLASS_READY = PREFIX + "-initialized",
      CLASS_ERROR = PREFIX + "-fatality",
      CLASS_HEADER = PREFIX + "-heading",
      CLASS_TITLE = PREFIX + "-title",
      CLASS_DESCRIPTION = PREFIX + "-description",
      CLASS_BODY = PREFIX + "-body",
      CLASS_SVG = PREFIX + "-svg",
      CLASS_G_CONTAINER = PREFIX + "-container",
      CLASS_LABELS = PREFIX + "-labels",
      CLASS_LABEL_PREFIX = PREFIX + "-label",
      CLASS_RULERS = PREFIX + "-rulers",
      CLASS_RULER_PREFIX = PREFIX + "-rule",
      CLASS_RULER_ALIGN_PREFIX = CLASS_RULER_PREFIX + "-align",
      CLASS_GRIDS = PREFIX + "-grid",
      CLASS_GRID_PREFIX = CLASS_GRIDS + "-col",
      CLASS_GRID_INC_PREFIX = CLASS_GRID_PREFIX + "-increment",
      CLASS_GRAPH = PREFIX + "-graph",
      CLASS_GRAPH_LINE = PREFIX + "-line",
      CLASS_GRAPH_FILL = CLASS_GRAPH_LINE + "-fill",
      CLASS_ITEM = CLASS_GRAPH + "-item",
      CLASS_ITEM_BLOB = CLASS_ITEM + "-shape",
      CLASS_STAMPS = PREFIX + "-stamps",
      CLASS_ITEM_POLYLINE = CLASS_ITEM + "-link",
      CLASS_ITEM_STAMP = CLASS_ITEM + "-stamp",
      CLASS_ITEM_STAMP_DATA = CLASS_ITEM_STAMP + "-data",
      CLASS_LEGENDS = PREFIX + "-legend",
      CLASS_LEGENDS_ITEM = CLASS_LEGENDS + "-item",
      CLASS_LEGENDS_ITEM_SHAPE = CLASS_LEGENDS_ITEM + "-shape",
      CLASS_LEGENDS_ITEM_TEXT = CLASS_LEGENDS_ITEM + "-text",
      CLASS_CURSOR_STALKER = PREFIX + "-cursor-stalker",
      CLASS_TOOLTIP = PREFIX + "-tooltip",
      CLASS_LIGHT_TEXT = PREFIX + "-light",
      OPTIMAL_DEFAULT_DATA_COUNT = 9,
      OPTIMAL_SCALE_LOG_CONST = 10;
  /*****************************************************************************
   * MAIN BITCH STARTS HERE
   *****************************************************************************/

  var _inpSet = /*#__PURE__*/_classPrivateFieldLooseKey("inpSet");

  var _data = /*#__PURE__*/_classPrivateFieldLooseKey("data");

  var _is_debuggy = /*#__PURE__*/_classPrivateFieldLooseKey("is_debuggy");

  var _deepGet = /*#__PURE__*/_classPrivateFieldLooseKey("deepGet");

  var _renderAG = /*#__PURE__*/_classPrivateFieldLooseKey("renderAG");

  var _parseData = /*#__PURE__*/_classPrivateFieldLooseKey("parseData");

  var _drawGraphSet = /*#__PURE__*/_classPrivateFieldLooseKey("drawGraphSet");

  var DataVisualizer = /*#__PURE__*/function () {
    function DataVisualizer(selector, settings) {
      Object.defineProperty(this, _drawGraphSet, {
        value: _drawGraphSet2
      });
      Object.defineProperty(this, _parseData, {
        value: _parseData2
      });
      Object.defineProperty(this, _renderAG, {
        value: _renderAG2
      });
      Object.defineProperty(this, _is_debuggy, {
        get: _get_is_debuggy,
        set: void 0
      });
      Object.defineProperty(this, _inpSet, {
        writable: true,
        value: false
      });
      Object.defineProperty(this, _data, {
        writable: true,
        value: {
          displayed: false,
          complete: false
        }
      });
      console.info('DataVisualizer Initiated!');

      var _dv = this;

      _dv.selector = selector;
      _dv.__trans = false;
      _dv.elem = document.querySelector(selector);
      _dv._graphSets = {};

      if (VaildateBrowser()) {
        var error = document.createElement('div');
        error.className = CLASS_BODY + " " + CLASS_ERROR;
        error.innerHTML = 'Sorry, this graphic needs D3 to render the data but your browser does not support it.<br><br> Newer versions of Chrome, Edge, Firefox and Safari are recommended. <br><br>See <em><a target="_blank" rel="nofollow" href="https://d3-wiki.readthedocs.io/zh_CN/master/Home/#browser-platform-support">the official wiki</a></em> for more information';

        _dv.elem.appendChild(error);

        throw new Error('D3 not supported by browser');
      } // fallback + validate color data
      // if color data key aint set put in name


      if (!_dv._get(settings, 'key.color')) {
        settings.key.color = settings.key[0];
        settings.colorData = 0; //if legend was not fucked with we take the authority to kill legend

        if (!settings.colorLegend) {
          settings.colorLegend = false;
        }
      } //valisate arwea key i guess
      // if(!dv._get(settings,'key.area')){
      // 	settings.key.area
      // }


      _classPrivateFieldLooseBase(_dv, _inpSet)[_inpSet] = settings;
      _dv.isLoaded = false;
      _dv.resizeInt = null;

      _dv.load();
    }

    var _proto = DataVisualizer.prototype;

    _proto.getgraphSets = function getgraphSets(classKey, cycle) {
      var toReturn = this._graphSets;

      if (classKey) {
        toReturn = cycle ? this._graphSets[Str.toCamelCase(classKey)][cycle] : this._graphSets[Str.toCamelCase(classKey)].root;
      }

      return toReturn;
    };

    _proto.savegraphSets = function savegraphSets(classKey, obj) {
      this._graphSets[Str.toCamelCase(classKey)] = obj;
    };

    _proto.UiEl = function UiEl(elem) {
      if (elem) {
        this._resetUiEl(elem);
      }

      return this.elem;
    };

    _proto._resetUiEl = function _resetUiEl(elem) {
      if (elem) {
        this.elem = elem;
      } else {
        throw new Error('Needs a valid element to reset component UI root element');
      }
    }
    /*****************************************************************************
     * MAIN BITCH STARTS HERE
     *****************************************************************************/
    ;

    _proto._get = function _get(obj, stringedKeys, isNum) {
      return _classPrivateFieldLooseBase(DataVisualizer, _deepGet)[_deepGet](obj, stringedKeys, isNum);
    };

    _proto._is_base = function _is_base(types) {
      var templates = [];

      if (typeof types === 'string') {
        templates.push(types);
      } else if (Array.isArray(types)) {
        templates = types;
      }

      var toReturn = false;

      if (templates.includes(this.baseType) && !toReturn) {
        toReturn = true;
      }

      return toReturn;
    };

    _proto._has_grid = function _has_grid(axisName) {
      return this._has_ticks(axisName) && this._has_axis_prop('grid', axisName);
    };

    _proto._has_labels = function _has_labels(axisName) {
      return this._has_axis_prop('label', axisName);
    };

    _proto._has_ticks = function _has_ticks(axisName) {
      return this._has_axis_prop('ticks', axisName);
    };

    _proto._has_axis_prop = function _has_axis_prop(property, axisName) {
      if (property && !this._is_base('pie')) {
        if (axisName) {
          return this.args(Str.toCamelCase(axisName + " " + property));
        } else {
          return this.args(Str.toCamelCase("x " + property)) || this.args(Str.toCamelCase("y " + property));
        }
      }
    };

    DataVisualizer.defaults = function defaults(key) {
      key = key || false;
      var settings = {
        //settings
        width: 600,
        height: 600,
        margin: 40,
        transition: 500,
        delay: 250,
        fontSize: '16px',
        // content
        title: '',
        description: '',
        //src
        srcType: '',
        srcPath: '',
        srcKey: null,
        srcMultiple: false,
        srcPreNest: false,
        //text
        textNameSize: 0.75,
        textValueSize: 1.25,
        textTicksSize: 0.75,
        textLegendSize: 0.75,
        // fields
        type: 'bar',
        nameIsNum: false,
        //keys
        key: {
          multiple: '_parent',
          0: 0,
          1: 1,
          color: null,
          area: null
        },
        //reverse
        reverse: {
          0: false,
          1: false,
          color: false,
          multiple: false,
          area: false
        },
        //format
        // name
        format0Prepend: '',
        format0Append: '',
        format0Parameter: null,
        format0Divider: 1,
        //@TODO deprecate
        // value
        format1Prepend: '',
        format1Append: '',
        format1Parameter: null,
        format1Divider: 1,
        //@TODO deprecate
        // color
        formatColorPrepend: '',
        formatColorAppend: '',
        formatColorParameter: null,
        //scatterplot area
        areaMin: 10,
        areaMax: 20,
        areaOpacity: 0.8,
        //kulay
        colorBackground: '#eee',
        colorData: null,
        colorLegend: false,
        colorPalette: PlaceholderColors,
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
        //bar
        barTextWithin: false,
        barGutter: 0.1,
        //line
        lineStyle: '',
        lineWeight: 1,
        lineColor: null,
        linePoints: false,
        lineFill: false,
        linePointsColor: null,
        linePointsSize: 5,
        lineFillColor: null,
        lineFillInvert: false,
        lineFillOpacity: 0.5,
        lineDash: [100, 0],
        //pi
        piLabelStyle: 'within',
        piInRadius: 0,
        //tooltip
        tooltipEnable: false,
        tooltipTextAlign: 'left',
        tooltipWidth: 'auto',
        tooltipDirection: 'n',
        tooltipDirectionParameter: null,
        tooltipContent: null,
        //2.0.0 new this.args. not implemented yet
        stamp0: true,
        //text that happens when no ticks but now were taking em out
        stamp1: true,
        // multiple
        multipleDisplay: 'overlay',
        // single,versus,overlap @TODO NOOOOOOOO make it a type instead but with a sub typ so like line_reflected line_stacked line_overlay or some shit
        //kulay
        colorBy: 'key',
        //set will influence key.color
        //advanced
        colorScheme: null
      };
      return key ? _classPrivateFieldLooseBase(DataVisualizer, _deepGet)[_deepGet](settings, key) : settings;
    };

    _proto.args = function args(key) {
      key = key || false;
      var settings = DeepValidate(DataVisualizer.defaults(), _classPrivateFieldLooseBase(this, _inpSet)[_inpSet]);
      return key ? _classPrivateFieldLooseBase(DataVisualizer, _deepGet)[_deepGet](settings, key) : settings;
    };

    _proto.outer = function outer(dimension) {
      var margins = [];

      if (dimension == 'width') {
        margins = ['left', 'right'];
      } else {
        margins = ['top', 'bottom'];
      }

      return this.args(dimension) + this.margin[margins[0]] + this.margin[margins[1]];
    };

    _proto.interpolate = function interpolate(start, end, fn, d3fn) {
      fn = fn || function (value, start, end) {
        return value;
      };

      d3fn = d3fn || 'interpolate';
      var i = d3[d3fn](start, end);
      return function (t) {
        var interVal = i(t);
        return fn(interVal, start, end);
      };
    };

    _proto.createClass = function createClass(classFallback, classForTrue, trueLogic, hasPrefix) {
      classFallback = classFallback || '';
      classForTrue = classForTrue || classFallback;
      trueLogic = trueLogic != false || trueLogic == true;
      hasPrefix = hasPrefix != false || hasPrefix == true;
      return "" + (hasPrefix ? PREFIX + "-" : '') + (trueLogic ? classForTrue : classFallback);
    };

    _proto.axisFromKey = function axisFromKey(keyKey) {
      var dv = this;

      if (keyKey == 0 || keyKey == 1) {
        return dv.args('xData') == keyKey ? 'x' : 'y';
      } else {
        return keyKey;
      }
    };

    _proto.dimensionFromAxis = function dimensionFromAxis(axisName) {
      return this.args(ToSide(axisName));
    };

    _proto.range = function range(keyKey) {
      var dv = this;
      var axisName = dv.axisFromKey(keyKey);
      var toReturn = [];

      switch (keyKey) {
        case 'color':
          toReturn = dv.args(keyKey + "Palette");
          break;

        case 'area':
          toReturn = [dv.args('areaMin'), dv.args('areaMax')];
          break;

        case 0:
        case 1:
          if (dv.args(ToOppoAxis(axisName) + "Align") == 'top' || dv.args(ToOppoAxis(axisName) + "Align") == 'left') {
            toReturn = [0, dv.args(ToSide(axisName))];
          } else {
            toReturn = [dv.args(ToSide(axisName)), 0];
          }

          break;
      }

      return toReturn;
    };

    _proto.domain = function domain(keyKey) {
      var dv = this;
      var key = dv.args("key['" + keyKey + "']");
      var toReturn = [];

      if (key) {
        // @TODO get deep into the anals of this for multiple data setup
        var dat = dv.theData(true);
        var axisName = dv.axisFromKey(keyKey);

        var pushToDom = function pushToDom(d) {
          if (!toReturn.includes(dv._get(d, key))) {
            toReturn.push(dv._get(d, key));
          }
        };

        switch (keyKey) {
          case 'color':
            dat.forEach(function (dis) {
              pushToDom(dis);
            });
            break;

          case 'area':
          case 0:
          case 1:
            if (dv.args('nameIsNum') == true || keyKey == 1 || keyKey == 'area') {
              var min, max; //min

              if (dv.args(axisName + "Min") !== null && keyKey !== 'area') {
                min = dv.args(axisName + "Min");
              } else {
                min = d3.min(dat, function (dis) {
                  return dv._get(dis, key, true);
                });
              } //max


              if (dv.args(axisName + "Max") !== null && keyKey !== 'area') {
                max = dv.args(axisName + "Max");
              } else {
                max = d3.max(dat, function (dis) {
                  return dv._get(dis, key, true);
                });
              }

              toReturn = [min, max]; //if it a scatter plot we get nereast

              if (dv._is_base('scatter') && keyKey == 0) {
                var newMin = GetNearest(min),
                    newMax = GetNearest(max);
                toReturn = [newMin, newMax];
              }
            } else {
              //retains multiple instances
              toReturn = dat.map(function (dis) {
                return dv._get(dis, key, false);
              }); //this dont

              dat.forEach(function (dis) {
                pushToDom(dis);
              });
            }

            if (dv.args("reverse." + keyKey)) {
              // dont use .reverse because it's a piece of shit
              var reversed = [];

              for (var i = toReturn.length - 1; i >= 0; i--) {
                reversed.push(toReturn[i]);
              }

              toReturn = reversed;
            }

            break;
        }
      }

      return toReturn;
    };

    _proto.scale = function scale(keyKey, dataToScale) {
      dataToScale = dataToScale || false;
      var dv = this;
      var toReturn;
      var range = dv.range(keyKey);
      var domain = dv.domain(keyKey);

      switch (keyKey) {
        case 'color':
          toReturn = d3.scaleOrdinal().range(range).domain(domain);
          break;

        case 'area':
        case 0:
        case 1:
          if (dv.args('nameIsNum') == true || keyKey == 1 || keyKey == 'area') {
            if (dv.args('nameIsNum') == true && keyKey == 0 && dv._is_base('scatter')) {
              toReturn = d3.scaleSymlog().constant(OPTIMAL_SCALE_LOG_CONST).range(range).domain(domain);
            } else {
              toReturn = d3.scaleLinear().range(range).domain(domain);
            }
          } else {
            if (dv._is_base(['line', 'scatter'])) {
              toReturn = d3.scalePoint() //scales shit to dimensios
              .range(range) // scaled data from available space
              .domain(domain);
            } else {
              toReturn = d3.scaleBand() //scales shit to dimensios
              .range(range) // scaled data from available space
              .domain(domain).paddingInner(dv.args('barGutter')) //spacing between
              .paddingOuter(dv.args('barGutter'));
            }
          }

          break;
      }

      return dataToScale ? toReturn(dataToScale) : toReturn;
    };

    _proto.format = function format(keyKey) {
      keyKey = Str.toCapitalize(keyKey.toString());
      var dv = this;
      var toReturn;

      if (typeof dv.args("format" + keyKey + "Parameter") === 'function') {
        toReturn = dv.args("format" + keyKey + "Parameter");
      } else if (typeof dv.args("format" + keyKey + "Parameter") === 'string') {
        toReturn = function toReturn(value, i) {
          return d3.format(dv.args("format" + keyKey + "Parameter"))(value);
        };
      } else {
        toReturn = function toReturn(value, i) {
          var divider = dv.args("format" + keyKey + "Divider"),
              prepend = dv.args("format" + keyKey + "Prepend"),
              append = dv.args("format" + keyKey + "Append"),
              dataPossiblyDivided = keyKey == 1 || dv.args('nameIsNum') == true ? value / divider : value,
              formatted = "" + prepend + dataPossiblyDivided + append;
          return formatted;
        };
      }

      return toReturn;
    };

    _proto.Axis = function Axis$1(axisName) {
      return new Axis(this, axisName);
    };

    _proto.Shape = function Shape$1(dis, i) {
      dis = dis || false;
      i = i || null;
      return new Shape(this, dis, i);
    };

    _proto.Pi = function Pi$1(dis, i) {
      dis = dis || false;
      i = i || null;
      return new Pi(this, dis, i);
    };

    _proto.Line = function Line$1(data) {
      data = data || false;
      return new Line(this, data);
    };

    _proto.Label = function Label$1(axisName) {
      return new Label(this, axisName);
    };

    _proto.Legend = function Legend$1(dis, i) {
      return new Legend(this, dis, i);
    };

    _proto.Stamp = function Stamp$1(dis, i) {
      return new Stamp(this, dis, i);
    };

    _proto.theData = function theData(returnDrawn, d3method) {
      returnDrawn = returnDrawn || false;
      d3method = d3method || ''; //group,pie

      var dv = this;
      var toReturn = [];
      var data = returnDrawn ? dv.drawnData : dv.completeData; //add shits

      switch (dv.baseType) {
        case 'pie':
          data.forEach(function (dis, i) {
            var pie = d3.pie().sort(null).value(function (dis) {
              return dv._get(dis, dv.args("key[1]"), true);
            });
            data[i].pie = pie(data)[i];
          });
          break;
      }

      switch (d3method) {
        case 'group':
          {
            if (dv.args('srcMultiple') == true) {
              toReturn = d3[d3method](data, function (dis) {
                return dis[dv.args("key['multiple']")];
              }); //to array because its easier to deal with

              toReturn = Array.from(toReturn, function (_ref) {
                var name = _ref[0],
                    value = _ref[1];
                return {
                  parent: name,
                  values: value
                };
              });
            }

            break;
          }

        default:
          {
            toReturn = data;
            break;
          }
      }

      return toReturn;
    };

    _proto.kill = function kill(errorMessage) {
      var dv = this;
      var errorFront = 'Sorry, unable to display data.' + (_classPrivateFieldLooseBase(dv, _is_debuggy)[_is_debuggy] ? '<br> Please check the console for more details' : '');
      dv.theUi.classed("" + CLASS_READY, true);

      if (!dv.theUi.select("." + CLASS_BODY + "." + CLASS_ERROR)) {
        dv.theUi.append('div').attr('class', CLASS_BODY + " " + CLASS_ERROR).html(errorFront);
      }

      throw new Error(errorMessage);
    };

    _proto.renderHeader = function renderHeader() {
      var dv = this;
      dv.theUi.append('div').lower().attr('class', "" + CLASS_HEADER);

      if (dv.args('title')) {
        dv.header.append('span').attr('class', "" + CLASS_TITLE).text(dv.args('title'));
      }

      if (dv.args('description')) {
        dv.header.append('span').attr('class', "" + CLASS_DESCRIPTION).text(dv.args('description'));
      }

      dv.header.style('padding-top', function () {
        dv.margin.top / dv.args('height') * 50 + "%";
      }).style('padding-left', function () {
        dv.margin.left / dv.outer('width') * 100 + "%";
      }).style('padding-right', function () {
        dv.margin.right / dv.outer('width') * 100 + "%";
      }).transition(dv.transition).styleTween('opacity', function () {
        dv.interpolate(0, 1);
      });
    };

    _proto.renderContent = function renderContent() {
      var dv = this;
      dv.theUi.append('div').attr('class', "" + CLASS_BODY).style('padding-bottom', function () {
        return dv.outer('height') / dv.outer('width') * 100 + "%";
      }).style('position', 'relative'); //render the rest l8er so it dont get in the way of performance

      dv.addListeners(dv);
    };

    _proto.renderSVG = function renderSVG() {
      var dv = this;
      dv.content.append('svg').attr('class', CLASS_SVG + "\n\t\t\t\t" + dv.createClass('type') + "-" + dv.args('type') + "\n\t\t\t\t" + dv.createClass('base') + "-" + dv.baseType + "\n\t\t\t\t" + dv.createClass('no', 'has', dv.args('colorPalette').length > 0 || dv.args('linePointsColor') !== null || dv.args('lineColor') !== null) + "-palette\n\t\t\t\t" + dv.createClass('no', 'has', !dv._is_base('pie') && (dv.args('xTicks') || dv.args('yTicks'))) + "-ticks\n\n\t\t\t\t" + dv.createClass('no', 'has', dv.args('colorLegend')) + "-legend\n\n\t\t\t\t" + dv.createClass("no-label", "pi-label-style-" + dv.args('piLabelStyle'), dv.args('colorLegend') && dv.args('piLabelStyle') !== null) + "\n\t\t\t");
      dv.svg.attr('id', this.selector + "-svg").style('position', 'absolute').style('top', '0').style('left', '0').style('bottom', '0').style('right', '0').style('margin', 'auto').attr('version', '1.1').attr('x', '0px').attr('y', '0px').attr('viewBox', "0 0 " + dv.outer('width') + " " + dv.outer('height')).attr('preserveAspectRatio', 'xMidYMid meet').attr('xml:space', 'preserve').attr('width', dv.outer('width')).attr('height', dv.outer('height')); //container for bitches

      dv.svg.append('g').attr('class', CLASS_G_CONTAINER).attr('font-size', dv.args('fontSize')).style('line-height', 1).attr('transform', "translate( " + dv.margin.left + " , " + dv.margin.top + " )");
      dv._has_labels && dv.renderLabels();

      if (dv._has_ticks()) {
        dv.renderRulers();
        dv._has_grid && dv.renderGrid();
      }

      dv.logStyleWarns();
      dv.draw();
    };

    _proto.renderLabels = function renderLabels() {
      var dv = this;

      _classPrivateFieldLooseBase(dv, _renderAG)[_renderAG](CLASS_LABELS);

      Coordinates.forEach(function (axisName) {
        if (dv._has_ticks(axisName)) {
          dv.labels.append('text').attr('class', CLASS_LABEL_PREFIX + "-" + axisName).attr('y', function () {
            return dv.Label(axisName).offset('y');
          }).attr('x', function () {
            return dv.Label(axisName).offset('x');
          }).attr('font-size', '1em').attr('text-anchor', 'middle').attr('fill', 'currentColor').attr('opacity', 0).text(dv.args(axisName + 'Label')).attr('transform', function () {
            if (axisName == 'y') {
              return 'rotate(-90)';
            }
          }).transition(dv.transition).attr('opacity', 1);
        }
      });
    };

    _proto.renderTicks = function renderTicks(tickContainer, isGrid) {
      isGrid = isGrid || false;

      if (!tickContainer) {
        return;
      }

      var dv = this;
      Coordinates.forEach(function (axisName) {
        if (dv._has_ticks(axisName)) {
          var alignString = dv.args(axisName + "Align"); //ruler/grid

          tickContainer.append('g').attr('class', "\n\t\t\t\t\t\t\t" + dv.createClass(CLASS_RULER_PREFIX + "-" + axisName, CLASS_GRID_PREFIX + "-" + axisName, isGrid, false) + "\n\t\t\t\t\t\t\t" + dv.createClass(CLASS_RULER_ALIGN_PREFIX + "-" + alignString, CLASS_GRID_INC_PREFIX + "-" + dv.args(axisName + "GridIncrement"), isGrid, false) + "\n\t\t\t\t\t\t").attr('transform', function () {
            var transformCoord;

            switch (axisName + ' ' + alignString) {
              case 'x bottom':
                transformCoord = "0 , " + dv.args('height');
                break;

              case 'y right':
                transformCoord = dv.args('width') + " , 0";
                break;

              default:
                transformCoord = '0 , 0';
            }

            if (transformCoord) return 'translate(' + transformCoord + ')';
          });
        }
      });
    };

    _proto.renderRulers = function renderRulers() {
      var dv = this;

      _classPrivateFieldLooseBase(dv, _renderAG)[_renderAG](CLASS_RULERS);

      dv.rulers.attr('font-size', dv.args('textTicksSize') + 'em');
      dv.renderTicks(dv.rulers, false);
    };

    _proto.renderGrid = function renderGrid() {
      var dv = this;

      _classPrivateFieldLooseBase(dv, _renderAG)[_renderAG](CLASS_GRIDS);

      dv.grid.attr('font-size', dv.args('textTicksSize') + 'em');
      dv.renderTicks(dv.grid, true);
    };

    _proto.renderToolTip = function renderToolTip() {
      var dv = this;
      dv.svg.append('circle').attr('class', "" + CLASS_CURSOR_STALKER);
      dv.svg.call(dv.Tip.getCall());
    };

    _proto.logStyleWarns = function logStyleWarns() {
      var dv = this;

      if (_classPrivateFieldLooseBase(dv, _is_debuggy)[_is_debuggy]) {
        if (dv.args('width') == DataVisualizer.defaults('width') && dv.args('height') == DataVisualizer.defaults('height') && dv.completeData > OPTIMAL_DEFAULT_DATA_COUNT) {
          console.debug(dv.selector + ' Width and height was not adjusted. graph elements may not fit in the canvas');
        } else if (dv.args('width') < DataVisualizer.defaults('width') && dv.args('height') < DataVisualizer.defaults('height')) {
          console.debug(dv.selector + ' set canvas width and or height may be too small.\n Tip: The given height and width are not absolute and act more like aspect ratios. svgs are responsive and will shrink along with content.');
        }

        if (JSON.stringify(dv.args('margin')) == JSON.stringify(DataVisualizer.defaults('margin')) && dv._has_labels() && dv._has_ticks()) {
          console.debug(dv.selector + ' text may overlap. margins may need to be modified');
        }
      }
    };

    _proto.readyData = function readyData() {
      var dv = this;
      var toReturn;

      if (dv._has_nested_data) {
        toReturn = dv.theData(true, 'group');
      } else {
        //fake it so it still wiorks
        toReturn = [{
          parent: 'flat',
          values: dv.theData(true)
        }];
      }

      return toReturn;
    };

    _proto.drawAxes = function drawAxes() {
      var dv = this;
      Coordinates.forEach(function (axisName) {
        if (dv._has_ticks(axisName)) {
          dv.ruler(axisName).transition(dv.transition).call(dv.Axis(axisName).getCall(false)).attr('font-family', null).attr('font-size', null);

          if (dv._has_grid(axisName)) {
            dv.gridCol(axisName).transition(dv.transition).call(dv.Axis(axisName).getCall(true));
            dv.gridCol(axisName).selectAll('g').classed('grid', true).filter(function (dis, i) {
              //IM HERE FUCKER
              var isAligned = false;
              dv.ruler(axisName).selectAll('g').each(function (tik) {
                //if current looped tik matches dis grid data, add the class boi
                if (tik == dis) {
                  isAligned = true;
                }
              });
              return isAligned;
            }).classed('tick-aligned', true);
          }
        }
      });
    };

    _proto.drawArt = function drawArt() {
      var dv = this;

      _classPrivateFieldLooseBase(dv, _drawGraphSet)[_drawGraphSet](CLASS_GRAPH);

      if (dv._is_base('line')) {
        dv.drawArtLine();
      }

      dv.drawArtShapes();
    };

    _proto.drawArtLine = function drawArtLine() {
      var dv = this;
      dv.graphs.append('path').lower().attr('class', CLASS_GRAPH_LINE + "\n\t\t\t\t" + dv.createClass('no', 'has', dv.args('lineColor') !== null) + "-color").attr('fill', 'none').attr('stroke-width', dv.args('lineWeight')).attr('stroke-linejoin', 'round').attr('stroke-dasharray', dv.args('lineDash')).attr('stroke-opacity', 1).attr('stroke-dasharray', '0,0').attr('stroke', dv.args("lineColor")) // .attr('d',getLinePath(false,false))
      .transition(dv.transition).attrTween('d', function (dat) {
        return dv.interpolate(dv.Line(dat.values).path(false, true), dv.Line(dat.values).path(false, false));
      });

      if (dv.args('lineFill')) {
        dv.graphs.append('path').lower().attr('class', CLASS_GRAPH_FILL + "\n\t\t\t\t\t" + dv.createClass('no', 'has', dv.args("lineFillColor") !== null || dv.args("lineColor") !== null) + "-color").attr('fill', dv.args("lineFillColor") || dv.args("lineColor")).attr('fill-opacity', dv.args("lineFillOpacity")).transition(dv.transition).attrTween('d', function (dat) {
          return dv.interpolate(dv.Line(dat.values).path(true, true), dv.Line(dat.values).path(true, false));
        });
      }
    };

    _proto.drawArtShapes = function drawArtShapes() {
      var dv = this;
      var shape = dv.itemShapes.data(function (d) {
        return d.values;
      });
      shape.exit().transition(dv.transition).style('opacity', 0).remove();
      var shape_enter = shape.enter().append(Shape.tag(dv)).attr('class', function (dis) {
        return CLASS_ITEM + "\n\t\t\t\t\t" + CLASS_ITEM_BLOB + "\n\t\t\t\t\tdata-name-" + Str.toCamelCase(dv._get(dis, dv.args("key[0]"))) + "\n\t\t\t\t\t";
      }).attr(Shape.coordAttr(dv, 'x'), function (dis, i) {
        return dv.Shape(dis, i).offset('x', true);
      }).attr(Shape.coordAttr(dv, 'y'), function (dis, i) {
        return dv.Shape(dis, i).offset('y', true);
      }).attr('r', function (dis, i) {
        return dv.Shape(dis, i).radius(true);
      }).attr('width', function (dis, i) {
        return dv.Shape(dis, i).size('x', true);
      }).attr('height', function (dis, i) {
        return dv.Shape(dis, i).size('y', true);
      }).attr('fill-opacity', function (dis, i) {
        return dv.Shape(dis, i).areaOpacity();
      }).attr('opacity', function (dis, i) {
        return dv.Shape(dis, i).opacity(true);
      });
      shape.merge(shape_enter).transition(dv.args("transition")) //DO NOT
      .attr(Shape.coordAttr(dv, 'x'), function (dis, i) {
        return dv.Shape(dis, i).offset('x', false);
      }).attr(Shape.coordAttr(dv, 'y'), function (dis, i) {
        return dv.Shape(dis, i).offset('y', false);
      }).attr('r', function (dis, i) {
        return dv.Shape(dis, i).radius();
      }).attr('width', function (dis, i) {
        return dv.Shape(dis, i).size('x');
      }).attr('height', function (dis, i) {
        return dv.Shape(dis, i).size('y');
      }).attr('opacity', function (dis, i) {
        return dv.Shape(dis, i).opacity();
      }).attr('stroke-width', 1).attr('stroke', function (dis, i) {
        return dv.Shape(dis, i).palette();
      }).attr('fill', function (dis, i) {
        return dv.Shape(dis, i).palette();
      }).attrTween('d', Shape.dTween(dv)); //tooltip

      if (dv.args("tooltipEnable")) ;
    };

    _proto.drawStamps = function drawStamps() {
      var dv = this;

      _classPrivateFieldLooseBase(dv, _drawGraphSet)[_drawGraphSet](CLASS_STAMPS);

      dv._has_polyline && dv.drawStampsPolyline();
      dv._has_text && dv.drawStampsItems();
    };

    _proto.drawStampsPolyline = function drawStampsPolyline() {
      var dv = this;
      var poly = dv.itemPolyLine.data(function (d) {
        return d.values;
      });
      poly.exit().transition(dv.transition).attr('fill', 'transparent').attr('stroke', 'transparent').remove();
      var poly_enter = poly.enter().append('polyline').attr('class', function (dis) {
        return CLASS_ITEM + "\n\t\t\t\t" + CLASS_ITEM_POLYLINE + "\n\t\t\t\tdata-name-" + Str.toCamelCase(dv._get(dis, dv.args("key[0]")));
      });
      poly.merge(poly_enter).transition(dv.duration).attrTween('stroke-opacity', function () {
        dv.interpolate(0.75);
      }).attrTween('points', function (dis, i) {
        var start = [],
            end = [];

        if (dv.args('piLabelStyle') == 'linked') {
          //in pie, initial means it starts at zero but we dont want that so dont set the initial to true
          start = [dv.Pi(dis, i).path(true, 'centroid', 1, false), //first coord is centroid of our pie boi
          dv.Pi(dis, i).path(true, 'centroid', 1, false)], end = [dv.Pi(dis, i).path(true, 'centroid', 1, false), dv.Pi(dis, i).path(false, 'centroid', 2.25, false)];
        }

        return dv.interpolate(start, end);
      });
    };

    _proto.drawStampsItems = function drawStampsItems() {
      var dv = this;
      var text = dv.itemStamps.data(function (d) {
        return d.values;
      });
      text.exit().transition(dv.transition).attr('fill', 'transparent').attr('stroke', 'transparent').remove();
      var text_enter = text.enter().append('text').attr('line-height', 1.25).attr('stroke-width', 1).attr('class', function (dis, i) {
        var toReturn = CLASS_ITEM + "\n\t\t\t\t" + CLASS_ITEM_STAMP + "\n\t\t\t\tdata-name-" + Str.toCamelCase(dv._get(dis, dv.args("key[0]")));
        return toReturn;
      });
      var merge_text = text.merge(text_enter);
      CoordDatumKeys.forEach(function (keyKey) {
        if (dv.args("stamp" + keyKey)) {
          text_enter.append('tspan').attr('class', function (dis, i) {
            return CLASS_ITEM_STAMP_DATA + "\n\t\t\t\t\t\t" + CLASS_ITEM_STAMP_DATA + "-" + keyKey + "\n\t\t\t\t\t\tdata-" + keyKey + "-" + dv.args("key[" + keyKey + "]");
          }).attr('dominant-baseline', 'middle').attr('text-anchor', function (dis, i) {
            return dv.Stamp(dis, i).textAnchor;
          }).attr('font-size', function () {
            var toReturn = null;

            if (keyKey == 0) {
              toReturn = dv.args('textNameSize') + "em";
            } else {
              toReturn = dv.args('textValueSize') + "em";
            }

            return toReturn;
          }).attr('x', function (dis, i) {
            return dv.Stamp(dis, i).baselineShift('x', keyKey);
          }).attr('y', function (dis, i) {
            return dv.Stamp(dis, i).baselineShift('y', keyKey);
          }).attr('font-weight', function (dis, i) {
            return keyKey == 1 ? 700 : 400;
          });
          merge_text.select("tspan." + CLASS_ITEM_STAMP_DATA + "-" + keyKey).text(function (dis, i) {
            return dv._get(dis, dv.args("key[" + keyKey + "]"));
          });
        }
      });
      merge_text.classed(CLASS_LIGHT_TEXT, function (dis, i) {
        return dv.Stamp(dis, i).onLightPalette();
      }).transition(dv.transition).attr('stroke', function (dis, i) {
        return dv.Stamp(dis, i).stroke();
      }).attrTween('transform', function (dis, i) {
        return dv.interpolate("translate(" + dv.Stamp(dis, i).offset('x', true) + "," + dv.Stamp(dis, i).offset('y', true) + ")", "translate(" + dv.Stamp(dis, i).offset('x', false) + "," + dv.Stamp(dis, i).offset('y', false) + ")");
      }).styleTween('opacity', dv.interpolate(0, 1));
    };

    _proto.drawLegends = function drawLegends() {
      var _this = this;

      var dv = this;

      _classPrivateFieldLooseBase(dv, _renderAG)[_renderAG](CLASS_LEGENDS);

      var legend = dv.legendItems.data(dv.domain('color'), function (d) {
        return d;
      });
      legend.exit().transition(dv.transition).attr('opacity', 0).remove();
      var legend_enter = legend.enter().append('g').attr('class', "" + CLASS_LEGENDS_ITEM);
      legend_enter.attr('opacity', 0).attr('font-size', dv.args('textLegendSize') + 'em').attr('transform', function (dis, i) {
        return 'translate(0, ' + i * dv.legendSize + ')';
      });
      legend_enter.append('rect').attr('class', "" + CLASS_LEGENDS_ITEM_SHAPE).attr('width', dv.legendSize * 0.75).attr('height', dv.legendSize * 0.75).attr('fill', function (dis) {
        return dv.scale('color', dis);
      }).attr('stroke', dv.args("colorBackground"));
      legend_enter.append('text').attr('class', "" + CLASS_LEGENDS_ITEM_TEXT).classed(CLASS_LIGHT_TEXT, ColorIsDark(dv.args('colorBackground'))).text(function (dis) {
        return dis;
      }).attr('dominant-baseline', 'middle').attr('x', dv.legendSize).attr('y', dv.legendSize * 0.375).attr('stroke', dv.args('colorBackground'));
      var adjustedLegends = false;
      var legend_merge = legend.merge(legend_enter); //go around d3 because wtf ??

      legend_merge.select(function () {
        if (!adjustedLegends) {
          dv.legends.attr('transform', function () {
            return "translate(" + dv.Legend().offset('x') + "," + dv.Legend().offset('y') + ")";
          });
          adjustedLegends = true;
        }

        return _this;
      });
      legend_merge.transition(dv.transition).attr('opacity', 1);
    };

    _proto.draw = function draw(data) {
      var dv = this;
      data = data || dv.drawnData;
      dv.drawnData = data; // ok do the thing now

      _classPrivateFieldLooseBase(dv, _is_debuggy)[_is_debuggy] && console.info('\n', dv.selector, '(' + dv.args('title') + ')', '-------------------------------------------------------------------', '\n', 'calculated shit', dv, '\n', 'data', _classPrivateFieldLooseBase(dv, _data)[_data], '\n', 'args', dv.args(), '\n', '\n');
      /******** AXIS + GRID ********/

      if (dv._is_base(['bar', 'line', 'scatter'])) {
        dv._has_ticks && dv.drawAxes();
      }
      /******** GRAPH ********/


      dv.drawArt();
      /******** TEXT STAMPS ********/

      dv._has_text && dv.drawStamps();
      /******** LEGEND ********/

      dv.args('colorLegend') && dv.drawLegends();
    };

    _proto.label = function label(axis) {
      if (axis) {
        return this.labels.select("." + CLASS_LABEL_PREFIX + "-" + axis);
      } else {
        return this.labels();
      }
    };

    _proto.ruler = function ruler(axis) {
      if (axis) {
        return this.rulers.select("." + CLASS_RULER_PREFIX + "-" + axis);
      } else {
        return this.rulers();
      }
    };

    _proto.gridCol = function gridCol(axis) {
      if (axis) {
        return this.grid.select("." + CLASS_GRID_PREFIX + "-" + axis);
      } else {
        return this.grid;
      }
    };

    _proto.load = function load() {
      var dv = this; // data is embedded on the page oooooo

      if (dv.args('srcPath').indexOf(window.location.href) > -1) {
        var jsonSelector = document.getElementById(Str.hash(dv.args('srcPath'))).innerHTML;

        if (Str.isValidJSONString(jsonSelector)) {
          var dataIsJSON = JSON.parse(jsonSelector);
          dv.init(dataIsJSON);
        } else {
          dv.kill('Data input may not be valid. Please check and update the syntax');
        } //o its not ok we normal now

      } else {
        switch (Str.fileExtension(dv.args('srcPath'))) {
          case 'csv':
          case 'dsv':
          case 'tsv':
          case 'xml':
            d3[Str.fileExtension(dv.args('srcPath'))](dv.args('srcPath'), function (d) {
              return d;
            }).then(function (retrievedData) {
              dv.init(retrievedData);
            })["catch"](function (error) {
              dv.kill(error);
            });
            break;

          default:
            d3.json(dv.args('srcPath'), function (d) {
              return d;
            }).then(function (retrievedData) {
              dv.init(retrievedData);
            })["catch"](function (error) {
              dv.kill(error);
            });
            break;
        }
      }
    };

    _proto.init = function init(retrievedData) {
      var dv = this;
      dv.theUi.classed(CLASS_READY + "\n\t\t\t\t" + dv.createClass('', 'dark', ColorIsDark(dv.args('colorBackground'))), true).style('background-color', dv.args('colorBackground')); //set data

      dv.completeData = _classPrivateFieldLooseBase(dv, _parseData)[_parseData](retrievedData);
      dv.renderHeader();
      dv.renderContent();
    };

    _proto.addListeners = function addListeners(dv) {
      dv = dv || this;
      window.addEventListener('scroll', dv.handlerScroll);
      window.addEventListener('resize', dv.handlerResize);
    };

    _createClass(DataVisualizer, [{
      key: "_has_nested_data",
      get: function get() {
        //different from srcMultiple ok? this is to make sure we returning the data in the same level or what
        return this.args('srcMultiple') && !this._is_base('pie');
      }
    }, {
      key: "_name_is_num",
      get: function get() {
        return this.args('nameIsNum');
      }
    }, {
      key: "_has_text",
      get: function get() {
        if (this.args('stamp0') || this.args('stamp1')) {
          return true;
        } else {
          return false;
        }
      }
    }, {
      key: "_has_both_text",
      get: function get() {
        if (this._has_text && this.args('stamp0') && this.args('stamp1')) {
          return true;
        } else {
          return false;
        }
      }
    }, {
      key: "_has_polyline",
      get: function get() {
        return this._is_base('pie') && this.args('piLabelStyle') == 'linked';
      }
    }, {
      key: "_has_tooltip",
      get: function get() {
        return this.args('tooltipEnable');
      }
    }, {
      key: "drawnData",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _data)[_data].displayed.length ? _classPrivateFieldLooseBase(this, _data)[_data].displayed : _classPrivateFieldLooseBase(this, _data)[_data].complete;
      },
      set: function set(data) {
        _classPrivateFieldLooseBase(this, _data)[_data].displayed = data;
      }
    }, {
      key: "completeData",
      get: function get() {
        return _classPrivateFieldLooseBase(this, _data)[_data].complete;
      },
      set: function set(data) {
        _classPrivateFieldLooseBase(this, _data)[_data].complete = data;
      }
    }, {
      key: "baseType",
      get: function get() {
        return this.args('type').split('_')[0].toLowerCase();
      }
    }, {
      key: "fontSize",
      get: function get() {
        return parseFloat(this.args('fontSize'));
      }
    }, {
      key: "legendSize",
      get: function get() {
        return this.args('textLegendSize') * this.fontSize * 2;
      }
    }, {
      key: "margin",
      get: function get() {
        var dv = this;
        return {
          top: ValidMargin(dv.args('margin[0]')) || ValidMargin(dv.args('margin')) || 0,
          right: ValidMargin(dv.args('margin[1]')) || ValidMargin(dv.args('margin[0]')) || ValidMargin(dv.args('margin')) || 0,
          bottom: ValidMargin(dv.args('margin[2]')) || ValidMargin(dv.args('margin[0]')) || ValidMargin(dv.args('margin')) || 0,
          left: ValidMargin(dv.args('margin[3]')) || ValidMargin(dv.args('margin[1]')) || ValidMargin(dv.args('margin[0]')) || ValidMargin(dv.args('margin')) || 0
        };
      }
    }, {
      key: "outerWidth",
      get: function get() {
        return this.outer('width');
      }
    }, {
      key: "outerHeight",
      get: function get() {
        return this.outer('height');
      }
    }, {
      key: "transition",
      get: function get() {
        return d3.transition().duration(this.args('transition')).ease(d3.easeLinear);
      }
    }, {
      key: "Tip",
      get: function get() {
        return new Tip(this, CLASS_TOOLTIP);
      }
    }, {
      key: "theUi",
      get: function get() {
        return d3.select(this.selector);
      }
    }, {
      key: "header",
      get: function get() {
        return this.theUi.select("." + CLASS_HEADER);
      }
    }, {
      key: "content",
      get: function get() {
        return this.theUi.select("." + CLASS_BODY);
      }
    }, {
      key: "svg",
      get: function get() {
        return this.content.select("." + CLASS_SVG);
      }
    }, {
      key: "g",
      get: function get() {
        return this.svg.select("." + CLASS_G_CONTAINER);
      }
    }, {
      key: "labels",
      get: function get() {
        return this.g.select("." + CLASS_LABELS);
      }
    }, {
      key: "rulers",
      get: function get() {
        return this.g.select("." + CLASS_RULERS);
      }
    }, {
      key: "grid",
      get: function get() {
        return this.g.select("." + CLASS_GRIDS);
      }
    }, {
      key: "graphs",
      get: function get() {
        return this.g.selectAll("." + CLASS_GRAPH);
      }
    }, {
      key: "line",
      get: function get() {
        return this.graphs.select("." + CLASS_GRAPH_LINE);
      }
    }, {
      key: "lineFill",
      get: function get() {
        return this.graphs.select("." + CLASS_GRAPH_FILL);
      }
    }, {
      key: "itemShapes",
      get: function get() {
        return this.graphs.selectAll("." + CLASS_ITEM_BLOB);
      }
    }, {
      key: "texts",
      get: function get() {
        return this.g.select("." + CLASS_STAMPS);
      }
    }, {
      key: "itemPolyLine",
      get: function get() {
        return this.texts.selectAll("." + CLASS_ITEM_POLYLINE);
      }
    }, {
      key: "itemStamps",
      get: function get() {
        return this.texts.selectAll("." + CLASS_ITEM_STAMP);
      }
    }, {
      key: "legends",
      get: function get() {
        return this.g.select("." + CLASS_LEGENDS);
      }
    }, {
      key: "legendItems",
      get: function get() {
        return this.legends.selectAll("." + CLASS_LEGENDS_ITEM);
      }
    }, {
      key: "legendItemsShape",
      get: function get() {
        return this.legendItems.select("." + CLASS_LEGENDS_ITEM_SHAPE);
      }
    }, {
      key: "legendItemsText",
      get: function get() {
        return this.legendItems.select("." + CLASS_LEGENDS_ITEM_TEXT);
      }
    }, {
      key: "cursorStalker",
      get: function get() {
        return this.svg.select("." + CLASS_CURSOR_STALKER);
      }
    }, {
      key: "tooltip",
      get: function get() {
        return this.theUi.select("." + CLASS_TOOLTIP);
      }
    }, {
      key: "handlerScroll",
      get: function get() {
        var dv = this;
        return function (e) {
          var graphPosition = dv.elem.getBoundingClientRect().top;

          if (graphPosition < window.innerHeight * 0.5 && !dv.isLoaded) {
            dv.isLoaded = true;
            setTimeout(function () {
              dv.renderSVG();
              dv._has_tooltip && dv.renderToolTip();
            }, dv.args('delay'));
          }
        };
      }
    }, {
      key: "handlerResize",
      get: function get() {
        var dv = this;
        return function (e) {
          clearTimeout(dv.resizeInt);
          dv.resizeInt = setTimeout(function () {
            dv.draw();
          }, 300);
        };
      }
    }]);

    return DataVisualizer;
  }();

  function _get_is_debuggy() {
    return document.body.classList.contains('logged-in');
  }

  function _deepGet2(obj, stringedKeys, isNum) {
    isNum = isNum || false;

    if (!stringedKeys) {
      return;
    }

    var splitString = stringedKeys.toString().replace(/('|"|\s|\t|\n|\r)/g, '') //quotes and spaces
    .replace(/\[(.+?)\]/, '.$1') //brackets
    .split('.'); //split
    //remove mt

    splitString.forEach(function (key, i) {
      key == '' && splitString.splice(i, 1);
    });

    var multiIndex = function multiIndex(obj, is) {
      var toReturn = null; // console.warn('init multi',obj,is,typeof obj);

      if (is.length > 0 && typeof obj === 'object') {
        //if it gooes 0 u ded
        toReturn = multiIndex(obj[is[0]], is.slice(1));
      } else {
        toReturn = isNum == true ? parseFloat(obj.replace(/\D/g, '')) : obj;
      }

      return toReturn;
    },
        value = multiIndex(obj, splitString);

    if (isNum == true && isNaN(value)) {
      console.warn("data with the key source of '" + stringedKeys + "' was passed as numeric but is not.");
    } // console.log(`%c final value to return from ${stringedKeys}: \n${value}`,"color: pink; font-family:sans-serif; font-size: 9px");


    return value;
  }

  function _renderAG2(classToAdd) {
    var dv = this;
    dv.g.append('g').attr('class', classToAdd);
  }

  function _parseData2(dataToParse) {
    var dv = this; // heck if src key exists

    var toReturn;

    if (dv.args('srcKey')) {
      if (dv._get(dataToParse, dv.args('srcKey'))) {
        toReturn = dv._get(dataToParse, dv.args('srcKey'));
      } else {
        dv.kill(dv.selector + " provided source key is invalid");
      }
    } else {
      toReturn = dataToParse;
    } // convert to single level for easy AAAAAAAAA-ing


    if (dv.args('srcMultiple') == true && dv.args('srcPreNest')) {
      var arrPreNest = [],
          appendParentProp = function appendParentProp(parentKey) {
        //add parent key to proops
        toReturn[parentKey].forEach(function (dis, i) {
          toReturn[parentKey][i]._parent = parentKey;
          arrPreNest.push(toReturn[parentKey][i]);
        });
      }; //if they are array


      if (Object.prototype.toString.call(toReturn) === '[object Array]') {
        toReturn.forEach(function (par, key) {
          appendParentProp(key);
        }); //if they are kwan have keys
      } else {
        Object.keys(toReturn).forEach(function (key) {
          //add parent key to proops
          appendParentProp(key);
        });
      }

      toReturn = arrPreNest;
    } //filter data that has null value


    toReturn = toReturn.filter(function (dis, i) {
      var toInclude = true;
      DatumKeys.forEach(function (keyKey) {
        var setKey = dv.args("key['" + keyKey + "']");

        if (setKey && dv._get(dis, setKey) == null) {
          toInclude = false;

          if (_classPrivateFieldLooseBase(dv, _is_debuggy)[_is_debuggy]) {
            var humanForKey = keyKey == 0 ? 'name' : keyKey == 1 ? 'value' : keyKey;
            console.warn(dv.selector + " datum index '" + i + "' was filtered.\ndatum does not have data for the key '" + setKey + "', which is set as the property for '" + humanForKey + "'");
          }
        }
      });

      if (toInclude) {
        return dis;
      }
    }); //sort data 0 so that it doesnt go forward then backward then forward on the graph which is weird

    if (dv.args('nameIsNum') == true) {
      var sortable = [];

      for (var i = 0; i < toReturn.length; i++) {
        if (toReturn[i]) {
          sortable.push(toReturn[i]);
        }
      }

      sortable.sort(function (a, b) {
        return dv._get(a, dv.args('key.0'), true) - dv._get(b, dv.args('key.0'), true);
      });
      toReturn = sortable;
    }

    if (!toReturn.length) {
      dv.kill("Data for " + dv.selector + " was filtered and all items are invalid for visualizing. check provided data keys and make sure they are correct");
    }

    return toReturn;
  }

  function _drawGraphSet2(classPrefix) {
    var dv = this;
    var graphSet = dv.g.selectAll("g." + classPrefix).data(dv.readyData(), function (dat) {
      return dat.parent;
    });
    var graphSet_exit = graphSet.exit();
    graphSet_exit.transition(10) //DO NOT
    .style('opacity', 0).remove();
    var graphSet_enter = graphSet.enter().append('g').attr('class', function (dat) {
      return classPrefix + "\n\t\t\t\t\t" + dv.createClass('', "data-group-" + dat.parent + " " + classPrefix + "-set", dat.parent && dat.key);
    });
    graphSet_enter.attr('transform', function (dis, i) {
      return dv._is_base('pie') ? "translate( " + dv.Pi(dis, i).offset('x') + " , " + dv.Pi(dis, i).offset('y') + " )" : '';
    });
    var graphSet_merge = graphSet.merge(graphSet_enter);
    this.savegraphSets(classPrefix, {
      root: graphSet,
      enter: graphSet_enter,
      merge: graphSet_merge,
      exit: graphSet_exit
    });
  }

  Object.defineProperty(DataVisualizer, _deepGet, {
    value: _deepGet2
  });

  return DataVisualizer;

}));
//# sourceMappingURL=dataVisualizer.umd.js.map
