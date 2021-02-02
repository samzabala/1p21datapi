class Component {
	constructor(dv,props) {
		if (!dv) {
			return
		}
		
		this.dv = dv;

		if(
			typeof props === 'object'){
			for (let key in props) {
				this[key] = props[key];
			}
		}
	}


	dispose() {
		this.dv = null;
	}
}

export default Component;