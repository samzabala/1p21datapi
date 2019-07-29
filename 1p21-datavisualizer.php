<?php
/*
Plugin Name: 1Point21 Data Vizualizer
Plugin URI: https://www.1point21interactive.com/
Description: Data visualizer using d3 and svgs
Version: 1.0.0
Author: 1Point21 Interactive
Author URI: https://www.1point21interactive.com/
*/

function _1p21_dv_acf_not_installed(){
    $class = 'notice notice-error';
    $message = __( 'Advanced Custom Fields is not installed. The plugin is strongly recommended to be installed.' );
    printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) ); 
}

if( !post_type_exists('data-graph') ){
    echo 'butthole';


/********************************************************************************************
* Initialize post type
*********************************************************************************************/
        add_action( 'init', '_1p21_dv_init_cpt' );
        function _1p21_dv_init_cpt(){
            register_post_type(
                'data-graph',
                array(
                    'menu_position' => 10,
                    'public'        => false,
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
                    'capabilities'  => array(
                        'edit_post'          => 'edit_data_graph', 
                        'read_post'          => 'read_data_graph', 
                        'delete_post'        => 'delete_data_graph', 
                        'edit_posts'         => 'edit_data_graphs', 
                        'edit_others_posts'  => 'edit_others_data_graphs', 
                        'publish_posts'      => 'publish_data_graphs',       
                        'read_private_posts' => 'read_private_data_graphs', 
                        'create_posts'       => 'edit_data_graphs', 
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
* Create settings page
*********************************************************************************************/
        //whitelist our group of options so WP knows they exist
        function _1p21_dv_options_register(){
            //register_setting(name of group, DB entry,  validator callback)
            register_setting(
                '_1p21_dv_options_group',
                '_1p21_dv_opts',
                array(
                    'sanitize_callback' => '_1p21_dv_options_validate',
                    'default' => array(

                    )
                )
            );	
        }
        add_action( 'admin_init', '_1p21_dv_options_register' );

        //add the page to the admin menu to hold our form
        function _1p21_dv_options_add_page(){
            //add_options_page(title, menu name, capability, slug, form callback);
            add_submenu_page('edit.php?post_type=data-graph','Data Visualizer Settings', 'Data Visualizer Settings','manage_options', '1p21-dv-options-page', '_1p21_dv_options_build_form');
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
            return $input;
        }



/********************************************************************************************
* Create field groups + settings fields
*********************************************************************************************/

        if (!class_exists('ACF')) {
            
            add_action( 'admin_notices', '_1p21_dv_acf_not_installed' );
        }else{
            
        }





/********************************************************************************************
* Shortcodes
*********************************************************************************************/

}else{
    add_action( 'admin_notices', function(){

        $class = 'notice notice-error';
        $message = __( '1p21 Data Vizualizer cannot work. a data-graph post type already exists!' );
    
        printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) ); 
    } );
}