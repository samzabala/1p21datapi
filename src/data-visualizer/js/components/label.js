import Component from './../util/template-component.js';
import { ToSide } from './../util/helpers.js';

const OPTIMAL_LABEL_OFFSET_MULTIPLIER = 0.875;

class Label extends Component {
	constructor(dv, axisName) {
		super(dv, {
			axisName: axisName,
		});
	}

	offset(coord) {
		let offset = 0;
		const dv = this.dv;
		const axisName = this.axisFromKey;
		//x
		if (coord == 'x') {
			if (axisName == 'x') {
				offset = dv.args(ToSide(axisName)) / 2;
			} else if (axisName == 'y') {
				offset = -(dv.args(ToSide(axisName)) / 2);
			}
			//y
		} else {
			if (axisName == 'x') {
				if (dv.args(`${axisName}Align`) == 'bottom') {
					offset =
						dv.args(ToSide(axisName, true)) +
						dv.margin.bottom * OPTIMAL_LABEL_OFFSET_MULTIPLIER;
				} else {
					offset = -(dv.margin.top * OPTIMAL_LABEL_OFFSET_MULTIPLIER);
				}
			} else if (axisName == 'y') {
				if (dv.args(`${axisName}Align`) == 'right') {
					offset =
						dv.args(ToSide(axisName, true)) +
						(dv.margin.right * OPTIMAL_LABEL_OFFSET_MULTIPLIER +
							dv.fontSize);
				} else {
					offset = -(
						dv.margin.left * OPTIMAL_LABEL_OFFSET_MULTIPLIER -
						dv.fontSize
					);
				}
			}
		}

		return offset;
	}
}

export default Label;
