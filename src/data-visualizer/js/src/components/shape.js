import Component from '../util/template-component.js';
import {
	ToOppoAxis,
	ToSide,
} from 'src/util/helpers.js';

class Shape extends Component {
	constructor(dv,dis,i){
		super(dv,{
			dis: dis,
			i:i
		})
	}

	dimension(axisName){
		return this.dv.args(ToSide(axisName));
	}
	
	get tag (){
		const dv = this.dv;

		switch(dv.baseType){
			case 'bar':
				return 'rect';
			case 'pie':
				return 'path';
			case 'line':
			case 'scatter':
				return 'circle';
		}
	}

	coordAttr(axisName) {
		const dv = this.dv;

		return dv._is_base(['line','scatter'])
			? `c${axisName}`
			: `${axisName}`
		;
	}

	radius(initial){
		const dv = this.dv;
		const dis = this.dis;
		const i = this.i;

		initial = initial || false;


		let radius = initial
			? 0
			: (
				dv._is_base('scatter')
					? (dv.args('areaMin') + dv.args('areaMax')) / 2
					: 5
			);

		if(!initial){
			if(dv._is_base('line')){
				if(
					dv._is_base('line')
					&& dv.args('linePointsSize')
				){
					radius = args.linePointsSize
				}
				
			}else if(
				dv._is_base('scatter')
				&& dv.args(`key['area']`)
			){
				radius = dv.scale( 'area', dv._get(dis,dv.args(`key['area']`),true) );
			}
		}

		return radius;
	}

	scaledValue(keyKey){
		const dv = this.dv;
		const dis = this.dis;

		let dataToScale;
		
		if(
			dv._name_is_num == true
			|| keyKey  == 1
		){
			dataToScale = dv._get(
				dis,
				dv.args(`key['${keyKey}']`),
				true
			);
		}else{
			dataToScale = dv._get(
				dis,
				dv.args(`key['${keyKey}']`),
				false
			);
		}

		return dv.scale(keyKey,dataToScale);
	}

	size(coord,initial){
		initial = initial || false;
		const dv = this.dv;
		const dis = this.dis;
		const i = this.i;


		if(dv._is_base('pie')){
			return; //go on pi. git. u have no bidnes herr
		}

		let toReturn = 20;

		const
			keyKey  =  dv.args(`${coord}Data`),
			oppoAlign = dv.args(`${ToOppoAxis(coord)}Align`);

		if(
			dv._name_is_num == true
			|| keyKey  == 1
		){

			if(initial) {
				toReturn = 0;
			}else{
				if(
					oppoAlign == 'right'
					|| oppoAlign == 'bottom'
				){
					toReturn = this.dimension(coord)
						- this.scaledValue(keyKey);

				}else{
					toReturn = this.scaledValue(keyKey);
				}
			}

		}else{
			toReturn = dv.scale(keyKey).bandwidth()
		}

		//cant be a negaative bitch what the fuq
		if(toReturn < 0 ){
			toReturn = 0;
		}
		
		return toReturn;

	}

	offset(coord,initial){
		initial = initial || false;
		const dv = this.dv;
		const dis = this.dis;
		const i = this.i;

		if(dv._is_base('pie')){
			return; //go on pi. git. u have no bidnes herr
		}
		// same here.. could be the same probably
		const keyKey =  dv.args(`${coord}Data`),
			oppoAlign = dv.args(`${ToOppoAxis(coord)}Align`);

		let toReturn = 0;
			
		if(
			dv._name_is_num == true
			|| keyKey == 1
		){
			if(
				oppoAlign == 'right'
				|| oppoAlign == 'bottom'
			){
				if(
					initial
					&& keyKey == 1
					&& dv._is_base([
						'bar',
						'line'
					])
				){
					toReturn = this.dimension(coord);
				}else{
					toReturn = this.dimension(coord) - this.scaledValue(keyKey);
					console.warn(
						'offe',
						dis.name,
						coord,
						this.dimension(coord),
						this.scaledValue(keyKey),
						toReturn)
				}

			}else{
				if(dv._is_base([
					'line',
					'scatter'
				])){
					if(!(
						initial
						&& keyKey == 1
						&& dv._is_base('line')
					)){
						toReturn = this.scaledValue(keyKey);
					}
				}
			}

		}else{
			toReturn = this.scaledValue(keyKey);

			if(
				(dv._is_base([
					'line',
					'scatter'
				]))
				&& !dv._name_is_num 
			) {
				toReturn += this.size(coord) / 2;
			}
		}

		return toReturn;
	}
}

export default Shape