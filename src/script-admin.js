(function(window){
    "use strict";
    var _1p21 = window._1p21 || {};

    var appendShortcode = function(e,dis){
        // foreach()
        e.stopPropagation();
        e.preventDefault();

        var fields = dis.querySelectorAll('._1p21_dv-input');
        var inputs = [];

        //validate
        fields.forEach(function(field){

            if( field.value ){
                inputs.push([field.name,parseFloat(field.value)]);
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