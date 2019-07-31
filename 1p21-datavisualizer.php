<?php
/*
Plugin Name: 1Point21 Data Vizualizer
Plugin URI: https://www.1point21interactive.com/
Description: Data visualizer using d3 and svgs
Version: 1.0.0
Author: 1Point21 Interactive
Author URI: https://www.1point21interactive.com/
*/


/********************************************************************************************
* VARIABLES
*********************************************************************************************/

$_1p21_dv = array();

//track visible data visualizations and duplicate instances in the front end to avoid script conflicts
$_1p21_dv['present'] = array();

//default front end displaying related arguments or attributes to each instances
$_1p21_dv['defaults'] = array(
    'id' => null, //post id
    'aspect_ratio' => '1:1', // 1:1,3:4,6:9
    'margin' => 20, //padding necessary
);


$_1p21_dv['debugged'] = false;


/********************************************************************************************
* HELPERS
*********************************************************************************************/

/*
Roast the user in the admin because ACF is not installed
*/
function _1p21_dv_acfpi_warn(){
    $class = 'notice notice-error';
    $message = __( 'Advanced Custom Fields is not installed. 1Point21 Data Vizualizer needs this plugin for complete functionality' );
    printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) ); 
}

/*
IDK D:
i might use later
*/
function _1p21_dv_convert_to_option($field_key){
    global $_1p21_dv;

}

function _1p21_dv_output_args($args) {

    echo '<div class="content" style="background:#ccc;font-size:10px;padding:1em;margin-bottom:1em;"><pre>';
    print_r($args);
    echo '</pre></div>';
}


