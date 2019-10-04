/*!
* 1point21 Data Vizualiser Version 1.2.0.2
* Admin Script
* DO NOT EDIT min.js
* edit its corresponding unminified js file in /src instead
*/

(function(window){
	"use strict";
	var _1p21 = window._1p21 || {};

	var runValidation = function(field,isInvalid,alert,console){
		if( isInvalid ){
			field.classList.add('invalid');
			alert(alert)
			throw new Error (console);
		}else{
			field.classList.remove('invalid');
		}
	}

	var appendShortcode = function(e,dis){
		
		e.stopPropagation();
		e.preventDefault();

		var fields = dis.querySelectorAll('._1p21_dv-input');
		var inputs = [];

		console.log(fields);
		//validate
		fields.forEach(function(field){
			if( field.value ){

				console.log(field);
			
				var parsedValue = (function(){
					var toReturn = field.value.toString(), //a striing
					isInvalid = false,
					alertString = '',
					consoleString = '';

					switch(field.name) {
						case 'id':
							toReturn = parseInt(field.value);
							isInvalid = Number.isNaN(toReturn);
							alertString = 'Invalid data visualizer';
							consoleString = 'ID was invalid';
							break;
						
						case 'align':
							isInvalid = ( toReturn !== 'right' && toReturn !== 'center' && toReturn !== 'left' && toReturn !== '' );
							alertString = field.name+ ' has an invalid alignment';
							consoleString = 'align is invalid';
							break;

						case 'margin':
						case 'font_size':
						case 'width':
						case 'transition':
						case 'delay':
							toReturn = parseFloat(field.value);
							isInvalid = Number.isNaN(toReturn);
							alertString = field.name.replace('_',' ') + ' value is invalid';
							consoleString = field.name + ' was invalid';
							break;

					}


					runValidation(field,isInvalid,alertString,consoleString);


					return toReturn;
				
				}())

				inputs.push([field.name,parsedValue]);
			}else{
				if(field.name == 'id') {
					alert('A data visual is required')
					throw new Error ('id was not given');

				}
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