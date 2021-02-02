
import Component from '../util/template-component.js';

class Tip extends Component {

	constructor(dv,classToAdd){
		super(dv,{
			classToAdd: classToAdd
		});
	}
	

	
	get html(){
		const dv = this.dv;
		return dv.args('tooltipContent') || Tip.default;
	}

	getCall(){
		const tt = this;
		const dv = this.dv;
		return d3.tip()
			.attr('class',`${tt.classToAdd}`)
			.style('width', () => {
				if(typeof dv.args('tooltipWidth') === 'number'){
					return `${dv.args('tooltipWidth')}px`;
				}else if(dv.args('tooltipWidth') == 'auto'){
					return dv.args('tooltipWidth');
				}
			})
			.style('text-align',dv.args('tooltipTextAlign'))
			.direction(dv.args('tooltipDirectionParameter') || dv.args('tooltipDirection'))
			.html(Tip.html)
	}

	show(){
		
	}

	default(dis,i) {
		const dv = this.dv;
		const html = `<div class="${dv.createClass('tooltip-data')}">`;

		for (let prop in dis) {
			if (Object.prototype.hasOwnProperty.call(dis, prop)) {
				const propIsOutputted = false;
				if(typeof dis[prop] !== 'object'){

				
					html += `<div class="${dv.createClass('tooltip-data-property')}">`;

						// label
						if(dv.args('srcType') !== 'row'){
							html += `<strong class="${dv.createClass('tooltip-data-property-label')}">${prop}:</strong> `;
						}


				
						DatumKeys.forEach((keyKey)=>{
							
							if(
								dv.args(`key['${keyKey}']`)
								&& dv.args(`key['${keyKey}']`).lastIndexOf(prop)  > -1
								&& dv.format(keyKey)
								&& propIsOutputted == false
							){
								html += `<span class="${dv.createClass('tooltip-data-property-content')}">${dv.format(keyKey)(dv._get(dis,dv.args(`key['${keyKey}' ]`)) )} </span>`;
								propIsOutputted = true;
							}

						});

						if(propIsOutputted == false) {

							// content
							html += `<span class="${dv.createClass('tooltip-data-property-content')}">${dis[prop]}</span>`;

						}
					
					
					html += '</div>';
				
				}
				
			}
		}

		html += '</div>';
		return html;
	}
}

export default Tip;