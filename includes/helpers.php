<?php



/********************************************************************************************
* HELPERS
*********************************************************************************************/

/*
IDK D:
i might use later
*/
function _1p21_dv_convert_to_option($field_key){
    global $_1p21_dv;

}

function _1p21_dv_output_arr($args) {

    echo '<div class="content" style="background:#ccc;font-size:10px;padding:1em;margin-bottom:1em;height:400px;overflow:scroll;"><pre>';
    print_r($args);
    echo '</pre></div>';
}

function _1p21_dv_get_subbed_post_meta($args = array()){
    $args = wp_parse_args($args,array(
        'id' => null,
        'key' => '',
        'sub_keys' => array(),
        'is_incremented' => true
    ));

    //to return
    $post_meta = array();

    //all existing
    $all_meta = get_metadata('post',$args['id']);

//if key has increments
    if($args['is_incremented'] == true){


        $meta_subbed_length = get_post_meta($args['id'],$args['key'],true);

        if($meta_subbed_length){

            for( $i = 0; $i < $meta_subbed_length; $i++ ) {
                
                $post_meta[$i] = array(
                );
    
                if(empty($args['sub_keys'])){
    
    
                    foreach($all_meta as $meta=>$arr){
                        // {$args['key']}_{$i}_{$sub_key}
                        $prefix = $args['key'].'_'.$i.'_';
    
                        //do not include acf key valued data
                        if( strpos($meta,"{$prefix}") !== false && strpos($meta,"_{$prefix}") === false ){
                            $post_meta[$i][str_replace($prefix,'',$meta)] = get_post_meta( $args['id'], $meta, true );
                        }
                    }
                }else{
                    foreach($args['sub_keys'] as $sub_key) {
                        $post_meta[$i][$args['sub_keys']] = get_post_meta( $args['id'], "{$prefix}_$sub_key", true );
                    }
                }
            }
    
        }

    }else{

        foreach($all_meta as $meta => $value){
            

            $prefix = $args['key'].'_';

            if( strpos($meta,"{$prefix}") !== false && strpos($meta,"_{$prefix}") === false ){
                $post_meta[str_replace($prefix,'',$meta)] = get_post_meta( $args['id'], $meta, true );
            }

        }

    }
    
    return $post_meta;



    
}


/********************************************************************************************
* HELPERS BUT HMMM other ppl can use it i guess
*********************************************************************************************/



if(!function_exists('get_data_visual_object')){
    function get_data_visual_object($id,$atts) {
        return _1p21_dv_get_data_visual_object($id,$atts);
    }
}

if(!function_exists('output_args')){
    function output_args($args) {
        _1p21_dv_output_arr($args);
    }
}

if(!function_exists('get_data_visualizer')){
    function get_data_visualizer($args,$echo) {
        _1p21_div_get_data_visualizer($args,$echo);
    }
}
if(!function_exists('the_data_visualizer')){
    function the_data_visualizer($args) {
        _1p21_div_get_data_visualizer($args,true);
    }
}
