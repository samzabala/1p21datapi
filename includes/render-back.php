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

        require _1P21_DV_PLUGIN_PATH . 'fields/acf-cpt.php';
    
        $data_visual = array();
        $prefix = 'dv_';

        //the id
        $data_visual['id'] = $id;

        //title and shit
        $data_visual['title'] = get_the_title($id);

        //settings
        $data_visual['settings'] =  wp_parse_args( $args, $_1p21_dv['defaults'] );
        if(!empty($args)){
            $data_visual['settings'] =  wp_parse_args( $args, $_1p21_dv['defaults'] );
        }

        // fields that make the bby
        $data_visual = array_merge(
            $data_visual,
            _1p21_dv_deep_sub_fields(array(
                'id' => $id,
                'fields' => $_1p21_dv_fields_cpt['fields'],
            ))
        );

        // parse and remove itemz we dont need
        //remove based on type
        if($data_visual['type'] !== 'line' && $data_visual['type'] !== 'scatter'){
            unset($data_visual['name_is_num']);
        }

        if ($data_visual['type'] !== 'pie') {
            unset($data_visual['pi']);

            $coordinates = ['x','y'];

            foreach($coordinates as $coordinate){
                //validate x
                if(!$data_visual[$coordinate]['ticks']){
                    unset($data_visual[$coordinate]['ticks_format']);
                    unset($data_visual[$coordinate]['ticks_amount']);
                    unset($data_visual[$coordinate]['label']);
                    unset($data_visual[$coordinate]['prepend']);
                    unset($data_visual[$coordinate]['append']);
                    unset($data_visual[$coordinate]['grid']);



                    //validate minimum and maximum
                    if( !($data_visual['name_is_num'] || $data_visual[$coordinate]['data'] == 1) ) {
                        unset($data_visual[$coordinate]['min']);
                        unset($data_visual[$coordinate]['max']);
                        unset($data_visual[$coordinate]['divider']);

                    }
                }
            }

            if($data_visual['type'] !== 'line') {
                unset($data_visual['line']);
            }


            if($data_visual['type'] !== 'scatter') {
                unset($data_visual['scatter']);
            }

        }else{
            unset($data_visual['x'],$data_visual['y'],$data_visual['line']);
        }

        //parse olors array is ugly lets make it pretty
        $data_palette_arr = array(); //place shit here3

        foreach($data_visual['color']['palette'] as $row){
            $data_palette_arr[] = $row['color'];
        }
        
        $data_visual['color']['palette'] = $data_palette_arr;


        //also parse sources. yuckeeee
        $data_src_arr = array();
        $data_src_arr['type'] = $data_visual['src']['type'];
        $data_src_arr['key'] = $data_visual['src']['key'];

        switch($data_visual['src']['type']){
            case 'file':
                $data_src_arr['data'] = wp_get_attachment_url($data_visual['src']['file']);
                break;
            case 'url':
                $data_src_arr['data'] = $data_visual['src']['url'];
                break;
            case 'text':
                $data_src_arr['data'] = $data_visual['src']['text'];
                break;
            case 'rows':
                $data_src_arr['data'] = $data_visual['src']['row'];
                break;
        }

        $data_visual['src'] = $data_src_arr;

        //get rid based from src
        if($data_visual['src']['type'] == 'row'){
            unset($data_src_arr['data_key']);
        }
        return $data_visual;
        // return $data_visual;
    }
}