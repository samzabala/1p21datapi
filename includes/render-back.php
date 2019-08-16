<?php

/********************************************************************************************
* Render data
*********************************************************************************************/

/*

 this where u generate php bois and validate which ones are valid
*/
function _1p21_dv_get_data_visual_object($args = array()) {
    global $_1p21_dv;


    $id = $args['id'];

    // dont give shit if boi doesnt even exist
    $post_exists = get_post( $id );
    if(!$post_exists) {
        return false;
    }else{


        include _1P21_DV_PLUGIN_PATH . 'fields/acf-cpt.php';
    
    
        $data_visual_test = array();
        $prefix = 'dv_';
    

        //the id
        $data_visual_test['id'] = $id;

        //title and shit
        $data_visual_test['title'] = get_the_title($id);

        //settings
        $data_visual_test['settings'] =  wp_parse_args( $args, $_1p21_dv['defaults'] );
        if(!empty($args)){
            $data_visual_test['settings'] =  wp_parse_args( $args, $_1p21_dv['defaults'] );
        }

        //type
        $data_visual_test['type'] = get_post_meta($id,'dv_type',true);

        if($data_visual_test['type'] == 'line' || $data_visual_test['type'] == 'scatter'){
            $data_visual_test['name_is_num'] = get_post_meta($id,'dv_name_is_num',true);
        }

    
        // $to_parse_as_sub_field = array('src','data_key','x','y','line','pi','color');


        foreach($_1p21_dv_fields_cpt['fields'] as $field) {
            if( !(strpos($field['name'],$prefix) === false) ){ //get the ones with valid acf field keys or some shit
                $key = str_replace($prefix,'',$field['name']);
    
                if($field['name']){
    
                    if(isset($field['sub_fields'])){

                        switch($key) {
                            // case 'src':
                            //     break;
                            // case 'color':
                            //     break;
                            default:
                                $sub_fields = _1p21_dv_deep_sub_fields(array(

                                    'id' => $id,
                                    'prefix' => $field['name'],
                                    'fields' => $field['sub_fields'],
                                ));

                            $data_visual_test[$key] = $sub_fields;
                        }

                        if($key == 'src') {
                            
                        }else{
                        

                        }
                    }else{
    
                        $data_visual_test[$key] = get_post_meta($id,$field['name'],true);
                    }
    
                }
    
            }
        }



        echo 'new args';
        _1p21_dv_output_arr($data_visual_test);






































        //create Array of the metadata and content given on each boi
        $data_visual = array();

        //the id
        $data_visual['id'] = $id;

        //title and shit
        $data_visual['title'] = get_the_title($id);

        //settings
        $data_visual['settings'] =  wp_parse_args( $args, $_1p21_dv['defaults'] );
        if(!empty($args)){
            $data_visual['settings'] =  wp_parse_args( $args, $_1p21_dv['defaults'] );
        }

        //type
        $data_visual['type'] = get_post_meta($id,'dv_type',true);

        if($data_visual['type'] == 'line' || $data_visual['type'] == 'scatter'){
            $data_visual['name_is_num'] = get_post_meta($id,'dv_name_is_num',true);
        }



        // data keys 
        if(get_post_meta($id,'dv_data_key_0',true) || get_post_meta($id,'dv_data_key_1',true)){
            $data_visual['data_key'] = array(
                get_post_meta($id,'dv_data_key_0',true),
                get_post_meta($id,'dv_data_key_1',true),
            );
        }
        // $data_visual['data_1_is_num'] = get_post_meta($id,'dv_data_1_is_num',true);

        //x & y / pie settings
        if ($data_visual['type'] != 'pie') {
            $coordinates = ['x','y'];

            foreach($coordinates as $coordinate){
                $data_visual[$coordinate] = _1p21_dv_get_subbed_post_meta(array(
                    'id' => $id,
                    'key' => 'dv_'.$coordinate,
                    'is_incremented' => false
                ));

                //validate x
                if(!$data_visual[$coordinate]['ticks']){
                    unset($data_visual[$coordinate]['ticks_format']);
                    unset($data_visual[$coordinate]['ticks_amount']);
                    unset($data_visual[$coordinate]['label']);
                    unset($data_visual[$coordinate]['prepend']);
                    unset($data_visual[$coordinate]['append']);
                    unset($data_visual[$coordinate]['grid']);



                    //validate minimum and maximum
                    if( !($data_visual['dv_data_key_0_is_num'] || $data_visual[$coordinate]['data'] == 1) ) {
                        unset($data_visual[$coordinate]['min']);
                        unset($data_visual[$coordinate]['max']);
                        unset($data_visual[$coordinate]['divider']);

                    }
                }
            }

            //line boi
            if($data_visual['type'] == 'line'){
                $data_visual['line'] = _1p21_dv_get_subbed_post_meta(array(
                    'id' => $id,
                    'key' => 'dv_line',
                    'is_incremented' => false
                ));
            }


            // $data_visual['y'] = _1p21_dv_get_subbed_post_meta(array(
            //     'id' => $id,
            //     'key' => 'dv_y',
            //     'is_incremented' => false
            // ));

            // //validate y
            // if(!$data_visual['y']['ticks']){

            // }


        }else{
            $data_visual['pi'] = _1p21_dv_get_subbed_post_meta(array(
                'id' => $id,
                'key' => 'dv_pi',
                'is_incremented' => false
            ));

        }

        //@TODO AREA

        //colors
        $data_visual['colors'] = array();
        $got_color_data = _1p21_dv_get_subbed_post_meta(array(
            'id' => $id,
            'key' => 'dv_colors',
            'is_incremented' => true
        ));

        foreach($got_color_data as $color) {
            $data_visual['colors'][] = $color['color'];
        }


        $data_visual['colors_data_key'] =  get_post_meta($id,'dv_colors_data_key',true);
        

        //type of src inpuut
        $data_visual['src_type'] = get_post_meta($id,'dv_src_type',true);



        //validate data keys based from source
        if(  $data_visual['src_type'] == 'rows' ){
            $data_visual['data_key'] = array('label','value');
        }
        
        //src
        $data_visual['src'] = null;
        switch($data_visual['src_type']){
            case 'file':
                $data_visual['src'] = wp_get_attachment_url(get_post_meta($id,'dv_src_file',true));
                break;
            case 'url':
                $data_visual['src'] = get_post_meta($id,'dv_src_url',true);
                break;
            case 'text':
                $data_visual['src'] = get_post_meta($id,'dv_src_text',true);
                break;
            case 'rows':
                $data_visual['src'] = _1p21_dv_get_subbed_post_meta(array(
                    'id' => $id,
                    'key' => 'dv_src_row',
                ));
                break;
        }

        //source key
        $data_visual['src_key'] = get_post_meta($id,'dv_src_key',true);


        $data_visual = apply_filters('_1p21_dv_data_visual_object',$data_visual);


        return $data_visual;
        // return $data_visual_test;
    }
}