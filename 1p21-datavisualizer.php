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
$GLOBALS['1p21_dv'] = array();

//track visible data graphs in the front end to avoid script conflicts
$_1p21_dv = array();
$_1p21_dv['present'] = array();

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

}


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






if( !post_type_exists('data-graph') ){


    /********************************************************************************************
    * Initialize post type
    *********************************************************************************************/
        // Register post type
            add_action( 'init', '_1p21_dv_init_cpt' );
            function _1p21_dv_init_cpt(){
                register_post_type(
                    'data-graph',
                    array(
                        'menu_position' => 10,
                        'public'        => true,
                        'show_in_menu'  => true,
                        'show_ui'  => true,
                        'description'   => 'Data that is visually and interactively presented in the front end of the site',
                        'menu_icon'     => 'dashicons-chart-bar',
                        'hierchichal'   => false,
                        'rewrite'       => array(
                            'slug'      => 'data-graph'
                        ),
                        'supports'      => array(
                            'title',
                            'author',
                            'revisions',
                            'custom-fields'
                        ),
                        'labels' => array(
                            'name'               => _x( 'Data graphs', 'post type general name' ),
                            'singular_name'      => _x( 'Data graph', 'post type singular name' ),
                            'menu_name'          => _x( 'Data graphs', 'admin menu' ),
                            'name_admin_bar'     => _x( 'Data graph', 'add new on admin bar' ),
                            'add_new'            => _x( 'Add New', 'data graph' ),
                            'add_new_item'       => __( 'Add New data graph' ),
                            'new_item'           => __( 'New data graph' ),
                            'edit_item'          => __( 'Edit data graph' ),
                            'view_item'          => __( 'View data graph' ),
                            'all_items'          => __( 'All data graphs' ),
                            'search_items'       => __( 'Search data graphs' ),
                            'not_found'          => __( 'No data graphs found.' ),
                            'not_found_in_trash' => __( 'No data graphs found in Trash.' )

                        )
                    )
                );


                remove_post_type_support( 'data-graph', 'editor' );
            }

            //flush 
                function _1p21_dv_flush(){
                    _1p21_dv_init_cpt();
                    flush_rewrite_rules();
                }

                register_activation_hook( __FILE__, '_1p21_dv_flush' );





    /********************************************************************************************
    * Create field groups + settings fields
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
                        'parent_slug' 	=> 'edit.php?post_type=data-graph',
                    ));
                }else{
                    add_submenu_page('edit.php?post_type=data-graph','Data Visualizer Settings', 'Data Visualizer Settings','manage_options', '1p21-dv-options-page', '_1p21_dv_options_build_form');
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
    * Shortcodes
    *********************************************************************************************/
    
    function data_visualizer($atts, $content = null){
        static $instance = 1;


        extract(shortcode_atts(array(
            'id' => null,
        ), $atts));

        if($id) {
        
            $html = "<div id='data-visualizer-{$instance}'>";
            $html .= "</div>";
        }

        echo $html;
    } 
    add_shortcode('data_visualizer', 'data_visualizer');

}else{
    add_action( 'admin_notices', function(){

        $class = 'notice notice-error';
        $message = __( '1p21 Data Vizualizer cannot work. a data-graph post type already exists!' );
    
        printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) ); 
    } );
}