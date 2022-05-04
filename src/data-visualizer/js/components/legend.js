import Component from './../util/template-component.js';
import { ToSide, ToOppoAxis } from './../util/helpers.js';

const OPTIMAL_LABEL_OFFSET_MULTIPLIER = 0.875;

class Legend extends Component {
	constructor(dv, unit) {
		super(dv, {
			unit: unit,
			height: 0,
		});
	}

	offset(coord) {
		const dv = this.dv;

		let offset = 0,
			length = dv.legends.nodes()[0].getBoundingClientRect()[ToSide(coord)], // .8
			shifter = () => {
				var value = 0,
					multiplier = 1;

				switch (dv.baseType) {
					case 'pie':
						multiplier = -1;
						value =
							coord == 'x'
								? length + parseFloat(dv.args('fontSize'))
								: length * 0.5;
						break;
					default:
						if (
							dv.args(ToOppoAxis(coord) + 'Align') == 'left' ||
							dv.args(ToOppoAxis(coord) + 'Align') == 'top'
						) {
							multiplier = -1;
							value = length + parseFloat(dv.args('fontSize'));
							// } else {
							//     value = length * .5;
						}
						break;
				}

				return value * multiplier;
			};

		switch (dv.baseType) {
			case 'pie':
				offset =
					coord == 'x'
						? dv.args(ToSide(coord))
						: dv.args(ToSide(coord)) * 0.5;

				break;
			default:
				if (
					dv.args(ToOppoAxis(coord) + 'Align') == 'left' ||
					dv.args(ToOppoAxis(coord) + 'Align') == 'top'
				) {
					offset = dv.args(ToSide(coord));
					// } else{
					//     offset = dv.args(ToSide(coord)) * .5;
				}
				break;
		}

		// return offset;
		return offset + shifter();
	}
}

export default Legend;
