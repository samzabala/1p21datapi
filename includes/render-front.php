

<?php
/********************************************************************************************
* Render markup
*********************************************************************************************/

function _1p21_div_get_data_visualizer($args = array(),$echo = false){
    global $_1p21_dv;


    $data_visual = _1p21_dv_get_data_visual_object($args);
    $render = '';

    if($data_visual) {

    
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

        

        
        //create unique id for instance to avoid script conflict
        $wrapper_id = "data-visualizer-{$args['id']}";

        if($_1p21_dv['present'][$args['id']]['front']['instance'] > 1) {
            $wrapper_id .= "-{$_1p21_dv['present'][$args['id']]['front']['instance']}";
        }

        $_1p21_dv['present'][$args['id']]['front']['wrapper_id'][] = $wrapper_id;
        $data_visual['front']['wrapper_id'] = $wrapper_id;
    
        // start wrapper
        $render = "<div id='$wrapper_id' class='data-visualizer' data-asp-ratio='16:9'>";
        $render .= "<div class='data-visualizer-wrapper'><!-- Render Data here boi --></div>";
        
        
        //json if applicable
        $render .= "<script id='$wrapper_id-data'  type='application/json' >";
        $render .= "</script>";

        //script
            $render .= "<script>
            (function(){
                document.addEventListener('DOMContentLoaded', function() {
                    var args = {
                        id: '#{$wrapper_id}',\n";

            if($data_visual['src_type'] == 'file' || $data_visual['src_type'] == 'url') {
                $render .= "
                src: '{$data_visual['src']}',\n";
            }

            if($data_visual['settings']['width']) {
                $render .= "width: {$data_visual['settings']['width']},\n";
            }

            if($data_visual['settings']['height']) {
                $render .= "height: {$data_visual['settings']['height']},\n";
            }
            if($data_visual['settings']['margin']) {
                $render .= "margin: {$data_visual['settings']['margin']},\n";
            }
            if($data_visual['settings']['margin-offset']) {
                $render .= "marginOffset: {$data_visual['settings']['margin-offset']},\n";
            }
            
        
            $render .= "srcType: '{$data_visual['src_type']}',
                    };
                    _1p21.renderData('#$wrapper_id',args);
                })
            }());
            </script>";


        //end wrapper
        $render .= "</div>";

        echo '<h3>POST META</h3>';
        _1p21_dv_output_arr(get_metadata('post',$args['id']));

        _1p21_dv_output_arr( $data_visual);


        
    }else{
        $render =  '<div class="data-visualizer data-visualizer-no-data">Sorry, data visual doesn not exist</div>';
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

