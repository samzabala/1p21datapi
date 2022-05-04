import Component from './../util/template-component.js';
import { ToSide, Str } from './../util/helpers.js';

class Axis extends Component {
	constructor(dv, axisName) {
		super(dv, {
			axisName: axisName,
		});
	}

	amount(isGrid) {
		const dv = this.dv;
		const axisName = this.axisName;

		if (isGrid && dv.args(`${axisName}TicksAmount`)) {
			return (
				dv.args(`${axisName}TicksAmount`) * dv.args(`${axisName}GridIncrement`)
			);
		} else {
			return dv.args(`${axisName}TicksAmount`);
		}
	}

	values() {
		const dv = this.dv;
		let values = [],
			currVal = dv.domain(0)[0];
		do {
			values.push(currVal);
			currVal *= 10;
		} while (currVal <= dv.domain(1).values);

		return values;
	}

	getCall(isGrid) {
		isGrid = isGrid || false;

		const dv = this.dv;
		const axisName = this.axisName;
		const d3AxisKey = 'Axis ' + dv.args(`${axisName}Align`);

		let toReturn = d3[Str.toCamelCase(d3AxisKey)](
			dv.scale(dv.args(`${this.axisName}Data`))
		);
		if (
			dv._is_base('scatter') &&
			dv.args(`${axisName}Data`) == 0 &&
			dv._name_is_num == true
		) {
			toReturn.tickValues(this.values());
		}

		if (dv._has_axis_prop('ticksAmount', axisName)) {
			toReturn.ticks(this.amount(isGrid));
		}

		if (isGrid) {
			toReturn.tickSize(dv.args(ToSide(axisName, true)) * -1).tickFormat('');
		} else {
			toReturn.tickFormat((dis, i) => {
				return dv.format(dv.args(`${axisName}Data`))(dis, i);
			});
		}

		return toReturn;
	}
}

export default Axis;
