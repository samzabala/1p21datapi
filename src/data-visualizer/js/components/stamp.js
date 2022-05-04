import Component from '../util/template-component.js';
import Shape from './shape.js';
import Pi from './pi.js';
import { ToOppoAxis, ToSide, Coordinates, ColorIsDark } from '../util/helpers.js';

class Stamp extends Component {
	constructor(dv, dis, i) {
		super(dv, {
			dis: dis,
			i: i,
		});
	}

	static get textPadding() {
		return 2.25;
	}

	length(coord) {
		const dv = this.dv;
		let value = 0;

		if (ToSide(coord) == 'width') {
			value =
				dv.itemStamps.nodes()[this.i].getBBox()[ToSide(coord)] +
				Stamp.textPadding * dv.fontSize;
		} else {
			value =
				dv.fontSize *
				(dv.args('textNameSize') +
					dv.args('textValueSize') +
					Stamp.textPadding);
		}

		return parseFloat(value);
	}

	onLightPalette() {
		const dv = this.dv,
			dis = this.dis,
			i = this.i,
            axisName = dv.axisFromKey(1),
            offset = this.offset(axisName),
			currShape = new Shape(dv, dis, i),
            currSize = currShape.size(axisName),
            currOffset = currShape.offset(axisName),
            currLength = this.length(axisName),
            dimension = dv.args(dv.dimensionFromAxis(axisName))
            ;
		let toReturn = false;

		const isDark = ColorIsDark(currShape.palette());

		switch (dv.baseType) {
            case 'pie':
                if(
                    (
                        dv.args('piLabelStyle') == 'within'
                        && !ColorIsDark(currShape.palette())
                    )
                    || (
                        dv.args('piLabelStyle') == 'linked'
                        && !ColorIsDark(dv.args('colorBackground'))

                    )
                ){
                    toReturn = true;
                }
                break;
			case 'bar':
                switch(dv.args(`${ToOppoAxis(axisName)}Align`)){
                    case 'top':
                    case 'left':
                        if(
                            offset > currOffset + currSize
                            && ColorIsDark(dv.args('colorBackground'))
                        ){
                            toReturn = true;
                        }
                        break;
                    case 'right':
                    case 'bottom':
                        if(
                            offset < currOffset
                            && ColorIsDark(dv.args('colorBackground'))
                        ){
                            toReturn = true;
                        }
                        break;

                }


				// if (
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
                if(!ColorIsDark(dv.args('colorBackground'))){
					toReturn = true;
                }

				break;
		}

		return toReturn;
	}

	get _is_bar_and_within() {
		const dv = this.dv;
		return dv.baseType == 'bar' && dv.args('barTextWithin');
	}

