<?php

/********************************************************************************************
* Render data
*********************************************************************************************/


/*
        DRAFT FOR SETTINGS


        'color_scheme' => array(),
        'externalData' => null,
        'x_data' => null,
        'y_data' => null,
        'x_data_key' => null,
        'y_data_key' => null,
        'x_label' => null,
        'y_label' => null,
        'type' => 'bar', // line,pie,donut,scatter


        //custom to front end
            'aspect_ratio' => '1:1', // 1:1,3:4,6:9
            'margin' => 20,
            'tool_tip' => ''


*/
function _1p21_dv_get_data_visual_object($args = array()) {
    global $_1p21_dv;

    $id = $args['id'];

    // dont give shit if boi doesnt even exist
    $post_exists = get_post( $id );
    if(!$post_exists) {
        return false;
    }else{


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

        //type of src inpuut
        $data_visual['src_type'] = get_post_meta($id,'dv_src_type',true);

        //src
        $data_visual['src'] = null;
        switch($data_visual['src_type']){
            case 'file':
                $data_visual['src'] = wp_get_attachment_url(get_post_meta($id,'dv_src_file',true));
                break;
            case 'url':
                $data_visual['src'] = wp_get_attachment_url(get_post_meta($id,'dv_src_url',true));
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

        //type
        $data_visual['type'] = get_post_meta($id,'dv_type',true);

        // name
        $data_visual['data_1'] = get_post_meta($id,'dv_data_1',true);

        // value
        $data_visual['data_2'] = get_post_meta($id,'dv_data_2',true);

        if ($data_visual['type'] != 'pie') {
            $data_visual['x'] = _1p21_dv_get_subbed_post_meta(array(
                'id' => $id,
                'key' => 'dv_x',
                'is_incremented' => false
            ));
            $data_visual['y'] = _1p21_dv_get_subbed_post_meta(array(
                'id' => $id,
                'key' => 'dv_y',
                'is_incremented' => false
            ));


            //x axis
            // $data_visual['x_ax'] = get_post_meta($id,'dv_x_ax',true);

            // // y axis
            // $data_visual['y_ax'] = get_post_meta($id,'dv_y_ax',true);

            // //x label
            // $data_visual['x_lab'] = get_post_meta($id,'dv_x_lab',true);

            // //y label
            // $data_visual['y_lab'] = get_post_meta($id,'dv_y_lab',true);

            // $data_visual['type'] = get_post_meta($id,'dv_type',true);
        }
        

        $data_visual = apply_filters('_1p21_dv_data_visual_object',$data_visual);


        return $data_visual;
    }
}