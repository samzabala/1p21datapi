

<?php
/********************************************************************************************
* Render markup
*********************************************************************************************/

function _1p21_dv_validate_boolean($value){
    return $value == 0 ? 'false' : 'true';
}


function _1p21_dv_validate_arr($value){
    return $value == 0 ? 'false' : 'true';
}


function _1p21_div_get_data_visualizer($args = array(),$echo = false){
    global $_1p21_dv;


    $data_visual = _1p21_dv_get_data_visual_object($args);
    $render = '';

    if($data_visual && get_post_status($data_visual['id']) == 'publish') {

    
        //append this instance as array to the global variable to allow front end manipulation
            if(array_key_exists($args['id'],$_1p21_dv['present'])) {
                $_1p21_dv['present'][$args['id']]['front']['instance']++;
                $data_visual['front']['instance']++;
            }else{
                $_1p21_dv['present'][$args['id']] = $data_visual;

                $_1p21_dv['present'][$args['id']]['front'] = array(
                    'instance' => 1
                );
                $data_visual['front']['instance'] = 1;
            };

        
        $att_prefix = 'data-visualizer';

        

        
        //create unique id for instance to avoid script conflict
            $wrapper_id = "{$att_prefix}-{$args['id']}";

            if($_1p21_dv['present'][$args['id']]['front']['instance'] > 1) {
                $wrapper_id .= "-{$_1p21_dv['present'][$args['id']]['front']['instance']}";
            }

            $_1p21_dv['present'][$args['id']]['front']['wrapper_id'][] = $wrapper_id;
            $data_visual['front']['wrapper_id'] = $wrapper_id;
    
        // start wrapper

        
            $render .= "<div id='$wrapper_id' class='{$att_prefix} {$att_prefix}-type-{$data_visual['type']}'>";
            $render .= "<span class='{$att_prefix}-title'>{$data_visual['title']}</span>";
            // $render .= "<div class='data-visualizer-wrapper'><!-- Render Data here boi --></div>";
        
        
        //json if applicable
            if($data_visual['src']['type'] == 'rows' || $data_visual['src']['type'] == 'text'){
                $render .= "<script id='$wrapper_id-data'  type='application/json' >";

                $parsed_data = $data_visual['src']['data'];

                if($data_visual['src']['type'] == 'rows'){

                    foreach($data_visual['src']['data'] as $data){
                        $parsed_data_arr[] = json_encode($data,JSON_FORCE_OBJECT);
                    }

                    $parsed_data = '['.implode(',',$parsed_data_arr).']';
                    // $parsed_data = json_encode($data_visual['src']['data']);

                }

                $render .= $parsed_data;
                
                $render .= "</script>";
            }

        //script
            $render .= "<script>
            (function(){
                document.addEventListener('DOMContentLoaded', function() {
                    _1p21.dataVisualizer('#{$wrapper_id}',{\n";

                        foreach($data_visual as $attribute => $value){

                            if($attribute !== 'front'){

                                switch($attribute){
                                    case 'settings':


                                        foreach( $value as $sub_setting => $sub_value ){
                                            if( $sub_value != null && $sub_setting != 'id') {
                                                $render .= _1p21_dv_dashes_to_camel_case($sub_setting).": {$sub_value},\n";
                                            }
                                        }
                                        break;


                                    case 'type':

                                        $render .= "type: '{$data_visual['type']}',\n";
                                        break;


                                    case 'data_key':

                                        $parsed_data_keys_arr = [];

                                        foreach($value as $coordinate_keys){
                                            $coordinate = _1p21_parse_data_key($coordinate_keys);
                                            $parsed_data_keys_arr[] = $coordinate;
                                        }

                                        $parsed_data_keys_arr_string = implode('\',\'',$parsed_data_keys_arr);
                                        $render .= _1p21_dv_dashes_to_camel_case($attribute) .": ['{$parsed_data_keys_arr_string}'],\n";

                                        break;

                                    
                                    case 'name_is_num':


                                        $parsed_value = ($value == 1 ) ? 'true' : 'false';
                                        $render .= _1p21_dv_dashes_to_camel_case($attribute).": {$parsed_value},\n";

                                        break;
                                        
                                    
                                    case 'src':


                                        foreach($value as $sub_setting => $sub_value){
                                    
                                            //they are all strings
                                            
                                            if($sub_setting == 'data'){
                                                $parsed_src_path = '\''.$sub_value.'\'';
                                                
                                                if($value['type'] == 'rows' || $value['type'] == 'text'){
                                                    $parsed_src_path = "window.document.location + '#{$wrapper_id}-data'";
                                                }
                            
                                                $render .= "srcPath: {$parsed_src_path},\n";
                                            }elseif($sub_setting == 'key'){

                                                $parsed_value = _1p21_parse_data_key($sub_value);
                                                $render .= _1p21_dv_dashes_to_camel_case($attribute.'_'.$sub_setting). ":'".$parsed_value."',\n";

                                            }else{
                                                $render .= _1p21_dv_dashes_to_camel_case($attribute.'_'.$sub_setting). ":'".$sub_value."',\n";
                                            }
                                        }

                                        break;
                                    
                                        
                                    case 'color':
                                    case 'x':
                                    case 'y':
                                    case 'line':
                                    case 'pi':
                                    case 'name':
                                    case 'value':
                                    case 'scatter':

                                        $string_values = array();
                                        $data_key_values = array();
                                        $boolean_values = array();
                                        $array_values_from_string =  array();
                                        $array_values_from_array = array();
                                        $array_items_are_strings = array();

                                        switch($attribute){

                                            case 'color':
                                                $array_values_from_array = array('palette');
                                                $data_key_values = array('data');
                                                $array_items_are_strings = array('palette');
                                                break;

                                            case 'x':
                                            case 'y':
                                                $string_values = array('align','label','prepend','append');
                                                $boolean_values = array('ticks','grid');
                                                break;

                                            case 'line':
                                                $string_values = array('style','stroke','color','points_color','fill_color','fill_axis');
                                                $boolean_values = array('points','fill','invert');
                                                $array_values_from_string = array('dash');
                                                break;

                                            case 'pi':
                                                $string_values = array('label_style');
                                                break;
                                            
                                            
                                            case 'name':
                                            case 'value':
                                                $string_values = array('prepend','append');
                                                break;
                                            
                                        }
                                        
                                        
                                        foreach($value as $sub_setting => $sub_value) {
                                            if(
                                                (
                                                    !is_array($sub_value)
                                                    && $sub_value !== null
                                                    && $sub_value !== ''
                                                )
                                                || (
                                                    is_array($sub_value)
                                                    && count($sub_value) > 0
                                                )
                                            ){
                                                
                                                $parsed_settings_key = _1p21_dv_dashes_to_camel_case($value . '_' . $sub_setting ); 
                                                // echo $sub_setting.','.$sub_value.'<br>';
                                                $parsed_value = $sub_value;

                                                $imploder = ',';
                                                $implode_wrapper = ['[',']'];
                                                
                                                if(in_array($sub_setting,$array_items_are_strings)){
                                                    $imploder = '\',\'';
                                                    $implode_wrapper = ['[\'','\']'];
                                                }

                                                //straight up string
                                                if(in_array($sub_setting,$string_values)){
                                                    $parsed_value = '\''.$sub_value. '\'';

                                                //boolean bitch
                                                }elseif(in_array($sub_setting,$boolean_values)){
                                                    $parsed_value = ($sub_value == 1) ? 'true' : 'false';

                                                // its a string of comma separated shit that can be a half ass array
                                                }elseif(
                                                    in_array($sub_setting,$array_values_from_string)
                                                    || in_array($sub_setting,$array_values_from_array)
                                                ){

                                                    if( in_array($sub_setting,$array_values_from_string) ){
                                                        $array_value = $sub_value;
                                                    }else{
                                                        $array_value = implode($imploder,$sub_value);
                                                    }

                                                    $parsed_value  = $implode_wrapper[0] . $array_value . $implode_wrapper[1];

                                                // its in an array for real and must be translated very much
                                                }elseif(in_array($sub_setting,$data_key_values)){
                                                    $parsed_value = _1p21_parse_data_key($sub_value);

                                                }
                        
                        
                                                $render .= _1p21_dv_dashes_to_camel_case($attribute.'_'.$sub_setting).": {$parsed_value},\n";
                                                    
                                            }
                                        }

                                        break;

                                    
                                    
                                }
                            }

                        }


                        //end
                            $render .= "
                    });
                })
            }());
            </script>";


        //end wrapper
        $render .= "</div>";


        _1p21_dv_output_arr($data_visual);
        
    }else{
        $render =  '<div class="data-visualizer no-data"><div class="data-visualizer-wrapper">Sorry, data visual does not exist</div></div>';

    }


    if($echo){
        echo $render;
    }else{
        return $render;
    }
}

function _1p21_div_data_visualizer_render_by_short($atts = array()){
    global $_1p21_dv;
    $args = shortcode_atts($_1p21_dv['defaults'],$atts,'data_visualizer');

    extract( $args );

    $render = _1p21_div_get_data_visualizer($args);
    return $render;

    
} 


/********************************************************************************************
* Shortcodes
*********************************************************************************************/
add_shortcode('data_visualizer', '_1p21_div_data_visualizer_render_by_short');

