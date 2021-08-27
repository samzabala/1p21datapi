import Component from '../util/template-component.js';
import {
	ToSide
} from 'src/util/helpers.js';


const OPTIMAL_PI_MULTIPLIER = .5;
const OPTIMAL_PI_LEGENDARY_MULTIPLIER = .375;

class Pi extends Component {
	constructor(dv,dis,i){
		super(dv,{
			dis: dis,
			i:i
		})
	}


	get radius(){
		const dv = this.dv;

		let value = Math.min((dv.args('width') * .5),(dv.args('height') * .5));

		if(dv.args(`colorLegend`)){
			value -= (value * .25)
		}
		
		if( dv.args(`piLabelStyle`) == 'linked' ){
			value -= (value * .25)
		}

		return value;
	}

	offset(coord){
		const dv = this.dv;

		let offset = 0;

		if(dv.args('colorLegend') && coord =='x'){
			offset = (dv.args(ToSide(coord)) * OPTIMAL_PI_LEGENDARY_MULTIPLIER);

		}else{
			offset = (dv.args(ToSide(coord)) * OPTIMAL_PI_MULTIPLIER);
		}

		return offset;
	}

	path (calcWithInnerRadius,subMethod,offsetMultiplier,initial){

		const disPi = this.dis.pie;
		if(!disPi){
			return;
		}

		//@TODO ha??
		const dv = this.dv;
		offsetMultiplier = offsetMultiplier || 1;
		subMethod = subMethod || '';
		calcWithInnerRadius = calcWithInnerRadius || false;
		initial = initial || false;

		const
			innerRadius = 
				calcWithInnerRadius
					? this.radius * dv.args(`piInRadius`)
					: 0
			;

		const outerRadius = (
			!initial
			|| (
				initial
				&& (offsetMultiplier <=1 )
			)
			&& calcWithInnerRadius == false
		) 
			? this.radius * offsetMultiplier
			: 0
			;

		const arc = d3.arc()
			.outerRadius( outerRadius )
			.innerRadius( innerRadius );

		
		if(subMethod){
			return arc[subMethod](disPi);

		}else{
			return arc(disPi)
		}

	}
}

export default Pi;