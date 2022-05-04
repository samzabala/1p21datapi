import Component from './../util/template-component.js';
import Shape from './shape.js';
import { ToOppoAxis, ToSide } from './../util/helpers.js';

class Line extends Component {
	constructor(dv, data) {
		super(dv, {
			data: data,
		});
	}
	get axisToFill() {
		return this.dv.args('xData') == 0 ? 'x' : 'y'; //fill to where name data is at
	}

	get style() {
		let theString;
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

	path(isArea, initial) {
		if (!this.data) {
			return;
		}

		initial = initial || false;

		const dv = this.dv;
		const i = this.i;
		const d3PathType = isArea ? 'area' : 'line';

		const path = d3[d3PathType]();

		if (d3PathType == 'area') {
			//name coord, value coord, fill coordinate
			const aCord = {
				//default is top
				name: this.axisToFill, //x
				value: `${ToOppoAxis(this.axisToFill)}1`, //y
				fill: `${ToOppoAxis(this.axisToFill)}0`, //initial of data name is the bottom of the fill
			};

			path[aCord.name]((dis, i) => {
				return new Shape(dv, dis, i).offset(this.axisToFill, initial);
			})
				[aCord.value]((dis, i) => {
					return new Shape(dv, dis, i).offset(
						ToOppoAxis(this.axisToFill),
						initial
					);
				})
				[aCord.fill]((dis, i) => {
					return dv.args(`${this.axisToFill}Align`) == 'bottom' ||
						dv.args(`${this.axisToFill}Align`) == 'right'
						? dv.args(ToSide(this.axisToFill))
						: 0;
				});
		} else {
			path.x((dis, i) => {
				return new Shape(dv, dis, i).offset('x', initial);
			}).y((dis, i) => {
				return new Shape(dv, dis, i).offset('y', initial);
			});
		}

		path.curve(d3[this.style]);

		return path(this.data);
	}
}

export default Line;