/********************************************************************************************
* hooks and filters
*********************************************************************************************/
    
    // output the front end influenced global variable
    function _1p21_dv_output_what_the_fuck_is_going_on(){
        $debug = false;
        $debug = apply_filters('_1p21_dv_info',$debug);

            // echo 'boi';

            if($debug) {
                global $_1p21_dv;
                _1p21_dv_output_args($_1p21_dv);


            // }else{

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
    wp_enqueue_script( 'd3','https://d3js.org/d3.v5.min.js' );
}
add_action( 'wp_enqueue_scripts', '_1p21_dv_enqueue_scripts' );
  




/********************************************************************************************
* HELPERS BUT HMMM other ppl can use it i guess
*********************************************************************************************/
/*
Check if acf is installed
*/
if(!function_exists('acf_is_installed') ){
    function acf_is_installed(){
        return is_plugin_active( 'advanced-custom-fields-pro/acf.php' );
    }
}



if(!function_exists('get_data_visualization')){
    function get_data_visualization($id,$atts) {
        return _1p21_dv_data_visualization_arr($id,$atts);
    }
}

if(!function_exists('output_args')){
    function output_args($args) {
        _1p21_dv_output_args($args);
    }
}




/********************************************************************************************
* OK HERE WE GOOOOOOO
*********************************************************************************************/

if( !post_type_exists('data-visualization') ){


    /********************************************************************************************
    * Initialize post type
    *********************************************************************************************/
        // Register post type
            add_action( 'init', '_1p21_dv_init_cpt' );
            function _1p21_dv_init_cpt(){
                register_post_type(
                    'data-visualization',
                    array(
                        'menu_position' => 10,
                        'public'        => false,
                        'show_in_menu'  => true,
                        'show_ui'  => true,
                        'description'   => 'Data that is visually and interactively presented in the front end of the site',
                        'menu_icon'     => 'dashicons-chart-bar',
                        'hierchichal'   => false,
                        'rewrite'       => array(
                            'slug'      => 'data-visualization'
                        ),
                        'supports'      => array(
                            'title',
                            'author',
                            'revisions',
                            'custom-fields'
                        ),
                        'labels' => array(
                            'name'               => _x( 'Data visualizations', 'post type general name' ),
                            'singular_name'      => _x( 'Data visualization', 'post type singular name' ),
                            'menu_name'          => _x( 'Data visualizations', 'admin menu' ),
                            'name_admin_bar'     => _x( 'Data visualization', 'add new on admin bar' ),
                            'add_new'            => _x( 'Add New', 'data visualization' ),
                            'add_new_item'       => __( 'Add New data visualization' ),
                            'new_item'           => __( 'New data visualization' ),
                            'edit_item'          => __( 'Edit data visualization' ),
                            'view_item'          => __( 'View data visualization' ),
                            'all_items'          => __( 'All data visualizations' ),
                            'search_items'       => __( 'Search data visualizations' ),
                            'not_found'          => __( 'No data visualizations found.' ),
                            'not_found_in_trash' => __( 'No data visualizations found in Trash.' )

                        )
                    )
                );


                remove_post_type_support( 'data-visualization', 'editor' );
            }

            //flush 
                function _1p21_dv_flush(){
                    _1p21_dv_init_cpt();
                    flush_rewrite_rules();
                }

                register_activation_hook( __FILE__, '_1p21_dv_flush' );





    /********************************************************************************************
    * global settings fields
    *********************************************************************************************/
        // warn the user that acf is not installed so now they get an ugly version of this plugin
            if (!acf_is_installed()) {
                add_action( 'admin_notices', '_1p21_dv_acfpi_warn' );
            }

        //whitelist our group of options so WP knows they exist
            function _1p21_dv_options_register(){
                //register_setting(name of group, DB entry,  validator callback)
                register_setting(
                    '_1p21_dv_options_group',
                    '_1p21_dv_opts',
                    array(
                        'sanitize_callback' => '_1p21_dv_options_validate',
                        'default' => array(
                            'legacy_support'    => 'false'
                        )
                    )
                );	
            }
            add_action( 'admin_init', '_1p21_dv_options_register' );

            //add the page to the admin menu to hold our form
            function _1p21_dv_options_add_page(){
                //add_options_page(title, menu name, capability, slug, form callback);

                // add_options_page('Data Visualizer Settings', 'Data Visualizer Settings','manage_options', '1p21-dv-options-page', '_1p21_dv_options_build_form');
                
                if(acf_is_installed() || function_exists('acf_add_options_sub_page')){
                    acf_add_options_sub_page(array(
                        'capability'	=> 'edit_posts',
                        'redirect'		=> false,
                        'page_title' 	=> 'Data Visualizer Settings',
                        'menu_title' 	=> 'Data Visualizer Settings',
                        'menu_slug' 	=> '1p21-dv-settings',
                        'parent_slug' 	=> 'edit.php?post_type=data-visualization',
                    ));
                }else{
                    add_submenu_page('edit.php?post_type=data-visualization','Data Visualizer Settings', 'Data Visualizer Settings','manage_options', '1p21-dv-options-page', '_1p21_dv_options_build_form');
                }
            }
            add_action( 'admin_menu', '_1p21_dv_options_add_page',11 );


            //Draw the form for the page (name must match callback above)
            function _1p21_dv_options_build_form(){ ?>
                <div class="wrap">
                    <h2>Data Visualizations Settings</h2>
                    <form method="post" action="options.php"><!-- always use options.php when parsing options with WP -->
                    <?php 

                    //must match the name of the group from the register settings step. this associates the settings row to this form
                    settings_fields( '_1p21_dv_options_group' ); 
                    
                    //get current values from DB to prefill the form (use the DB row name)
                    $values = get_option( '_1p21_dv_opts' );
                    ?>
                    
                    
                    <p>
                        <label>
                            <input type="checkbox" name="_1p21_dv_opts[legacy_support]" <?= $values['legacy_support'] == true ? 'checked' : '' ?> /> Enable Legacy Support
                        </label>
                    </p>
                    
                    yeet
                    <p class="submit">
                        <input type="submit" value="Save Changes" class="button-primary" />
                    </p>		
                        
                    </form>
                </div>
            <?php }


            //validation
            function _1p21_dv_options_validate($input){
                /*
                
                //remove all HTML, PHP, Mysql from some inputs
                $input['company_phone'] = wp_filter_nohtml_kses($input['company_phone']);
                $input['support_email'] = wp_filter_nohtml_kses($input['support_email']);
                $input['message_source'] = wp_filter_nohtml_kses($input['message_source']);
                
                //for fields with allowed HTML
                $allowed_tags = array(
                    'br' => array(),
                    'p' => array(),
                    'em' => array(),
                    'b' => array(),
                    'strong' => array(),
                    'i' => array(),
                    'a' => array( //attributes allowed in this tag only:
                        'href' => array(),
                        'title' => array()
                    )
                );
                //allow HTML in the address for line breaks
                $input['company_address'] = wp_kses( $input['company_address'], $allowed_tags );
                $input['welcome_message'] = wp_kses($input['welcome_message'], $allowed_tags );
                
                //checkbox validation. turn the value to zero if not checked
                $input['show_quote'] = ( $input['show_quote'] == 1 ? 1 : 0 );
                
                */

                $input['legacy_support'] = wp_filter_nohtml_kses($input['legacy_support']);

                return $input;
            }

    /********************************************************************************************
    * individual cpt settings
    *********************************************************************************************/

    /********************************************************************************************
    * Render what the boi needs
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
        function _1p21_dv_data_visualization_arr($id = null,$atts = array()) {
            if(!$id) {
                return false;
            }
            global $_1p21_dv;
            //create Array of the metadata and content given on each boi
            $arr = array(
                'id'    => $id
            );

            if(!empty($atts)){
                $arr['settings'] = array();

                foreach($atts as $key=>$value){
                    if($key !== 'id') {
                        $atts[$key] = $value;
                    }
                }
            }


            return $arr;
        }
         
        
    
        function _1p21_div_data_visualizer_render($atts = array()){

            global $_1p21_dv;
            $args = shortcode_atts($_1p21_dv['defaults'],$atts);
            
            extract($args );
    
            $render = '';

            _1p21_dv_output_args($args);
    
            if($id) {

            
            //append array to the global variable to allow front end manipulation

                if(array_key_exists($id,$_1p21_dv['present'])) {
                    $_1p21_dv['present'][$id]['front']['instance']++;
                }else{
                    $_1p21_dv['present'][$id] = _1p21_dv_data_visualization_arr($id,$atts);

                    $_1p21_dv['present'][$id]['front'] = array(
                        'instance' => 1
                    );
                }
                

                //create array for front end information fr
                ;

                
    
                
    
                $wrapper_id = "data-visualizer-{$id}";
    
                if($_1p21_dv['present'][$id]['front']['instance'] > 1) {
                    $wrapper_id .= "-{$_1p21_dv['present'][$id]['front']['instance']}";
                }
    
    
                $_1p21_dv['present'][$id]['front']['wrapper_id'][] = $wrapper_id;
    
    
            
                $render = "<div id='$wrapper_id'>";
                $render .= "butthole";
                $render .= "</div>";

                ?>
                <div id="<?=$wrapper_id; ?>">
                    <div class="data-visualizer-wrapper">
                    
                    </div>

                    <script>

                        (function(window,d3){
                            document.addEventListener("DOMContentLoaded", function() {
                                var canvas = d3.select('#<?=$wrapper_id?> .data-visualizer-wrapper').append('svg');
                            });
                        }(window,d3));

                    </script>
                    <script id="locations-coordinates"  type="application/json" >
                        <?=json_encode($ilaw_map_coordinates); ?>
                    </script>
                    
                </div>

                <?php
            }else{
                ?>
                <div class="data-visualizer data-visualizer-no-data">
                    Sorry, data visualization doesn not exist
                </div>
                <?php
            }
        } 


    /********************************************************************************************
    * Shortcodes
    *********************************************************************************************/
    add_shortcode('data_visualizer', '_1p21_div_data_visualizer_render');

}else{
    add_action( 'admin_notices', function(){

        $class = 'notice notice-error';
        $message = __( '1p21 Data Vizualizer cannot work. a data-visualization post type already exists!' );
    
        printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) ); 
    } );
}


    


    /////test




    add_action('_1p21_dv_info',function(){ echo 'ass'; return true; },99);