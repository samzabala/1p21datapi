import Component from './../util/template-component.js';
import Pi from './pi.js';
import { ToOppoAxis, ToSide } from './../util/helpers.js';

class Shape extends Component {
	constructor(dv, dis, i) {
		super(dv, {
			dis: dis,
			i: i,
		});
	}

	static tag(dv) {
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
	}

	static coordAttr(dv, axisName) {
		return dv._is_base(['line', 'scatter']) ? `c${axisName}` : `${axisName}`;
	}

	radius(initial) {
		const dv = this.dv,
			dis = this.dis,
			i = this.i;

		initial = initial || false;

		let radius = initial
			? 0
			: dv._is_base('scatter')
			? (dv.args('areaMin') + dv.args('areaMax')) / 2
			: 5;

		if (!initial) {
			switch (dv.baseType) {
				case 'scatter':
					if (dv.args(`key['area']`)) {
						radius = dv.scale(
							'area',
							dv._get(dis, dv.args(`key['area']`), true)
						);
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
	}

	scaledValue(keyKey) {
		const dv = this.dv,
			dis = this.dis;

		let dataToScale, toReturn;
		if (dv._name_is_num == true && keyKey == 1) {
			dataToScale = dv._get(dis, dv.args(`key['${keyKey}']`), true);
		} else {
			dataToScale = dv._get(dis, dv.args(`key['${keyKey}']`), false);
		}

		toReturn = dv.scale(keyKey, dataToScale);

		return toReturn;
	}

	stroke() {
		let toReturn = 0;

		switch (this.dv.baseType) {
			case 'scatter':
				toReturn = 1;
				break;
			default:
				break;
		}

		return toReturn;
	}

	opacity(initial) {
		const dv = this.dv,
			dis = this.dis,
			i = this.i;
		let toReturn = 1;

		switch (this.dv.baseType) {
			case 'line':
				if (initial) toReturn = 0;
				break;
			default:
				break;
		}

		return toReturn;
	}

	areaOpacity(initial) {
		const dv = this.dv,
			dis = this.dis,
			i = this.i;
		let toReturn = 1;

		switch (this.dv.baseType) {
			case 'scatter':
				toReturn = dv.args(`areaOpacity`);
				break;
			default:
				break;
		}

		return toReturn;
	}

	palette() {
		const dv = this.dv,
			dis = this.dis,
			i = this.i;
		let toReturn = dv.args(`colorPalette`).length
			? dv.scale(`color`, dv._get(dis, dv.args(`key.color`)))
			: [];

		switch (this.dv.baseType) {
			case 'line':
				if (!toReturn.length) {
					toReturn = dv.args(`linePointsColor`) || dv.args(`lineColor`);
				}
				break;
			default:
				break;
		}

		return toReturn;
	}

	static dTween(dv) {
		if (dv.baseType !== 'pie') return;

		return (dis, i) => {
			let currPie = dis.pie;

			return dv.interpolate(currPie.endAngle, currPie.startAngle, (value) => {
				currPie.startAngle = value;
				return new Pi(dv, dis, i).path(true);
			});
		};
	}

	size(coord, initial) {
		initial = initial || false;
		const dv = this.dv;

		if (dv._is_base('pie')) {
			return; //go on pi. git. u have no bidnes herr
		}

		const keyKey = dv.args(`${coord}Data`),
			oppoAlign = dv.args(`${ToOppoAxis(coord)}Align`),
			dimension = dv.dimensionFromAxis(coord),
			scaled = this.scaledValue(keyKey);

		let toReturn = 20;

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
		}

		//cant be a negaative bitch... yet... what the fuq
		if (toReturn < 0) {
			toReturn = 0;
		}

		return toReturn;
	}

	offset(coord, initial) {
		initial = initial || false;

		const dv = this.dv;

		if (dv._is_base('pie')) {
			return; //go on pi. git. u have no bidnes herr
		}
		// same here.. could be the same probably
		const keyKey = dv.args(`${coord}Data`),
			oppoAlign = dv.args(`${ToOppoAxis(coord)}Align`),
			dimension = dv.dimensionFromAxis(coord),
			size = this.size(coord, initial),
			scaled = this.scaledValue(keyKey);
		let toReturn = 0;

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
	}
}

export default Shape;
