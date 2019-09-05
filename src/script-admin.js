(function(window){
	"use strict";
	var _1p21 = window._1p21 || {};

	var appendShortcode = function(e,dis){
		
		e.stopPropagation();
		e.preventDefault();

		var fields = dis.querySelectorAll('._1p21_dv-input');
		var inputs = [];

		var is_string = ['align'];
		var is_boolean = [];

		//validate
		fields.forEach(function(field){

			var parsedValue = (function(){
				var toReturn = field.value //a striing
				
				switch(field.name) {
					case 'id':
						toReturn = parseInt(field.value)
						break;
					case 'margin':
					case 'margin_offset':
					case 'font_size':
					case 'width':
					case 'transition':
					case 'delay':
						toReturn = parseFloat(field.value);
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

		console.log(shortCode,wp.editor.getContent());

		tb_remove();

		return false;
	}

	_1p21.appendShortcode = appendShortcode;
	window._1p21 = _1p21;
}(window))