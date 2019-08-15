<?php
/********************************************************************************************
* filter + hooks and stuff
*********************************************************************************************/

    
// output the front end influenced global variable
    function _1p21_dv_output_what_the_fuck_is_going_on(){
        $debug = false;
        $debug = apply_filters('_1p21_dv_info',$debug);


            if($debug) {
                global $_1p21_dv;
                _1p21_dv_output_arr($_1p21_dv);
            }
    }
    add_action( 'wp_footer', '_1p21_dv_output_what_the_fuck_is_going_on');

//alow json,csv, and tsv files
    function _1p21_dv_allow_file_types($mimes) {
        $mimes['json'] = 'application/json';
        $mimes['csv'] = 'text/csv';
        $mimes['tsv'] = 'text/tsv';
        return $mimes;
    }
    add_filter('upload_mimes', '_1p21_dv_allow_file_types');


//endqueue scripts
    function _1p21_dv_enqueue_scripts() {
        wp_register_script( 'd3','https://d3js.org/d3.v5.min.js',array(),false,true);
        
        if(current_user_can('administrator')) {
            wp_register_script( '1p21-dv-d3', _1P21_DV_PLUGIN_URL . 'assets/main.js',array('d3'),null,true);
        }else{
            wp_register_script( '1p21-dv-d3', _1P21_DV_PLUGIN_URL . 'assets/main.min.js',array('d3'),null,true);
        }

        wp_enqueue_script( 'd3' );
        wp_enqueue_script( '1p21-dv-d3' );
        wp_enqueue_style( '1p21-dv-d3-styles', _1P21_DV_PLUGIN_URL . 'assets/style.css',array(),null );
    }
    add_action( 'wp_enqueue_scripts', '_1p21_dv_enqueue_scripts' );

// display id on edit page
function _1p21_dv_display_id_to_edit_page() {
    global $post;
    $scr = get_current_screen();
    // _1p21_dv_output_arr($scr);
    // _1p21_dv_output_arr($post);


    if ( $scr->base !== 'data-visual' && $scr->parent_base === 'edit' ){

        echo '<h2 style="font-size: 1.25em;margin-top:.75em;display:inline-block;border: 1px solid #ccc;">Data Visual ID: <span class="wp-ui-highlight" style="position:relative; bottom: .0625em; left: .125em; padding: .25em .5em; font-family: monospace;">'.$post->ID.'</span></h2>';
    }
        return;
}

add_action( 'edit_form_after_title', '_1p21_dv_display_id_to_edit_page' );


//style classes of acf
    function _1p21_dv_acf_fields_styles(){
        ?>
        <style type="text/css">

        #acf-group_5d4206c985d00 .dv-code input,
        #acf-group_5d4206c985d00 .dv-code textarea{
            font-family: monospace;
            
        }
        </style>
        <?php 
    }


add_action('acf/input/admin_head', '_1p21_dv_acf_fields_styles');