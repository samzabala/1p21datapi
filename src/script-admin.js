/*!
* 1point21 Data Vizualiser Version 1.2.0
* Admin Script
* DO NOT EDIT min.js
* edit its corresponding unminified js file in /src instead
*/

(function(window){
	"use strict";
	var _1p21 = window._1p21 || {};

	var appendShortcode = function(e,dis){
		
		e.stopPropagation();
		e.preventDefault();

		var fields = dis.querySelectorAll('._1p21_dv-input');
		var inputs = [];
		//validate
		fields.forEach(function(field){
			
			var parsedValue = (function(){
				var toReturn = field.value; //a striing
				switch(field.name) {
					case 'id':
						if(!field.value){
							alert('A Data visualizer is required')
							throw new Error ('ID was not provided');
						}else{
							toReturn = parseInt(field.value)
						}
						break;
					
					case 'align':

							if( field.value !== 'right' && field.value !== 'center' && field.value !== 'left' ) {
								alert(field.name+ ' has an invalid alignment')
								throw new Error ('content alignment invalid');
							}
					case 'margin':
					case 'margin_offset':
					case 'font_size':
					case 'width':
					case 'transition':
					case 'delay':
							toReturn = parseFloat(field.value);

							if( Number.isNaN(toReturn) ){

								alert(field.name+ ' value is invalid')
								throw new Error (field.name + ' was invalid');
							}
						break;

				}
				return toReturn;
			}())


			if( field.value ){
				inputs.push([field.name,parsedValue]);
			}
		})

		var shortCode = "[data_visualizer";
		
		inputs.forEach(function(input){
			shortCode += " "+input[0]+"="+input[1];
		});

		shortCode += "]";

		window.send_to_editor(shortCode);

		tb_remove();
		return false;
	}

	_1p21.appendShortcode = appendShortcode;
	window._1p21 = _1p21;
}(window))