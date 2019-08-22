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

        //validation booleans and shit
        $validation_src_color_row_exists = false;

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
                $parsed_src_rows = array();

                foreach( $data_visual['src']['row'] as $i=>$row ){
                    $parsed_src_rows[$i][0] = $row[0];
                    $parsed_src_rows[$i][1] = $row[1];


                    if( !empty($data_visual['color']['palette']) && $data_visual['type'] !== 'pie' && $parsed_src_rows[$i][2] ) {

                        if($validation_src_color_row_exists == false){
                            $validation_src_color_row_exists = true;
                        }

                        $parsed_src_rows[$i][2] = $row[2];
                    }

                    if(  $data_visual['src']['type'] == 'scatter' && $parsed_src_rows[$i][3] ) {
                        $parsed_src_rows[$i][3] = $row[3];
                    }
                }

                $data_src_arr['data'] = $parsed_src_rows;
                break;
        }

        $data_visual['src'] = $data_src_arr;

        //get rid based from src
        if(
            $data_visual['src']['type'] == 'row'
            || (!$data_visual['data_key'][0] && !$data_visual['data_key'][1])
        ){
            $data_visual['data_key'] = [0,1]; //default in js is [0,1]
        }

        // parse and remove itemz we dont need
        //remove based on type
        if($data_visual['type'] !== 'line' && $data_visual['type'] !== 'scatter'){
            unset($data_visual['name_is_num']);
        }

        if ($data_visual['type'] !== 'pie') {
            unset($data_visual['pi']);
            unset($data_visual['name']);
            unset($data_visual['value']);

            $coordinates = ['x','y'];

            foreach($coordinates as $coordinate){
                //validate x
                switch($data_visual[$coordinate]['ticks']){
                    case false:
                        unset($data_visual[$coordinate]['ticks_amount']);
                        unset($data_visual[$coordinate]['label']);
                        unset($data_visual[$coordinate]['grid']);
                        unset($data_visual[$coordinate]['grid_increment']);
                    case true: //let false casecade to true too
                        
                        if( !isset($data_visual['name_is_num'])
                            && $data_visual[$coordinate]['data'] == 0
                        ){
                            unset($data_visual[$coordinate]['min']);
                            unset($data_visual[$coordinate]['max']);
                            unset($data_visual[$coordinate]['ticks_amount']);
                            unset($data_visual[$coordinate]['divider']);
                        }

                        if(!isset($data_visual[$coordinate]['grid']) && !($data_visual[$coordinate]['ticks_amount'] > 0)){

                            unset($data_visual[$coordinate]['grid_increment']);
                            
                        }

                        break;

                }
                
            }


            //no data means it fucks with the name. no need for legegends
            if( !$data_visual['color']['data'] ){
                $data_visual['color']['legend'] == null;
            }

            if($data_visual['type'] !== 'line') {
                unset($data_visual['line']);
            }


            if($data_visual['type'] !== 'scatter') {
                unset($data_visual['scatter']);
            }

        }else{
            unset($data_visual['x'],$data_visual['y'],$data_visual['line'],$data_visual['color']['data']);
            $data_visual['color']['legend'] = true;
        }

        //parse olors array is ugly lets make it pretty
        $data_palette_arr = array(); //place shit here3

        foreach($data_visual['color']['palette'] as $row){
            $data_palette_arr[] = $row['color'];
        }
        
        $data_visual['color']['palette'] = $data_palette_arr;
        
    
        //colordata key oh god
        if( $data_visual['src']['type'] == 'rows' && $validation_src_color_row_exists == true ){
            $data_visual['color']['data'] = 2;

        }


        return $data_visual;
        // return $data_visual;
    }
}