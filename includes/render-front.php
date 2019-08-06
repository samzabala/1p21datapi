

<?php
/********************************************************************************************
* Render markup
*********************************************************************************************/

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
            $render .= "<h3>{$data_visual['title']}</h3>";
            // $render .= "<div class='data-visualizer-wrapper'><!-- Render Data here boi --></div>";
        
        
        //json if applicable
            if($data_visual['src_type'] == 'rows' || $data_visual['src_type'] == 'text'){
                $render .= "<script id='$wrapper_id-data'  type='application/json' >";
                
                if($data_visual['src_type'] == 'rows'){
                    $render .= json_encode($data_visual['src']);
                }else{
                    
                    $render .= $data_visual['src'];
                }
                
                $render .= "</script>";
            }

        //script
            $render .= "<script>
            (function(){
                document.addEventListener('DOMContentLoaded', function() {
                    _1p21.dataVisualizer('#{$wrapper_id}',{\n";

                        //type
                            $render .= "type: '{$data_visual['type']}',\n";
                        //usual settings
                            foreach( $data_visual['settings'] as $settings => $value ){
                                if( $value != null && $settings != 'id') {
                                    $parsed_settings_key = _1p21_dv_dashes_to_camel_case($settings);
                                    $render .= "{$parsed_settings_key}: {$value},\n";
                                }
                            }

                        // data
                            if($data_visual['data_key']) {

                                // $parsed_data_keys_arr = [];

                                // foreach($data_visual['data_key'] as $coordinate_keys){
                                //     $coordinate = str_replace(array("'"),'',$coordinate_keys);//quotes


                                //     $coordinate = '[\''. str_replace(array('.','][','[',']'),'\',\'',$coordinate_keys). '\']'; //separators

                                //     $parsed_data_keys_arr[] = $coordinate;


                                // }

                                // $parsed_data_keys = implode(',',$parsed_data_keys_arr);

                                // $render .= "
                                // dataKeyTest: [{$parsed_data_keys}],\n";


                                $parsed_data_keys  = implode('\',\'',$data_visual['data_key']);
                                $render .= "
                                dataKey: ['{$parsed_data_keys}'],\n";
                            }
                        //data is num
                        $parsed_data_1_is_num = ($data_visual['data_1_is_num']) ? 'true' : 'false';
                        $render .=" dataOneIsNum: {$parsed_data_1_is_num},\n";
            
            
                        // X & y settings

                        if($data_visual['type'] == 'pie'){
                            foreach($data_visual['pi'] as $settings=> $value) {
                                if($value !== ''){
                                    $parsed_settings_key = _1p21_dv_dashes_to_camel_case('pi_' . $settings ); 
            
                                    $parsed_value = $value;
            
                                    $render .= "{$parsed_settings_key}: '{$value}',\n";
                                }
                            }
                        }else{


                            $coordinates = ['x','y'];
                            $string_values = array('label','align','ticks_format');
                            $boolean_values = array('ticks');

                            foreach($coordinates as $coordinate){

                                foreach($data_visual[$coordinate] as $settings=> $value) {
                                    if($value !== ''){
                                        $parsed_settings_key = _1p21_dv_dashes_to_camel_case($coordinate . '_' . $settings ); 
                
                                        $parsed_value = $value;
                                        if(in_array($settings,$string_values)){
                                            $parsed_value = '\''.$value. '\'';
                                        }elseif(in_array($settings,$boolean_values)){
                                            $parsed_value = ($value == 1) ? 'true' : 'false';
                                        }
                
                                        $render .= "{$parsed_settings_key}: {$parsed_value},\n";
                                    }
                                }
                            }
                        }
                        
            
                        // kwan colors
                            if($data_visual['colors']) {
                                $data_keys  = implode('\',\'',$data_visual['colors']);
                                $render .= "
                                colors: ['{$data_keys}'],\n";
                            }
                            if($data_visual['colors_data_key']) {
                                $render .= "
                                colors: '{$data_visual['colors_data_key']}',\n";
                            }
            
                        //src
                            if($data_visual['src']){
                                $parsed_src_path = '\''.$data_visual['src'].'\'';
                                if($data_visual['src_type'] == 'rows' || $data_visual['src_type'] == 'text'){
                                    $parsed_src_path = "window.document.location + '#{$wrapper_id}-data'";
                                }
            
                                $render .= "
                                srcPath: {$parsed_src_path},\n";
                            }
            
                        //src key
                            if($data_visual['src_key']) {

                                $parsed_src_key  = str_replace(array("'"),'',$data_visual['src_key']); //quotes
                                $parsed_src_key  = str_replace(array('.','][','[',']'),'\',\'',$parsed_src_key); //separator
                                $render .= "
                                srcKey: ['{$parsed_src_key}'],\n";
                            }
            
                        
                        //srctype and end
                        $render .= "srcType: '{$data_visual['src_type']}'
                    });
                })
            }());
            </script>";


        //end wrapper
        $render .= "</div>";

        // // echo '<h3>POST META</h3>';
        // _1p21_dv_output_arr(get_metadata('post',$args['id']));

        _1p21_dv_output_arr( $data_visual);


        
    }else{
        $render =  '<div class="data-visualizer no-data"><div class="data-visualizer-wrapper">Sorry, data visual doesn not exist</div></div>';
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