	_shiftPad(coord, initial) {
		const dv = this.dv,
			dis = this.dis,
			i = this.i,
			keyKey = dv.args(`${coord}Data`);

		let toReturn = 0,
			multiplier = 1;

		if (dv.baseType == 'pie') return toReturn;

		switch (this.dv.baseType) {
			case 'scatter':
				break;
			default:
				if (!initial) {
					if (
						dv.args(`${ToOppoAxis(coord)}Align`) == 'bottom' ||
						dv.args(`${ToOppoAxis(coord)}Align`) == 'right'
					) {
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
	}

	_shiftArea(coord, initial) {
		const dv = this.dv,
			dis = this.dis,
			i = this.i,
			keyKey = dv.args(`${coord}Data`),
			currShape = new Shape(dv, dis, i);
		let toReturn = 0,
			multiplier = 1;

		if (dv.baseType == 'pie') return toReturn;

		switch (this.dv.baseType) {
			case 'scatter':
				break;
			default:
				if (!initial) {
					if (
						(!this._is_bar_and_within &&
							(dv.args(`${ToOppoAxis(coord)}Align`) == 'bottom' ||
								dv.args(`${ToOppoAxis(coord)}Align`) == 'right')) ||
						(this._is_bar_and_within &&
							(dv.args(`${ToOppoAxis(coord)}Align`) == 'top' ||
								dv.args(`${ToOppoAxis(coord)}Align`) == 'left'))
					) {
						multiplier = -1;
					}

					if (keyKey !== 0) {
						//smol boys dont need to shift for areas its... gonna be outside no matter whar
						if (coord == 'x') {
							if (
								!this._is_bar_and_within &&
								currShape.size(coord) >=
									dv.dimensionFromAxis(coord) - this.length(coord)
							) {
								toReturn = -this.length(coord);
							} else if (
								this._is_bar_and_within &&
								currShape.size(coord) < this.length(coord)
							) {
								toReturn = -currShape.size(coord);
							}
						} else {
							if (
								(!this._is_bar_and_within &&
									currShape.size(coord) >=
										dv.dimensionFromAxis(coord) -
											this.length(coord)) ||
								(this._is_bar_and_within &&
									currShape.size(coord) < this.length(coord))
							) {
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
	}

	offset(coord, initial) {
		initial = initial || false;

		const dv = this.dv,
			dis = this.dis,
			i = this.i,
			keyKey = dv.args(`${coord}Data`),
			currShape = new Shape(dv, dis, i);

		let toReturn,
			origin = 0,
			shiftPad = this._shiftPad(coord, initial),
			shiftArea = this._shiftArea(coord, initial),
			piInitial,
			piCalcWithInnerRadius,
			piMultiplier = 0,
			piValueArr = [];
		//get origin with no shifting for shapes and bitches first so you know where theyre offseting from. got dammit dumbass weve been through this again and again oh god i hate math
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

				(piCalcWithInnerRadius =
					dv.args('piLabelStyle') == 'linked' ? false : true),
					(piValueArr = new Pi(dv, dis, i).path(
						piCalcWithInnerRadius,
						'centroid',
						piMultiplier,
						piInitial
					));

				toReturn = coord == 'x' ? piValueArr[0] : piValueArr[1];
				break;
			default:
				if (keyKey == 0) {
					origin = currShape.offset(coord);
					//igitna ang dipukal
					if (dv.baseType == 'bar') {
						origin += currShape.size(coord) / 2;
					}
				} else {
					switch (dv.args(`${ToOppoAxis(coord)}Align`)) {
						case 'top':
							if (!initial && dv.baseType !== 'scatter') {
								origin = currShape.size(coord);
							}
							break;
						case 'right':
						case 'bottom':
							if (
								(initial && dv.baseType !== 'scatter') ||
								(this._is_bar_and_within &&
									dv.args(`${ToOppoAxis(coord)}Align`) == 'right')
							) {
								origin = dv.dimensionFromAxis(coord);
							} else {
								origin =
									dv.dimensionFromAxis(coord) - currShape.size(coord);
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

				toReturn = origin + shiftPad + shiftArea;
				// toReturn = origin;
				// toReturn = origin + shiftArea;
				// toReturn = origin + shiftPad;

				break;
		}
		return toReturn;
	}

	get textAnchor() {
		const dv = this.dv;
		let anchor = 'middle';

		if (dv.args('type') == 'pie') {
			//depends
		} else {
			if (dv.args(`yData`) == 0) {
				anchor = 'start';
			}

			Coordinates.forEach(function (coord) {
				if (
					dv.args(`${ToOppoAxis(coord)}Data`) == 0 &&
					dv.args(`${ToOppoAxis(coord)}Align`) == 'right'
				) {
					anchor = 'end';
				}
			});
		}

		return anchor;
	}

	toLight() {}

	stroke() {
		const dv = this.dv;
		const dis = this.dis;
		const i = this.i;
		const currShape = new Shape(dv, dis, i);

		let toReturn = dv.args('colorBackground');

		switch (this.dv.baseType) {
			case 'pie':
				if (dv.args('piLabelStyle') == 'within') {
					toReturn = currShape.palette();
				}
				break;

			case 'bar':
				if (
					(!this._is_bar_and_within && currShape.size(dv.axisFromKey(1))) >=
						dv.args(ToSide(dv.axisFromKey(1))) -
							this.length(dv.axisFromKey(1)) ||
					(this._is_bar_and_within && currShape.size(dv.axisFromKey(1))) >=
						this.length(dv.axisFromKey(1))
				) {
					toReturn = currShape.palette();
				}
				break;
		}
		return toReturn;
	}

	baselineShift(coord, keyKey) {
		const dv = this.dv;
		var toReturn = '0em';

		if (dv._has_both_text) {
			if (coord == 'y' && dv._has_both_text) {
				// calculate height
				const fullHeight =
					dv.fontSize *
					(dv.args('textNameSize') +
						dv.args('textValueSize') +
						Stamp.textPadding); // .5 margin top bottom and between text

				if (keyKey == 1) {
					toReturn =
						(fullHeight * -0.5 +
							dv.fontSize * dv.args('textValueSize') * 0.5 +
							dv.fontSize) /
							(dv.fontSize * dv.args('textValueSize')) +
						'em';
				} else {
					toReturn =
						(fullHeight * 0.5 -
							dv.fontSize * dv.args('textNameSize') * 0.5 -
							dv.fontSize) /
							(dv.fontSize * dv.args('textNameSize')) +
						'em';
				}
			}
		}

		return toReturn;
	}
}

export default Stamp;
